import requests
import os

# OAuth2 configuration
tenant_id = "YOUR_TENANT_ID"
client_id = "YOUR_CLIENT_ID"
redirect_uri = "YOUR_REDIRECT_URI"

# Getting client secret from the environment
client_secret = os.getenv("CLIENT_SECRET")

# Calculate the token endpoint
token_endpoint = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"

# Authorization code received in the redirect
authorization_code = "AUTHORIZATION_CODE_FROM_FIRST_LEG"

# Request parameters
data = {
    "grant_type": "authorization_code",
    "code": authorization_code,
    "redirect_uri": redirect_uri,
    "client_id": client_id,
    "client_secret": client_secret
}

# Send the POST request to get the access token
response = requests.post(token_endpoint, data=data)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    tokens = response.json()
    print(json.dumps(tokens, indent=4))
else:
    print("Failed to obtain token:", response.text)
