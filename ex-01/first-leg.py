import urllib.parse

# OAuth2 configuration
tenant_id = "YOUR_TENANT_ID"
client_id = "YOUR_CLIENT_ID"
redirect_uri = "YOUR_REDIRECT_URI"
authorization_endpoint = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize"

# Requested permissions/scope
scope = "openid profile"  
state = "1234"          # optional but recommended for security, CSRF

# Construct the authorization URL
params = {
    "response_type": "code",
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "scope": scope,
    "state": state
}

authorization_url = authorization_endpoint + "?" + urllib.parse.urlencode(params)
print("Authorization URL:\n\n", authorization_url)
