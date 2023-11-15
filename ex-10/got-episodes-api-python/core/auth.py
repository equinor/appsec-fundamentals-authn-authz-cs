from authlib.jose import JsonWebToken
from core.config import get_settings

import base64, json, logging, requests

logger = logging.getLogger("uvicorn")
config = get_settings()

jwks = requests.get(config.jwks_uri).json()

claims_options = {
    "iss": { "essential": True, "value": str(config.issuer) },
    "aud": { "essential": True, "value": config.api_audience }
}

def authVerify(token):
    header = json.loads(base64.b64decode(token.split(".")[0]))
    logger.info(f"Verify token with header: {header},  {token}")
    jwt = JsonWebToken(header["alg"])
    claims = jwt.decode(token, jwks, claims_options=claims_options)
    claims.validate()
    logger.info(f"Token verified OK")
