import httpx
import asyncio
from typing import List, Dict
from azure.identity.aio import AzureCliCredential
from rich.table import Table
from rich.console import Console
from rich.spinner import Spinner
from rich.live import Live

###
### Script to identify owners of potential orphaned app registrations
### in Azure AD. The script will list all app registrations containing
### a specific keyword in the display name, and list the owners of each
###

async def get_app_registrations_with_owners(keyword: str) -> List[Dict]:

    # Fetch token asynchronously using Azure CLI credentials
    credential = AzureCliCredential()
    scopes = ['https://graph.microsoft.com/.default']
    token = await credential.get_token(*scopes)

    # Define the Graph API endpoint
    app_registrations_url = "https://graph.microsoft.com/v1.0/applications"
    owners_url = "https://graph.microsoft.com/v1.0/applications/{id}/owners"

    # Query parameters for the app registration search
    params = {
        "$search": f'"displayName:{keyword}"',
        "$select": "id,displayName"
    }

    # Set up headers with the token. ConsistencyLevel is needed for the search functionality
    headers = {
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json",
        "ConsistencyLevel": "eventual"
    }

    # Asynchronously fetch service principals (app registrations)
    async with httpx.AsyncClient() as client:
        response = await client.get(app_registrations_url, headers=headers, params=params)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch service principals: {response.status_code} - {response.text}")

        service_principals = response.json()
        
        # Fetch owners for each service principal
        results = []
        for sp in service_principals.get("value", []):
            sp_id = sp["id"]
            sp_display_name = sp["displayName"]
            owner_response = await client.get(owners_url.format(id=sp_id), headers=headers)
            if owner_response.status_code != 200:
                raise Exception(f"Failed to fetch owners for {sp_id}: {owner_response.status_code} - {owner_response.text}")

            owners = owner_response.json()
            results.append({
                "id": sp_id,
                "displayName": sp_display_name,
                "owners": [o.get("userPrincipalName","") for o in owners.get("value", [])]
            })
        
        return results


async def main():

    keyword = input("Filter app-registrationg (return for 'appsec-course'): ").strip()
    keyword = "appsec-course" if keyword == "" else keyword
    
    # Fetch app registrations containing the keyword from Azure AD
    console = Console()
    spinner = Spinner("dots", text="Processing...", speed=1)
    with Live(spinner, refresh_per_second=25, console=console):
        app_registrations = await get_app_registrations_with_owners(keyword)
    
    # Prepare a table to display the results
    table = Table(title=f"Azure Entra App Registrations Containing '{keyword}'", show_lines=True)
    table.add_column("App Registration (ClientID)", style="magenta")
    table.add_column("Display Name", style="cyan")
    table.add_column("Owners", style="yellow")
    
    # Gather app registrations and owners
    mailto = []
    for app in sorted(app_registrations, key=lambda x: x["displayName"]):
        owners = app["owners"]
        owners_str = "\n".join([ f"{owner}" for owner in owners ]) if owners else "No owners"
        table.add_row(
            app['id'] or 'N/A', 
            app['displayName'] or 'N/A', 
            owners_str
        )
        mailto.extend([ f"{owner}" for owner in owners ]) if owners else None

    # Print the table
    console.print(table)
    print(f"\nTotal App Registrations matching '{keyword}': {len(app_registrations)}")

    # Print owners for follow-up
    # one email pr line to easily copy-paste into email client
    print("\nMail to owners:")
    print("-----------")
    for owner in set(mailto):
        print(owner)    

if __name__ == "__main__":
    asyncio.run(main())    