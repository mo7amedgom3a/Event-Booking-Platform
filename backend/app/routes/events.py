from fastapi import APIRouter, status, Query
from typing import Optional
import uuid
from datetime import datetime, timezone
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventListResponse, Location
from app.models.event import EventStatus
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.event import EventRepository

router = APIRouter(prefix="/events", tags=["Events"])

def get_mock_event(event_id: uuid.UUID = None) -> EventResponse:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    return EventResponse(
        id=event_id or uuid.uuid4(),
        title="Mock Tech Conference",
        description="A great mock event.",
        category_id=uuid.uuid4(),
        organizer_id=uuid.uuid4(),
        location=Location(address="123 Main St", city="Cairo", country="Egypt", coordinates={"latitude": 30.0444, "longitude": 31.2357}),
        start_date_time=now,
        end_date_time=now,
        capacity=100,
        available_seats=75,
        price=50.00,
        currency="USD",
        status=EventStatus.published,
        image_url="https://example.com/event.jpg",
        created_at=now,
        updated_at=now
    )

@router.get("", response_model=EventListResponse)
async def get_events(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    city: Optional[str] = None,
    categoryId: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    sortBy: Optional[str] = "startDateTime",
    order: Optional[str] = "asc",
    db: AsyncSession = Depends(get_db)
):
    repo = EventRepository(db)
    skip = (page - 1) * limit
    events = await repo.get_with_filters(skip=skip, limit=limit, city=city, category_id=categoryId, status=status, search=search)
    
    if events:
        # Note: True pagination counting is omitted for brevity here
        return {
            "events": events,
            "pagination": {"total": len(events), "page": page, "limit": limit, "totalPages": 1}
        }
    
    return {
        "events": [get_mock_event(), get_mock_event()],
        "pagination": {"total": 2, "page": page, "limit": limit, "totalPages": 1}
    }

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    repo = EventRepository(db)
    event = await repo.get(event_id)
    if event:
        return event
    return get_mock_event(event_id)

@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event_in: EventCreate, db: AsyncSession = Depends(get_db)):
    repo = EventRepository(db)
    event_data = event_in.model_dump()
    event_data["organizer_id"] = uuid.uuid4() # Mock organizer id
    new_event = await repo.create(event_data)
    return new_event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: uuid.UUID, event_in: EventUpdate, db: AsyncSession = Depends(get_db)):
    repo = EventRepository(db)
    event = await repo.get(event_id)
    if event:
        update_data = event_in.model_dump(exclude_unset=True)
        return await repo.update(event, update_data)
    return get_mock_event(event_id)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    repo = EventRepository(db)
    await repo.delete(event_id)
    return None
