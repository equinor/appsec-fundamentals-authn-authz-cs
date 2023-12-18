import pytest
from routes.episodes import get_all_episodes

@pytest.fixture
def patchenv(monkeypatch):
    # Use monkeypatch to modify the environment variable
    monkeypatch.setenv('TENANT_ID', 'test_tenant_id')
    monkeypatch.setenv('CLIENT_ID', 'test_client_id')
    monkeypatch.setenv('CLIENT_SECRET', 'test_client_secret')
    monkeypatch.setenv('EPISODES_API_URI', 'test_episodes_api_uri')
    monkeypatch.setenv('QUOTES_API_URL', 'https://test_quotes_api.url')
    monkeypatch.setenv('QUOTES_API_URI', 'test_quotes_api_uri')
    monkeypatch.setenv('PORT', '7777')
    monkeypatch.setenv('HOST', 'test_host')

    def mock_get_token_endpoint(well_known_conf_url: str):
        return "https://login.microsoftonline.com/test_tenant_id/oauth2/v2.0/token"

    def mock_get_obo_token(assertion: str):
        return "mocked_obo_token"

    def mock_get_all_episodes():
        sample_episodes = [
            {"id": 1, "title": "Episode 1", "season": 1},
            {"id": 2, "title": "Episode 2", "season": 2},
        ]
        return sample_episodes

    def mock_get_random_quote(obo_token: str):
        return {"title": "test_completed"}

    monkeypatch.setattr("routes.episodes.get_obo_token", mock_get_obo_token)
    monkeypatch.setattr("core.auth.get_token_endpoint", mock_get_token_endpoint)
    monkeypatch.setattr("controller.episodes_controller.get_all_episodes", mock_get_all_episodes)
    monkeypatch.setattr("controller.episodes_controller.get_random_quote", mock_get_random_quote)

    yield monkeypatch

def test_get_all_episodes(patchenv):
    expected = [
        {'id': 1, 'title': 'Episode 1', 'season': 1}, 
        {'id': 2, 'title': 'Episode 2', 'season': 2}, 
        {'id': 'Quote:', 'title': 'test_completed', 'season': 9999}
    ]
    response = get_all_episodes("mock_access_token")
    assert response == expected