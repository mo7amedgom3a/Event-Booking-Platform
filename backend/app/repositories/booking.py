from typing import Any, Optional
import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.booking import Booking, BookingStatus
from app.models.event import Event
from app.repositories.base import BaseRepository

class BookingRepository(BaseRepository[Booking]):
    def __init__(self, session: AsyncSession):
        super().__init__(Booking, session)

    def _generate_booking_ref(self) -> str:
        return f"BK-{uuid.uuid4().hex[:8].upper()}"

    async def create_booking_atomic(self, event_id: Any, user_id: Any, seats: int) -> Booking:
        # Atomic lock on the event to ensure seats and price calc are perfectly synced
        result = await self.session.execute(
            select(Event).where(Event.id == event_id).with_for_update()
        )
        event = result.scalars().first()
        
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
            
        if event.available_seats < seats:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough seats available.")
            
        # Deduct seats atomically
        event.available_seats -= seats
        self.session.add(event)
        
        # Create booking using the perfectly synced price
        booking = Booking(
            event_id=event_id,
            user_id=user_id,
            number_of_seats=seats,
            total_amount=event.price * seats,
            booking_reference=self._generate_booking_ref()
        )
        self.session.add(booking)
        
        await self.session.commit()
        await self.session.refresh(booking)
        
        return booking

    async def get_by_user(self, user_id: Any, status: Optional[BookingStatus] = None) -> list[Booking]:
        query = select(Booking).filter(Booking.user_id == user_id)
        if status:
            query = query.filter(Booking.status == status)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_event(self, event_id: Any) -> list[Booking]:
        result = await self.session.execute(select(Booking).filter(Booking.event_id == event_id))
        return list(result.scalars().all())

    async def get_by_reference(self, reference: str) -> Booking | None:
        result = await self.session.execute(select(Booking).filter(Booking.booking_reference == reference))
        return result.scalars().first()
