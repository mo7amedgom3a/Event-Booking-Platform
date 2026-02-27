from typing import Optional, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.event import EventRepository
from app.schemas.event import EventCreate, EventUpdate
from app.models.event import Event, EventStatus
import uuid
from datetime import datetime, timezone
from app.repositories.booking import BookingRepository
from app.models.booking import BookingStatus

class EventService:
    def __init__(self, db: AsyncSession):
        self.repo = EventRepository(db)
        self.booking_repo = BookingRepository(db)

    async def get_all_events(self, skip: int, limit: int, city: Optional[str] = None, 
                             category_id: Optional[str] = None, status: Optional[str] = None, 
                             search: Optional[str] = None,
                             start_date: Optional[str] = None, end_date: Optional[str] = None,
                             min_price: Optional[float] = None, max_price: Optional[float] = None,
                             sort_by: Optional[str] = "startDateTime", order: Optional[str] = "asc") -> list[Event]:
        return await self.repo.get_with_filters(
            skip=skip, limit=limit, city=city, category_id=category_id, 
            status=status, search=search,
            start_date=start_date, end_date=end_date,
            min_price=min_price, max_price=max_price,
            sort_by=sort_by, order=order
        )
        
    async def get_event_by_id(self, event_id: str) -> Event:
        event = await self.repo.get(event_id)
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        return event

    async def get_organizer_events(self, organizer_id: str, status: Optional[str] = None) -> list[Event]:
        return await self.repo.get_by_organizer(organizer_id, status)

    async def create_event(self, event_in: EventCreate, organizer_id: uuid.UUID) -> Event:
        event_data = event_in.model_dump()
        event_data["organizer_id"] = organizer_id
        # When creating, available seats equal capacity
        event_data["available_seats"] = event_in.capacity
        
        if event_data.get("start_date_time") and event_data["start_date_time"].tzinfo:
            event_data["start_date_time"] = event_data["start_date_time"].astimezone(timezone.utc).replace(tzinfo=None)
        if event_data.get("end_date_time") and event_data["end_date_time"].tzinfo:
            event_data["end_date_time"] = event_data["end_date_time"].astimezone(timezone.utc).replace(tzinfo=None)
            
        # Extract location data for flat DB model
        if "location" in event_data:
            loc = event_data.pop("location")
            event_data["location_address"] = loc.get("address")
            event_data["location_city"] = loc.get("city")
            event_data["location_country"] = loc.get("country")
            if "coordinates" in loc:
                event_data["location_lat"] = loc["coordinates"].get("latitude")
                event_data["location_lon"] = loc["coordinates"].get("longitude")
                
        return await self.repo.create(event_data)

    async def update_event(self, event_id: str, event_in: EventUpdate, current_user_id: uuid.UUID) -> Event:
        event = await self.get_event_by_id(event_id)
        
        # Verify ownership
        if event.organizer_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this event.")
            
        # Cannot update past events
        now_dt = datetime.now(timezone.utc).replace(tzinfo=None)
        if event.start_date_time < now_dt:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot update events that have already started.")

        update_data = event_in.model_dump(exclude_unset=True)
        
        if update_data.get("start_date_time") and update_data["start_date_time"].tzinfo:
            update_data["start_date_time"] = update_data["start_date_time"].astimezone(timezone.utc).replace(tzinfo=None)
        if update_data.get("end_date_time") and update_data["end_date_time"].tzinfo:
            update_data["end_date_time"] = update_data["end_date_time"].astimezone(timezone.utc).replace(tzinfo=None)
            
        if "location" in update_data:
            loc = update_data.pop("location")
            if "address" in loc: update_data["location_address"] = loc["address"]
            if "city" in loc: update_data["location_city"] = loc["city"]
            if "country" in loc: update_data["location_country"] = loc["country"]
            if "coordinates" in loc:
                update_data["location_lat"] = loc["coordinates"].get("latitude")
                update_data["location_lon"] = loc["coordinates"].get("longitude")

        return await self.repo.update(event, update_data)

    async def delete_event(self, event_id: str, current_user_id: uuid.UUID):
        event = await self.get_event_by_id(event_id)
        
        if event.organizer_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this event.")
            
        bookings = await self.booking_repo.get_by_event(event.id)
        has_confirmed = any(b.status in (BookingStatus.confirmed, BookingStatus.pending) for b in bookings)
        if has_confirmed:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete event with existing active bookings.")
            
        success = await self.repo.delete(event_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete event.")
        return True

    async def get_event_statistics(self, event_id: str, current_user_id: uuid.UUID) -> dict:
        event = await self.get_event_by_id(event_id)
        if event.organizer_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view statistics for this event.")
            
        bookings = await self.booking_repo.get_by_event(event.id)
        valid_bookings = [b for b in bookings if b.status in (BookingStatus.confirmed, BookingStatus.pending)]
        
        total_bookings = sum(b.number_of_seats for b in valid_bookings)
        revenue = sum(float(b.total_amount) for b in valid_bookings)
        
        return {
            "total_bookings": total_bookings,
            "revenue": revenue,
            "attendance_rate": (total_bookings / event.capacity * 100) if event.capacity > 0 else 0
        }
