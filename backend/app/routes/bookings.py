from fastapi import APIRouter, status
import uuid
from datetime import datetime, timezone
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.booking import BookingStatus, PaymentStatus

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def get_mock_booking(booking_id: uuid.UUID = None) -> BookingResponse:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    return BookingResponse(
        id=booking_id or uuid.uuid4(),
        event_id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        number_of_seats=2,
        total_amount=100.00,
        status=BookingStatus.confirmed,
        payment_status=PaymentStatus.paid,
        booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}",
        created_at=now,
        updated_at=now
    )

@router.get("", response_model=list[BookingResponse])
async def get_user_bookings(status: BookingStatus = None):
    return [get_mock_booking()]

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking_in: BookingCreate):
    return get_mock_booking()

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: uuid.UUID):
    return get_mock_booking(booking_id)

@router.delete("/{booking_id}", response_model=BookingResponse)
async def cancel_booking(booking_id: uuid.UUID):
    mock = get_mock_booking(booking_id)
    mock.status = BookingStatus.cancelled
    return mock
