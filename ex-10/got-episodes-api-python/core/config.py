import uvicorn, os
from pydantic import HttpUrl, ValidationError
from pydantic_settings import BaseSettings

class AppSettings(BaseSettings):
    tenant_id: str
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
            tenant_id= os.environ['TENANT_ID'],
            issuer = f"https://sts.windows.net/{os.environ['TENANT_ID']}/",
            port = os.environ['PORT'],
            host =  os.environ['HOST'],
            jwks_uri = f"https://login.microsoftonline.com/{os.environ['TENANT_ID']}/discovery/v2.0/keys",
            api_audience= "api://8ef64324-1718-4fbb-ad40-1bb8984467c0"
        )
    except ValidationError as exc:
        print(repr(exc.errors()[0]['type']))
    return app_settings

