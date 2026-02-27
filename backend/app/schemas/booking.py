from pydantic import ConfigDict, Field
from app.schemas.base import AppBaseModel as BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.booking import BookingStatus, PaymentStatus

class BookingBase(BaseModel):
    event_id: UUID
    number_of_seats: int = Field(..., ge=1)

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None

class BookingResponse(BaseModel):
    id: UUID
    event_id: UUID
    user_id: UUID
    number_of_seats: int
    total_amount: float
    status: BookingStatus
    payment_status: PaymentStatus
    booking_reference: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
