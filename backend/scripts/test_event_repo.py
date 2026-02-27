import sys
import os
import asyncio
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.repositories.event import EventRepository
from app.repositories.user import UserRepository
from app.repositories.category import CategoryRepository

async def main():
    print("--- Testing Event Repository ---")
    async with AsyncSessionLocal() as session:
        event_repo = EventRepository(session)
        user_repo = UserRepository(session)
        cat_repo = CategoryRepository(session)
        
        # We need an organizer and a category first to create an event
        users = await user_repo.get_all(limit=1)
        cats = await cat_repo.get_all(limit=1)
        
        if not users or not cats:
            print("Please create at least one User and one Category using the other scripts before testing Events.")
            return
            
        organizer_id = users[0].id
        category_id = cats[0].id
        
        # 1. Create Event
        print("1. Creating Event...")
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        event_data = {
            "title": "Service Test Conference",
            "description": "Integration testing event",
            "category_id": category_id,
            "organizer_id": organizer_id,
            "location_address": "Test Ave",
            "location_city": "Testington",
            "location_country": "Testland",
            "start_date_time": now + timedelta(days=5),
            "end_date_time": now + timedelta(days=6),
            "capacity": 500,
            "available_seats": 500,
            "price": 100.00,
            "currency": "USD",
            "status": "published"
        }
        
        try:
            event = await event_repo.create(event_data)
            print(f"   Success! Created Event: {event.title} (ID: {event.id})")
        except Exception as e:
            print(f"   Failed to create event: {e}")
            return

        # 2. Get with filters
        print("2. Testing filtering (get_with_filters)...")
        filtered_events = await event_repo.get_with_filters(city="Testington", status="published")
        if filtered_events:
            print(f"   Success! Found {len(filtered_events)} events matching filters.")
            
        # 3. Get by organizer
        print("3. Getting by organizer...")
        org_events = await event_repo.get_by_organizer(organizer_id)
        if org_events:
            print(f"   Success! Organizer has {len(org_events)} events.")
            
        # 4. Update Event
        print("4. Updating Event...")
        updated_event = await event_repo.update(event, {"title": "Updated Test Conference"})
        print(f"   Success! Event title updated: {updated_event.title}")

if __name__ == "__main__":
    asyncio.run(main())
