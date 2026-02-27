import sys
import os
import asyncio
import uuid

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.repositories.booking import BookingRepository
from app.repositories.event import EventRepository
from app.repositories.user import UserRepository

async def worker(task_id: int, event_id: uuid.UUID, user_id: uuid.UUID, seats: int):
    print(f"[{task_id}] Worker {task_id} attempting to book {seats} seats...")
    try:
        # We need a fresh session for each concurrent worker to simulate isolated concurrent requests correctly
        async with AsyncSessionLocal() as session:
            repo = BookingRepository(session)
            booking = await repo.create_booking_atomic(
                event_id=event_id,
                user_id=user_id,
                seats=seats
            )
            print(f"[{task_id}] \033[92mSuccess!\033[0m Booked REF: {booking.booking_reference}")
    except Exception as e:
        print(f"[{task_id}] \033[91mFailed:\033[0m {e}")


async def main():
    print("--- Testing Booking Repository Concurrency ---")
    async with AsyncSessionLocal() as main_session:
        event_repo = EventRepository(main_session)
        user_repo = UserRepository(main_session)
        
        users = await user_repo.get_all(limit=1)
        events = await event_repo.get_all(limit=1)
        
        if not users or not events:
            print("Please ensure there is at least one User and one Event to test Bookings.")
            return
            
        user_id = users[0].id
        event_id = events[0].id
        
        print("\nCurrent Event Availability BEFORE Concurrent Bookings:")
        event = await event_repo.get(event_id)
        start_seats = event.available_seats
        print(f"   Available Seats: {start_seats}")
        
    print("\n1. Firing 10 concurrent requests to book 2 seats each...\n")
    
    # We will fire 10 concurrent tasks. Each requesting 2 seats. Total = 20 seats.
    # Because they fire exactly at the same time, a bad system would allow overselling
    # due to race conditions. The pessimistic lock MUST enforce a queue.
    tasks = [
        worker(i, event_id, user_id, 2)
        for i in range(1, 11)
    ]
    
    await asyncio.gather(*tasks)

    # Check results
    async with AsyncSessionLocal() as verification_session:
        verify_repo = EventRepository(verification_session)
        final_event = await verify_repo.get(event_id)
        end_seats = final_event.available_seats
        
        print("\nChecking Event Availability AFTER Concurrent Bookings:")
        print(f"   Available Seats remaining: {end_seats}")
        print(f"   Total Deducted: {start_seats - end_seats} (Should exactly equal successful requests * 2)")

if __name__ == "__main__":
    asyncio.run(main())
