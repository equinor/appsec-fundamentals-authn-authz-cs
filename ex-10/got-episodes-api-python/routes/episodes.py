# routes/episodes.py
import logging
from typing import List

from controller import episodes_controller
from data.models import Episode
from fastapi import APIRouter, Body, Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer

from core.auth import authVerify

logger = logging.getLogger("uvicorn")
security = HTTPBearer()

def get_token_header(authorization: str = Depends(security)):
    if authorization.credentials:
        token = authorization.credentials
        authVerify(token)
        return token
    else:
        raise HTTPException(status_code=401, detail="Invalid or missing Authorization header")

router = APIRouter(dependencies=[Depends(get_token_header)])

@router.get("/episodes", response_model=List[Episode])
def get_all_episodes(token: str = Depends(get_token_header)):
    logger.info(f"Nice token: {token[:5]}...{token[-5:]}")
    return episodes_controller.get_all_episodes()

@router.get("/episodes/{episode_id}", response_model=Episode)
def get_episode(episode_id: int):
    return episodes_controller.get_episode(episode_id)

@router.post("/episodes", response_model=Episode, status_code=status.HTTP_201_CREATED)
def add_episode(episode: Episode):
    return episodes_controller.add_episode(episode)

@router.put("/episodes/{episode_id}", response_model=Episode)
def update_episode(episode_id: int, episode: Episode = Body(...)):
    return episodes_controller.update_episode(episode_id, episode)

@router.delete("/episodes/{episode_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_episode(episode_id: int):
    episodes_controller.delete_episode(episode_id)
    return {"msg": f"Episode with ID {episode_id} has been deleted."}
