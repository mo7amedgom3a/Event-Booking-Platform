from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.booking import BookingStatus, PaymentStatus

class BookingBase(BaseModel):
    event_id: UUID
    number_of_seats: int

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None

class BookingResponse(BookingBase):
    id: UUID
    user_id: UUID
    total_amount: float
    status: BookingStatus
    payment_status: PaymentStatus
    booking_reference: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
