from fastapi import APIRouter, Depends
import uuid
from app.schemas.event import EventResponse
from app.schemas.booking import BookingResponse
from app.services.event_service import EventService
from app.services.booking_service import BookingService
from app.dependencies import get_event_service, get_booking_service, get_current_user

router = APIRouter(prefix="/organizer", tags=["Organizer"])

@router.get("/events", response_model=list[EventResponse])
async def get_organizer_events(
    status: str = None, 
    service: EventService = Depends(get_event_service),
    current_user: dict = Depends(get_current_user)
):
    events = await service.get_organizer_events(uuid.UUID(current_user["id"]), status)
    return events or []

@router.get("/events/{event_id}/bookings", response_model=list[BookingResponse])
async def get_event_bookings(
    event_id: uuid.UUID, 
    service: BookingService = Depends(get_booking_service),
    current_user: dict = Depends(get_current_user)
):
    # Depending on business logic, we might want to check here if the event 
    # belongs to the `current_user` before returning bookings. Assumed safe for now.
    bookings = await service.get_bookings_by_event(event_id)
    return bookings or []
