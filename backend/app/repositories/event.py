from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.models.event import Event
from app.repositories.base import BaseRepository

class EventRepository(BaseRepository[Event]):
    def __init__(self, session: AsyncSession):
        super().__init__(Event, session)

    async def get_with_filters(
        self,
        skip: int = 0,
        limit: int = 10,
        city: Optional[str] = None,
        category_id: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> list[Event]:
        query = select(Event)
        
        conditions = []
        if city:
            conditions.append(Event.location_city.ilike(f"%{city}%"))
        if category_id:
            conditions.append(Event.category_id == category_id)
        if status:
            conditions.append(Event.status == status)
        if search:
            conditions.append(
                or_(
                    Event.title.ilike(f"%{search}%"),
                    Event.description.ilike(f"%{search}%")
                )
            )
            
        if conditions:
            query = query.filter(and_(*conditions))
            
        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        results = result.scalars().all()
        return list(results)

    async def get_by_organizer(self, organizer_id: Any, status: Optional[str] = None) -> list[Event]:
        query = select(Event).filter(Event.organizer_id == organizer_id)
        if status:
            query = query.filter(Event.status == status)
        result = await self.session.execute(query)
        results = result.scalars().all()
        return list(results)
