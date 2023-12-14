import base64
import json
import requests
import logging
from authlib.jose import JsonWebToken
from core.config import get_settings, get_claims_options

logger = logging.getLogger("uvicorn")

def get_jwks(jwks_uri: str):
    return requests.get(jwks_uri).json()

def get_token_endpoint(well_known_conf_url: str):
    return requests.get(well_known_conf_url).json()["token_endpoint"]

def authVerify(token: str):
    config = get_settings()
    claims_options = get_claims_options()
    header = json.loads(base64.b64decode(token.split(".")[0]))
    logger.info(f"Verify token with header: {header}")
    logger.info(f"Claims options: {claims_options = }")
    jwt = JsonWebToken(header["alg"])
    jwks = get_jwks(config.jwks_uri)
    claims = jwt.decode(token, jwks, claims_options=claims_options)
    claims.validate()
    logger.warning("Token verified OK")
