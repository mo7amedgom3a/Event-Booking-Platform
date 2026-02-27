from fastapi import APIRouter
import uuid
from app.schemas.event import EventResponse
from app.schemas.booking import BookingResponse
from app.routes.events import get_mock_event
from app.routes.bookings import get_mock_booking
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.event import EventRepository
from app.repositories.booking import BookingRepository

router = APIRouter(prefix="/organizer", tags=["Organizer"])

@router.get("/events", response_model=list[EventResponse])
async def get_organizer_events(status: str = None, db: AsyncSession = Depends(get_db)):
    repo = EventRepository(db)
    # Using a fake organizer_id for now until auth is fully implemented
    fake_organizer_id = uuid.uuid4()
    events = await repo.get_by_organizer(fake_organizer_id, status)
    if events:
        return events
    return [get_mock_event()]

@router.get("/events/{event_id}/bookings", response_model=list[BookingResponse])
async def get_event_bookings(event_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    repo = BookingRepository(db)
    bookings = await repo.get_by_event(event_id)
    if bookings:
        return bookings
    return [get_mock_booking()]
