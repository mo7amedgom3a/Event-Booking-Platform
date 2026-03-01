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
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        is_free: Optional[bool] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = "startDateTime",
        order: Optional[str] = "asc",
    ) -> tuple[list[Event], int]:
        query = select(Event)
        from sqlalchemy import func
        
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
        if start_date:
            from datetime import datetime
            try:
                dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                conditions.append(Event.start_date_time >= dt)
            except ValueError:
                pass
        if end_date:
            from datetime import datetime
            try:
                dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                conditions.append(Event.start_date_time <= dt)
            except ValueError:
                pass
        if min_price is not None:
            conditions.append(Event.price >= min_price)
        if max_price is not None:
            conditions.append(Event.price <= max_price)
        if is_free:
            conditions.append(Event.price == 0)
            
        if conditions:
            query = query.filter(and_(*conditions))
            
        if sort_by == "price":
            sort_col = Event.price
        elif sort_by == "popularity":
            # Just fallback to start_date_time for now unless there's a specific popularity metric
            sort_col = Event.start_date_time
        else:
            sort_col = Event.start_date_time

        if order == "desc":
            query = query.order_by(sort_col.desc())
        else:
            query = query.order_by(sort_col.asc())
            
        count_query = select(func.count(Event.id))
        if conditions:
            count_query = count_query.filter(and_(*conditions))
        
        total_res = await self.session.execute(count_query)
        total_count = total_res.scalar() or 0

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        results = result.scalars().all()
        return list(results), total_count

    async def get_by_organizer(self, organizer_id: Any, status: Optional[str] = None) -> list[Event]:
        query = select(Event).filter(Event.organizer_id == organizer_id)
        if status:
            query = query.filter(Event.status == status)
        result = await self.session.execute(query)
        results = result.scalars().all()
        return list(results)
