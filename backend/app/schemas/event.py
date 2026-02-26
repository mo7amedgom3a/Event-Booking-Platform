from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.event import EventStatus

class EventBase(BaseModel):
    title: str
    description: str
    category_id: UUID
    location_address: str
    location_city: str
    location_country: str
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    start_date_time: datetime
    end_date_time: datetime
    capacity: int
    price: float
    currency: str = "USD"
    status: EventStatus = EventStatus.draft
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    location_address: Optional[str] = None
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    start_date_time: Optional[datetime] = None
    end_date_time: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[EventStatus] = None
    image_url: Optional[str] = None

class EventResponse(EventBase):
    id: UUID
    organizer_id: UUID
    available_seats: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
