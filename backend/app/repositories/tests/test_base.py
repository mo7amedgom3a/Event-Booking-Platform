import pytest
from unittest.mock import AsyncMock, MagicMock
from app.repositories.base import BaseRepository
from app.models.category import Category

@pytest.fixture
def mock_session():
    session = AsyncMock()
    return session

@pytest.fixture
def base_repo(mock_session):
    # Using Category as a concrete model to test BaseRepository
    return BaseRepository(Category, mock_session)

@pytest.mark.asyncio
async def test_get(base_repo, mock_session):
    mock_result = MagicMock()
    mock_instance = Category(id="123", name="Test")
    mock_result.scalars().first.return_value = mock_instance
    mock_session.execute.return_value = mock_result

    result = await base_repo.get("123")

    assert result == mock_instance
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_get_all(base_repo, mock_session):
    mock_result = MagicMock()
    mock_instances = [Category(id="1", name="Test1"), Category(id="2", name="Test2")]
    mock_result.scalars().all.return_value = mock_instances
    mock_session.execute.return_value = mock_result

    result = await base_repo.get_all(skip=0, limit=10)

    assert result == mock_instances
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_create(base_repo, mock_session):
    obj_in = {"name": "New Category", "slug": "new-category"}
    
    result = await base_repo.create(obj_in)

    assert result.name == "New Category"
    assert result.slug == "new-category"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_update(base_repo, mock_session):
    db_obj = Category(name="Old Name", slug="old-slug")
    obj_in = {"name": "Updated Name"}
    
    result = await base_repo.update(db_obj, obj_in)

    assert result.name == "Updated Name"
    # Slug should remain unchanged
    assert result.slug == "old-slug"
    mock_session.add.assert_called_once_with(db_obj)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(db_obj)

@pytest.mark.asyncio
async def test_delete(base_repo, mock_session, mocker):
    mock_instance = Category(id="123", name="Test")
    # Mock the get method of base_repo
    mocker.patch.object(base_repo, 'get', return_value=mock_instance)
    
    result = await base_repo.delete("123")

    assert result is True
    mock_session.delete.assert_called_once_with(mock_instance)
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_delete_not_found(base_repo, mock_session, mocker):
    mocker.patch.object(base_repo, 'get', return_value=None)
    
    result = await base_repo.delete("123")

    assert result is False
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()
