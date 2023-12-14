import pytest
from unittest.mock import Mock
from api_episodes.core import auth

@pytest.fixture
def mock_decode(mocker):
    mock = Mock()
    mocker.patch('jwt.decode', return_value=mock)
    return mock

def test_authVerify(mock_decode):
    mock_decode.return_value = {'sub': 'test_sub'}
    result = auth.authVerify('test_token')
    assert result == {'sub': 'test_sub'}