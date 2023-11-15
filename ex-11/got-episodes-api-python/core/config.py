import os
import uvicorn
import logging
from pydantic import HttpUrl, ValidationError
from pydantic_settings import BaseSettings

logger = logging.getLogger("uvicorn")

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
        app="main:app",         # Specify the ASGI application to run
        host="0.0.0.0",
        port=3100,
        log_level="info",
        reload=True,
        workers=1,              # Number of worker processes. Default is the number of CPU cores
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
