import os
import pytest
import uvicorn
from pydantic import HttpUrl
from core.config import AppSettings, get_settings, get_claims_options, get_uvicorn_config

# monkeypatch the environment
@pytest.fixture
def patchenv(monkeypatch):
    # Use monkeypatch to modify the environment variable
    monkeypatch.setenv('TENANT_ID', 'test_tenant_id')
    monkeypatch.setenv('PORT', '7777')
    monkeypatch.setenv('HOST', 'test_host')

    yield monkeypatch

def test_valid_app_settings(patchenv):
    config = get_settings()
    assert isinstance(config, AppSettings)
    assert config.tenant_id == 'test_tenant_id'
    assert config.port == 7777
    assert config.host == 'test_host'
    # Generated
    assert config.jwks_uri == HttpUrl(f"https://login.microsoftonline.com/{config.tenant_id}/discovery/v2.0/keys")
    assert config.api_audience == f"api://00000000-7e57-c0de-0000-000000000000"
    assert config.issuer == HttpUrl(f"https://sts.windows.net/{config.tenant_id}/")

def test_missing_environment_variables():
    with pytest.raises(KeyError):
        get_settings()

def test_get_uvicorn_config(patchenv):
    patchenv.setenv('PYTHON_ENV', 'development')
    uvicorn_config = get_uvicorn_config()
    assert isinstance(uvicorn_config,uvicorn.Config)
    assert uvicorn_config.log_level == 'debug'

def test_get_claims_options(patchenv):
    expected_claims_options = {
        "iss": {"essential": True, "value": f"https://sts.windows.net/{os.environ['TENANT_ID']}/",},
        "aud": {"essential": True, "value": f"api://00000000-7e57-c0de-0000-000000000000"},
    }
    result_claims_options = get_claims_options()
    assert result_claims_options == expected_claims_options
