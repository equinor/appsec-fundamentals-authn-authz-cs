#!/usr/bin/env python
import logging

import uvicorn
from fastapi import FastAPI
from fastapi.security import HTTPBearer
from routes.episodes import router

from core.config import get_uvicorn_config

logger = logging.getLogger("uvicorn")

app = FastAPI(title='GOT Episodes',docs_url="/doc")
security = HTTPBearer()

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    server = uvicorn.Server(get_uvicorn_config())
    server.run()
