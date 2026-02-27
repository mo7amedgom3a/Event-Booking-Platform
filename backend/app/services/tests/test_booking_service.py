import pytest
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from unittest.mock import AsyncMock, MagicMock
from app.services.booking_service import BookingService
from app.models.booking import Booking, BookingStatus
from app.models.event import Event
from app.schemas.booking import BookingCreate

@pytest.fixture
def mock_db():
    return AsyncMock()

@pytest.fixture
def booking_service(mock_db):
    service = BookingService(mock_db)
    service.repo = AsyncMock()
    service.event_repo = AsyncMock()
    return service

@pytest.mark.asyncio
async def test_create_booking_success(booking_service):
    # Setup
    user_id = uuid.uuid4()
    event_id = uuid.uuid4()
    booking_in = BookingCreate(event_id=event_id, number_of_seats=2)
    mock_booking = Booking(id=uuid.uuid4(), event_id=event_id, user_id=user_id, number_of_seats=2)
    
    booking_service.repo.create_booking_atomic.return_value = mock_booking
    
    # Execute
    result = await booking_service.create_booking(booking_in, user_id)
    
    # Assert
    assert result == mock_booking
    booking_service.repo.create_booking_atomic.assert_called_once_with(
        event_id=event_id, user_id=user_id, seats=2
    )

@pytest.mark.asyncio
async def test_create_booking_not_enough_seats_raises_http_exception(booking_service):
    # Setup
    user_id = uuid.uuid4()
    event_id = uuid.uuid4()
    booking_in = BookingCreate(event_id=event_id, number_of_seats=5)
    
    # Simulate repo raising an HTTPException from the atomic check
    booking_service.repo.create_booking_atomic.side_effect = HTTPException(status_code=400, detail="Not enough available seats")
    
    # Execute & Assert
    with pytest.raises(HTTPException) as exc:
        await booking_service.create_booking(booking_in, user_id)
        
    assert exc.value.status_code == 400
    assert "Not enough available seats" in exc.value.detail

@pytest.mark.asyncio
async def test_cancel_booking_success(booking_service):
    user_id = uuid.uuid4()
    booking_id = uuid.uuid4()
    event_id = uuid.uuid4()
    
    # Setup mock booking
    mock_booking = Booking(id=booking_id, event_id=event_id, user_id=user_id, status=BookingStatus.confirmed, number_of_seats=2)
    booking_service.repo.get.return_value = mock_booking
    
    # Setup mock event (starts 5 days from now)
    future_date = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=5)
    mock_event = Event(id=event_id, start_date_time=future_date, available_seats=50)
    booking_service.event_repo.get.return_value = mock_event
    
    booking_service.repo.update.return_value = Booking(status=BookingStatus.cancelled)
    
    # Execute
    result = await booking_service.cancel_booking(booking_id, user_id)
    
    # Assert
    booking_service.event_repo.update.assert_called_once_with(mock_event, {"available_seats": 52}) # restored 2 seats
    booking_service.repo.update.assert_called_once_with(mock_booking, {"status": BookingStatus.cancelled})
    assert result.status == BookingStatus.cancelled

@pytest.mark.asyncio
async def test_cancel_booking_within_24_hours_fails(booking_service):
    user_id = uuid.uuid4()
    booking_id = uuid.uuid4()
    event_id = uuid.uuid4()
    
    mock_booking = Booking(id=booking_id, event_id=event_id, user_id=user_id, status=BookingStatus.confirmed, number_of_seats=2)
    booking_service.repo.get.return_value = mock_booking
    
    # Setup mock event starting in 12 hours (violating the 24-hour rule)
    soon_date = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=12)
    mock_event = Event(id=event_id, start_date_time=soon_date, available_seats=50)
    booking_service.event_repo.get.return_value = mock_event
    
    # Execute & Assert
    with pytest.raises(HTTPException) as exc:
        await booking_service.cancel_booking(booking_id, user_id)
        
    assert exc.value.status_code == 400
    assert "Cannot cancel booking within 24 hours" in exc.value.detail

@pytest.mark.asyncio
async def test_cancel_booking_not_owned_by_user_fails(booking_service):
    user_id = uuid.uuid4()
    other_user_id = uuid.uuid4()
    booking_id = uuid.uuid4()
    
    # Booking belongs to other_user_id
    mock_booking = Booking(id=booking_id, user_id=other_user_id)
    booking_service.repo.get.return_value = mock_booking
    
    with pytest.raises(HTTPException) as exc:
        await booking_service.cancel_booking(booking_id, user_id)
        
    assert exc.value.status_code == 403
    assert "Not authorized" in exc.value.detail
