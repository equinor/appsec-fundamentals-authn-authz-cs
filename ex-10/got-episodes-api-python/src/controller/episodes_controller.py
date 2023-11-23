# controllers.py
from venv import logger
import requests
from fastapi import HTTPException, Depends
from typing import List
from data.models import Episode
from data.got_demo_data import episodes
from core.config import get_settings
from logging import getLogger

logger = getLogger("uvicorn")

def get_all_episodes() -> List[Episode]:
    return episodes

def get_random_quote(obo_token: str):
    config = get_settings()
    quote_endpoint = f"{ config.quotes_api_url }api/quote"
    quote_headers = {"Authorization": f"Bearer {obo_token}"}
    logger.warning(f"{quote_endpoint = }")
    quote = requests.get(url= quote_endpoint, headers = quote_headers)
    logger.info(f"Got a quote: {quote} {repr(quote)}")
    return quote.json()

def get_episode(episode_id: int) -> Episode:
    episode = next((ep for ep in episodes if ep['id'] == episode_id), None)
    if episode:
        return episode
    else:
        raise HTTPException(status_code=404, detail="Episode not found")

def add_episode(episode_data: Episode) -> Episode:
    new_episode = episode_data.dict()
    new_episode['id'] = max(ep['id'] for ep in episodes) + 1
    episodes.append(new_episode)
    return new_episode

def update_episode(episode_id: int, episode_data: Episode) -> Episode:
    for index, current_episode in enumerate(episodes):
        if current_episode['id'] == episode_id:
            updated_episode = episode_data.dict()
            updated_episode['id'] = episode_id
            episodes[index] = updated_episode
            return updated_episode
    else:
        raise HTTPException(status_code=404, detail="Episode not found")

def delete_episode(episode_id: int) -> None:
    global episodes
    episodes = [ep for ep in episodes if ep['id'] != episode_id]
    if len(episodes) == len(episodes):
        raise HTTPException(status_code=404, detail="Episode not found")

