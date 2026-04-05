from pathlib import Path
import sys

from fastapi.testclient import TestClient
import pytest

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.main import create_app
from app.storage import Storage


@pytest.fixture
def storage() -> Storage:
    return Storage()


@pytest.fixture
def client(storage: Storage) -> TestClient:
    app = create_app(storage)
    with TestClient(app) as test_client:
        yield test_client
