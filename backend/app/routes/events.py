from fastapi import APIRouter, status, Query, Depends
from typing import Optional
import uuid
from datetime import datetime, timezone
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventListResponse, Location
from app.models.event import EventStatus
from app.services.event_service import EventService
from app.dependencies import get_event_service, get_current_user, RoleChecker

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("", response_model=EventListResponse)
async def get_events(
                 page: int = Query(1, ge=1),
                 limit: int = Query(10, ge=1, le=100),
                 city: Optional[str] = None,
                 categoryId: Optional[str] = None,
                 startDate: Optional[str] = None,
                 endDate: Optional[str] = None,
                 minPrice: Optional[float] = None,
                 maxPrice: Optional[float] = None,
                 status: Optional[str] = None,
                 search: Optional[str] = None,
                 sortBy: Optional[str] = "startDateTime",
                 order: Optional[str] = "asc",
                 service: EventService = Depends(get_event_service)
                 ):
    skip = (page - 1) * limit
    events = await service.get_all_events(
        skip=skip, limit=limit, city=city, category_id=categoryId, status=status, search=search,
        start_date=startDate, end_date=endDate, min_price=minPrice, max_price=maxPrice,
        sort_by=sortBy, order=order
    )
    
    return {
        "events": events or [],
        "pagination": {"total": len(events) if events else 0, "page": page, "limit": limit, "totalPages": 1}
    }

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: uuid.UUID, service: EventService = Depends(get_event_service)):
    return await service.get_event_by_id(str(event_id))

@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_in: EventCreate, 
    service: EventService = Depends(get_event_service),
    current_user: dict = Depends(RoleChecker(["organizer", "admin"]))
):
    new_event = await service.create_event(event_in, uuid.UUID(current_user["id"]))
    return new_event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: uuid.UUID, 
    event_in: EventUpdate, 
    service: EventService = Depends(get_event_service),
    current_user: dict = Depends(get_current_user)
):
    return await service.update_event(str(event_id), event_in, uuid.UUID(current_user["id"]))

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: uuid.UUID, 
    service: EventService = Depends(get_event_service),
    current_user: dict = Depends(get_current_user)
):
    await service.delete_event(str(event_id), uuid.UUID(current_user["id"]))
    return None
