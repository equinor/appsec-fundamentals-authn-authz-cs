import pytest
from controller.episodes_controller import get_all_episodes, get_episode, add_episode, update_episode, delete_episode
from data.got_demo_data import episodes
from data.models import Episode

@pytest.fixture
def patchenv(monkeypatch):
    test_episodes = [
        {"id": "1", "title": 'Winter is coming',                        "season": 1},
        {"id": "2", "title": 'The Kingsroad',                           "season": 1},
        {"id": "3", "title": 'Lord Snow',                               "season": 1},
        {"id": "4", "title": 'Cripples, Bastards and Broken Things',    "season": 1},
        {"id": "5", "title": 'The Wolf and the Lion',                   "season": 1},
        {"id": "6", "title": 'A Golden Crown',                          "season": 1},
        {"id": "7", "title": 'You Win or You Die',                      "season": 1},
        {"id": "8", "title": 'The Pointy End',                          "season": 1},
        {"id": "9", "title": 'Bealor',                                  "season": 1},
        {"id": "10", "title": 'Fire and Blood',                          "season": 1},
    ]    
    monkeypatch.setattr("data.got_demo_data.episodes", test_episodes)
    monkeypatch.setattr("controller.episodes_controller.episodes", test_episodes)
    yield monkeypatch    

def test_get_all_episodes(patchenv):
    response = get_all_episodes()
    assert response == episodes

def test_get_episode():
    episode_id = "1" 
    response = get_episode(episode_id)
    assert response["id"] == episode_id

def test_add_episode(patchenv):
    episode_data = Episode(
        id = "0",
        title = "Test Episode",
        season = 1001,
    )
    response = add_episode(episode_data)
    assert response["id"] == "11"

def test_update_episode(patchenv):
    episode_id = "10"
    episode_data = Episode(
        id = episode_id,
        title = "Test Episode",
        season = 42,
    )     
    response = update_episode(episode_id, episode_data)
    assert response["id"] == episode_data.id
    assert response["season"] == episode_data.season

def test_delete_episode(patchenv):
    episode_id = "1"
    delete_episode(episode_id)
    with pytest.raises(Exception):
        get_episode(episode_id)

