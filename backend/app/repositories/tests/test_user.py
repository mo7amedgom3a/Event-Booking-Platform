import pytest
from unittest.mock import AsyncMock, MagicMock
from app.repositories.user import UserRepository
from app.models.user import User

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def user_repo(mock_session):
    return UserRepository(mock_session)

@pytest.mark.asyncio
async def test_get_by_email(user_repo, mock_session):
    mock_result = MagicMock()
    mock_user = User(email="test@example.com", first_name="Test", last_name="User", password_hash="hash")
    mock_result.scalars().first.return_value = mock_user
    mock_session.execute.return_value = mock_result

    result = await user_repo.get_by_email("test@example.com")

    assert result == mock_user
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_get_by_email_not_found(user_repo, mock_session):
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = None
    mock_session.execute.return_value = mock_result

    result = await user_repo.get_by_email("nonexistent@example.com")

    assert result is None
    mock_session.execute.assert_called_once()
