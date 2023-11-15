from authlib.jose import JsonWebToken
from core.config import get_settings

import base64
import json
import logging
import requests

logger = logging.getLogger("uvicorn")
config = get_settings()

jwks = requests.get(config.jwks_uri).json()

claims_options = {
    "iss": { "essential": True, "value": str(config.issuer) },
    "aud": { "essential": True, "value": config.api_audience }
}

well_known_conf_url = f"https://login.microsoftonline.com/{config.tenant_id}/v2.0/.well-known/openid-configuration"
tokenEndpoint = requests.get(well_known_conf_url).json()["token_endpoint"]

def authVerify(token):
    header = json.loads(base64.b64decode(token.split(".")[0]))
    logger.info(f"Verify token with header: {header}")
    logger.info(f"Claims options: {claims_options = }")
    jwt = JsonWebToken(header["alg"])
    claims = jwt.decode(token, jwks, claims_options=claims_options)
    claims.validate()
    logger.warning("Token verified OK")

def get_obo_token(assertion):
    logger.info("Trying use the episode-api token as assertion for a new quote-api token using O-B-O");
    headers = {"Content-Type" : "application/x-www-form-urlencoded"}

    requestForm = {
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "client_id": config.client_id,
            "client_secret": config.client_secret,
            "assertion": assertion,
            "scope": f"api://{config.quotes_api_uri}/Quote.Read",
            "requested_token_use": "on_behalf_of",
        }
    oboToken = requests.post(tokenEndpoint, data=requestForm, headers=headers).json()
    logger.warning(f"Got me an OBO token: {oboToken}")
    return oboToken["access_token"]




