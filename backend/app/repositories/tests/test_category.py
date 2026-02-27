import pytest
from unittest.mock import AsyncMock, MagicMock
from app.repositories.category import CategoryRepository
from app.models.category import Category

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def category_repo(mock_session):
    return CategoryRepository(mock_session)

@pytest.mark.asyncio
async def test_get_by_slug(category_repo, mock_session):
    mock_result = MagicMock()
    mock_category = Category(name="Tech", slug="tech")
    mock_result.scalars().first.return_value = mock_category
    mock_session.execute.return_value = mock_result

    result = await category_repo.get_by_slug("tech")

    assert result == mock_category
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_get_by_slug_not_found(category_repo, mock_session):
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = None
    mock_session.execute.return_value = mock_result

    result = await category_repo.get_by_slug("nonexistent")

    assert result is None
    mock_session.execute.assert_called_once()
