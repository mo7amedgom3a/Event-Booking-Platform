import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.repositories.booking import BookingRepository
from app.models.booking import Booking, BookingStatus
from app.models.event import Event

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def booking_repo(mock_session):
    return BookingRepository(mock_session)

@pytest.mark.asyncio
async def test_get_by_user(booking_repo, mock_session):
    mock_result = MagicMock()
    mock_bookings = [Booking(id="1")]
    mock_result.scalars().all.return_value = mock_bookings
    mock_session.execute.return_value = mock_result

    result = await booking_repo.get_by_user("user_1", status=BookingStatus.confirmed)
    assert result == mock_bookings
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_get_by_event(booking_repo, mock_session):
    mock_result = MagicMock()
    mock_bookings = [Booking(id="1")]
    mock_result.scalars().all.return_value = mock_bookings
    mock_session.execute.return_value = mock_result

    result = await booking_repo.get_by_event("event_1")
    assert result == mock_bookings

@pytest.mark.asyncio
async def test_get_by_reference(booking_repo, mock_session):
    mock_result = MagicMock()
    mock_booking = Booking(id="1", booking_reference="REF")
    mock_result.scalars().first.return_value = mock_booking
    mock_session.execute.return_value = mock_result

    result = await booking_repo.get_by_reference("REF")
    assert result == mock_booking

@pytest.mark.asyncio
async def test_create_booking_atomic_success(booking_repo, mock_session):
    # Mock finding an event with enough seats
    mock_result = MagicMock()
    mock_event = Event(id="event_1", available_seats=10, price=50.0)
    mock_result.scalars().first.return_value = mock_event
    mock_session.execute.return_value = mock_result

    result = await booking_repo.create_booking_atomic(event_id="event_1", user_id="user_1", seats=2)

    # State modifications
    assert mock_event.available_seats == 8
    
    # Check returned booking props
    assert result.event_id == "event_1"
    assert result.user_id == "user_1"
    assert result.number_of_seats == 2
    assert result.total_amount == 100.0  # 50.0 * 2
    assert result.booking_reference.startswith("BK-")

    # The session should have added the updated event and new booking
    assert mock_session.add.call_count == 2
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(result)

@pytest.mark.asyncio
async def test_create_booking_atomic_event_not_found(booking_repo, mock_session):
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = None
    mock_session.execute.return_value = mock_result

    with pytest.raises(HTTPException) as excinfo:
        await booking_repo.create_booking_atomic(event_id="event_1", user_id="user_1", seats=2)
    
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Event not found."

@pytest.mark.asyncio
async def test_create_booking_atomic_not_enough_seats(booking_repo, mock_session):
    mock_result = MagicMock()
    # Event exists but only 1 seat left, we requested 2
    mock_event = Event(id="event_1", available_seats=1, price=50.0)
    mock_result.scalars().first.return_value = mock_event
    mock_session.execute.return_value = mock_result

    with pytest.raises(HTTPException) as excinfo:
        await booking_repo.create_booking_atomic(event_id="event_1", user_id="user_1", seats=2)
    
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "Not enough seats available."
