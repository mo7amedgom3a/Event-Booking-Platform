from typing import Optional, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.event import EventRepository
from app.schemas.event import EventCreate, EventUpdate
from app.models.event import Event, EventStatus
import uuid
from datetime import datetime, timezone

class EventService:
    def __init__(self, db: AsyncSession):
        self.repo = EventRepository(db)

    async def get_all_events(self, skip: int, limit: int, city: Optional[str] = None, 
                             category_id: Optional[str] = None, status: Optional[str] = None, 
                             search: Optional[str] = None) -> list[Event]:
        return await self.repo.get_with_filters(
            skip=skip, limit=limit, city=city, category_id=category_id, 
            status=status, search=search
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
            
        success = await self.repo.delete(event_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete event.")
        return True
