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
        host="0.0.0.0",
        port=3100,
        log_level="info",
        reload=True,
        workers=1,
        access_log=True,
    )

def get_settings():
    try:
        app_settings = AppSettings(
            tenant_id = os.environ['TENANT_ID'],
            client_id = os.environ['CLIENT_ID'],
            episodes_api_uri = os.environ['EPISODES_API_URI'],
            issuer = f"https://sts.windows.net/{os.environ['TENANT_ID']}/",
            port = os.environ['PORT'],
            host =  os.environ['HOST'],
            jwks_uri = f"https://login.microsoftonline.com/{os.environ['TENANT_ID']}/discovery/v2.0/keys",
            api_audience= f"api://{os.environ['EPISODES_API_URI']}"
        )
    except ValidationError as exc:
        for err in exc.errors():
            logger.warning(f"{err['type']}: {', '.join(err['loc'])}")
        exit(1)
    return app_settings

def get_claims_options():
    config = get_settings()
    return {
        "iss": { "essential": True, "value": str(config.issuer) },
        "aud": { "essential": True, "value": config.api_audience }
    }