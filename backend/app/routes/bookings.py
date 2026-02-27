from fastapi import APIRouter, status
import uuid
from datetime import datetime, timezone
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.booking import BookingStatus, PaymentStatus
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.booking import BookingRepository

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
async def get_user_bookings(status: BookingStatus = None, db: AsyncSession = Depends(get_db)):
    repo = BookingRepository(db)
    # Using a fake user_id for now until auth is fully implemented
    fake_user_id = uuid.uuid4() 
    bookings = await repo.get_by_user(fake_user_id, status)
    if bookings:
        return bookings
    return [get_mock_booking()]

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking_in: BookingCreate, db: AsyncSession = Depends(get_db)):
    repo = BookingRepository(db)
    
    # Mocking user ID until Auth is done
    fake_user_id = uuid.uuid4()
    
    new_booking = await repo.create_booking_atomic(
        event_id=booking_in.event_id,
        user_id=fake_user_id,
        seats=booking_in.number_of_seats
    )
    return new_booking

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    repo = BookingRepository(db)
    booking = await repo.get(booking_id)
    if booking:
        return booking
    return get_mock_booking(booking_id)

@router.delete("/{booking_id}", response_model=BookingResponse)
async def cancel_booking(booking_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    repo = BookingRepository(db)
    booking = await repo.get(booking_id)
    if booking:
        return await repo.update(booking, {"status": BookingStatus.cancelled})
    
    # Fallback to mock logic for now
    mock = get_mock_booking(booking_id)
    mock.status = BookingStatus.cancelled
    return mock
