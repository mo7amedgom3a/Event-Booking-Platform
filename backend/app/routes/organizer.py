from fastapi import APIRouter
import uuid
from app.schemas.event import EventResponse
from app.schemas.booking import BookingResponse
from app.routes.events import get_mock_event
from app.routes.bookings import get_mock_booking

router = APIRouter(prefix="/organizer", tags=["Organizer"])

@router.get("/events", response_model=list[EventResponse])
async def get_organizer_events(status: str = None):
    return [get_mock_event()]

@router.get("/events/{event_id}/bookings", response_model=list[BookingResponse])
async def get_event_bookings(event_id: uuid.UUID):
    return [get_mock_booking()]
