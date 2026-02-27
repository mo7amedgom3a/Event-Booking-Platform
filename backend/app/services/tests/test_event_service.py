import pytest
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from unittest.mock import AsyncMock

from app.services.event_service import EventService
from app.models.event import Event
from app.schemas.event import EventUpdate

@pytest.fixture
def mock_db():
    return AsyncMock()

@pytest.fixture
def event_service(mock_db):
    service = EventService(mock_db)
    service.repo = AsyncMock()
    return service

@pytest.mark.asyncio
async def test_update_event_ownership_success(event_service):
    organizer_id = uuid.uuid4()
    event_id = str(uuid.uuid4())
    
    future_date = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)
    mock_event = Event(id=event_id, organizer_id=organizer_id, start_date_time=future_date)
    event_service.repo.get.return_value = mock_event
    
    update_data = EventUpdate(title="New Title")
    event_service.repo.update.return_value = Event(title="New Title")
    
    # Should succeed because the current user matches the organizer_id
    result = await event_service.update_event(event_id, update_data, organizer_id)
    
    event_service.repo.update.assert_called_once()
    assert result.title == "New Title"

@pytest.mark.asyncio
async def test_update_event_wrong_owner_raises_403(event_service):
    organizer_id = uuid.uuid4()
    hacker_id = uuid.uuid4()
    event_id = str(uuid.uuid4())
    
    mock_event = Event(id=event_id, organizer_id=organizer_id)
    event_service.repo.get.return_value = mock_event
    
    update_data = EventUpdate(title="Hacked Title")
    
    # Hack attempt
    with pytest.raises(HTTPException) as exc:
        await event_service.update_event(event_id, update_data, hacker_id)
        
    assert exc.value.status_code == 403
    assert "Not authorized" in exc.value.detail

@pytest.mark.asyncio
async def test_update_past_event_raises_400(event_service):
    organizer_id = uuid.uuid4()
    event_id = str(uuid.uuid4())
    
    # Event in the past
    past_date = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=2)
    mock_event = Event(id=event_id, organizer_id=organizer_id, start_date_time=past_date)
    event_service.repo.get.return_value = mock_event
    
    update_data = EventUpdate(title="Tried to update past event")
    
    with pytest.raises(HTTPException) as exc:
        await event_service.update_event(event_id, update_data, organizer_id)
        
    assert exc.value.status_code == 400
    assert "Cannot update events that have already started" in exc.value.detail
