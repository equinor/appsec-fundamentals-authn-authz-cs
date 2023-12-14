import os
import uvicorn
from logging import getLogger
from pydantic import HttpUrl, ValidationError
from pydantic_settings import BaseSettings

logger = getLogger("uvicorn")

class AppSettings(BaseSettings):
    tenant_id: str
    client_id: str
    client_secret: str
    episodes_api_uri: str
    quotes_api_url: HttpUrl
    quotes_api_uri: str
    issuer: HttpUrl
    port: int
    host: str
    jwks_uri: HttpUrl
    api_audience: str

def get_uvicorn_config():
    return uvicorn.Config(
        app="main:app",
        host = None, # allows for both ip4 and ip6
        port=int(os.environ.get('PORT', 3100)),
        log_level = 'debug' if os.environ.get('PYTHON_ENV') == 'development' else 'info',
        reload=True,
        workers=1,
        access_log=True,
    )

def get_settings():
    try:
        app_settings = AppSettings(
            tenant_id = os.environ['TENANT_ID'],
            client_id = os.environ['CLIENT_ID'],
            client_secret = os.environ['CLIENT_SECRET'],
            episodes_api_uri = os.environ['EPISODES_API_URI'],
            quotes_api_uri = os.environ['QUOTES_API_URI'],
            quotes_api_url = os.environ['QUOTES_API_URL'],
            issuer = f"https://sts.windows.net/{os.environ['TENANT_ID']}/",
            port = os.environ.get('PORT', 3100),
            host =  os.environ.get('HOST', '127.0.0.1'),
            jwks_uri = f"https://login.microsoftonline.com/{os.environ['TENANT_ID']}/discovery/v2.0/keys",
            api_audience= f"api://{os.environ.get('EPISODES_API_URI', '251bc275-eed7-49d6-83b3-9005c9779574')}"
        )
    except ValidationError as exc:
        for err in exc.errors():
            logger.warning(f"{err['type']}: {', '.join(err['loc'])}")
        exit(1)
    return app_settings

def get_well_known_conf_url(config: AppSettings):
    return f"https://login.microsoftonline.com/{config.tenant_id}/v2.0/.well-known/openid-configuration"

def get_claims_options():
    config = get_settings()
    return {
        "iss": { "essential": True, "value": str(config.issuer) },
        "aud": { "essential": True, "value": config.api_audience }
    }