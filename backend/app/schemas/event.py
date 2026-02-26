from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from app.models.event import EventStatus

class Location(BaseModel):
    address: str
    city: str
    country: str
    coordinates: Optional[dict] = None

class EventBase(BaseModel):
    title: str
    description: str
    category_id: UUID
    location: Location
    start_date_time: datetime
    end_date_time: datetime
    capacity: int = Field(..., ge=0)
    price: float = Field(..., ge=0)
    currency: str = "USD"
    image_url: Optional[str] = None
    status: EventStatus = EventStatus.draft

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    location: Optional[Location] = None
    start_date_time: Optional[datetime] = None
    end_date_time: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    status: Optional[EventStatus] = None
    image_url: Optional[str] = None

class EventResponse(EventBase):
    id: UUID
    organizer_id: UUID
    available_seats: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EventListResponse(BaseModel):
    events: List[EventResponse]
    pagination: dict
