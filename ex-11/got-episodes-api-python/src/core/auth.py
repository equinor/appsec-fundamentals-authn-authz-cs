import time
import base64
import json
import requests
import logging
from authlib.jose import JsonWebToken
from authlib.jose.errors import InvalidClaimError, UnsupportedAlgorithmError, InvalidTokenError
from core.config import get_settings, get_claims_options, get_well_known_conf_url
from requests.exceptions import ConnectionError
from fastapi import HTTPException

logger = logging.getLogger("uvicorn")

def get_jwks(jwks_uri: str):
    return requests.get(jwks_uri).json()

def get_token_endpoint(well_known_conf_url: str):
    return requests.get(well_known_conf_url).json()["token_endpoint"]

def authVerify(token: str) -> None:
    try:
        config = get_settings()
        claims_options = get_claims_options()
        header = json.loads(base64.b64decode(token.split(".")[0]))
        logger.info(f"Verify token with header: {header}")
        logger.info(f"Claims options: {claims_options = }")
        
        jwt = JsonWebToken(["RS256"]) # Only allow RS256
        jwks = get_jwks(config.jwks_uri)
        claims = jwt.decode(token, jwks, claims_options=claims_options)
        claims.validate(now=time.time(), leeway=1)

        # Make sure one of the required scopes is present
        if not set(claims["scp"].split()).issubset(config.required_scope):
            logger.error(f"One of the required scopes '{config.required_scope}' is missing from token")
            raise HTTPException(status_code=403, detail="Insufficient privileges")

        logger.info("Token verified OK") 

    except (ConnectionError) as e:
        logger.error(f"Failed to get JWKS: {e}")
        raise HTTPException(status_code=500, detail="Failed to get JWKS")
    except (TypeError, InvalidClaimError, UnsupportedAlgorithmError, InvalidTokenError) as e:
        logger.error(f"Token validation failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

def get_obo_token(assertion: str):
    config = get_settings()
    well_known_conf_url = get_well_known_conf_url(config)
    logger.info("Trying use the episode-api token as assertion for a new quote-api token using O-B-O")
    headers = {"Content-Type" : "application/x-www-form-urlencoded"}

    requestForm = {
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "client_id": config.client_id,
            "client_secret": config.client_secret,
            "assertion": assertion,
            "scope": f"{config.quotes_api_uri}/Quote.Read",
            "requested_token_use": "on_behalf_of",
        }
    tokenEndpoint = get_token_endpoint(well_known_conf_url)
    oboToken = requests.post(tokenEndpoint, data=requestForm, headers=headers).json()
    logger.warning(f"Received OBO token: {oboToken}")
    return oboToken["access_token"]
