import pytest
from unittest.mock import AsyncMock, MagicMock
from app.repositories.event import EventRepository
from app.models.event import Event

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def event_repo(mock_session):
    return EventRepository(mock_session)

@pytest.mark.asyncio
async def test_get_with_filters(event_repo, mock_session):
    mock_result = MagicMock()
    mock_events = [Event(title="Event 1"), Event(title="Event 2")]
    mock_result.scalars().all.return_value = mock_events
    mock_session.execute.return_value = mock_result

    # we pass some filters to ensure coverage runs over them (actual query building is mocked out)
    result = await event_repo.get_with_filters(city="Cairo", category_id="cat-id", status="published", search="Tech")

    assert result == mock_events
    mock_session.execute.assert_called_once()
    
@pytest.mark.asyncio
async def test_get_by_organizer(event_repo, mock_session):
    mock_result = MagicMock()
    mock_events = [Event(title="Event 1")]
    mock_result.scalars().all.return_value = mock_events
    mock_session.execute.return_value = mock_result

    result = await event_repo.get_by_organizer("org-123", status="draft")

    assert result == mock_events
    mock_session.execute.assert_called_once()
