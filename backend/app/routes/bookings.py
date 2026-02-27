from fastapi import APIRouter, status, Depends
import uuid
from datetime import datetime, timezone
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.booking import BookingStatus, PaymentStatus
from app.services.booking_service import BookingService
from app.dependencies import get_booking_service, get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=list[BookingResponse])
async def get_user_bookings(
    status: BookingStatus = None, 
    service: BookingService = Depends(get_booking_service),
    current_user: dict = Depends(get_current_user)
):
    bookings = await service.get_user_bookings(uuid.UUID(current_user["id"]), status)
    return bookings or []

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_in: BookingCreate, 
    service: BookingService = Depends(get_booking_service),
    current_user: dict = Depends(get_current_user)
):
    new_booking = await service.create_booking(booking_in, uuid.UUID(current_user["id"]))
    return new_booking

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: uuid.UUID, 
    service: BookingService = Depends(get_booking_service),
    current_user: dict = Depends(get_current_user)
):
    booking = await service.get_booking_by_id(booking_id, current_user_id=uuid.UUID(current_user["id"]))
    return booking

@router.delete("/{booking_id}", response_model=BookingResponse)
async def cancel_booking(
    booking_id: uuid.UUID, 
    service: BookingService = Depends(get_booking_service),
    current_user: dict = Depends(get_current_user)
):
    booking = await service.cancel_booking(booking_id, uuid.UUID(current_user["id"]))
    return booking
