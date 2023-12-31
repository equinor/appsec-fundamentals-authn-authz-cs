from fastapi import HTTPException
from typing import List
from data.models import Episode
from data.got_demo_data import episodes
from logging import getLogger

logger = getLogger("uvicorn")

def get_all_episodes() -> List[Episode]:
    return episodes

def get_episode(episode_id: int) -> Episode:
    episode = next((ep for ep in episodes if ep['id'] == episode_id), None)
    if episode:
        return episode
    else:
        raise HTTPException(status_code=404, detail="Episode not found")

def add_episode(episode_data: Episode) -> Episode:
    new_episode = episode_data.model_dump()
    new_episode['id'] = str(max(int(ep['id']) for ep in episodes) + 1)
    episodes.append(new_episode)
    return new_episode

def update_episode(episode_id: str, episode_data: Episode) -> Episode:
    for index, current_episode in enumerate(episodes):
        if current_episode['id'] == episode_id:
            updated_episode = episode_data.model_dump()
            updated_episode['id'] = episode_id
            episodes[index] = updated_episode
            return updated_episode
    else:
        raise HTTPException(status_code=404, detail="Episode not found")

def delete_episode(episode_id: str) -> None:
    global episodes
    before = len(episodes)
    episodes = [ep for ep in episodes if ep['id'] != episode_id]
    after = len(episodes)
    if before == after:
        raise HTTPException(status_code=404, detail="Episode not found")

