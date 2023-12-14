import pytest
from src.data.models import Episode
from src.data.got_demo_data import episodes

@pytest.fixture
def sample_episode():
    return Episode(id="1", title="Winter is Coming", season=1)

def test_create_valid_episode(sample_episode):
    assert sample_episode.id == "1"
    assert sample_episode.title == "Winter is Coming"
    assert sample_episode.season == 1

def test_valid_episodes_data():
    assert len(episodes) == 10, "There should be 10 episodes"
    ids = [episode['id'] for episode in episodes]
    assert len(ids) == len(set(ids)), "All ids should be unique"