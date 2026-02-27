import sys
import os
import asyncio
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.repositories.user import UserRepository

async def main():
    print("--- Testing User Repository ---")
    async with AsyncSessionLocal() as session:
        user_repo = UserRepository(session)
        
        # 1. Create a user
        print("1. Creating User...")
        email = f"test_{int(datetime.now(timezone.utc).timestamp())}@example.com"
        user_data = {
            "email": email,
            "password_hash": "dummy_hashed_pw",
            "first_name": "Test",
            "last_name": "Service",
            "role": "user"
        }
        
        try:
            new_user = await user_repo.create(user_data)
            print(f"   Success! User created with ID: {new_user.id} and email: {new_user.email}")
        except Exception as e:
            print(f"   Failed to create user: {e}")
            return

        # 2. Get User by Email
        print("2. Getting User by Email...")
        user = await user_repo.get_by_email(email)
        if user:
            print(f"   Success! Found user named: {user.first_name} {user.last_name}")
        else:
            print("   Failed: User not found!")

        # 3. Get User by ID
        print("3. Getting User by ID...")
        user_by_id = await user_repo.get(new_user.id)
        if user_by_id:
            print(f"   Success! User id fetch matches: {user_by_id.email}")
            
        # 4. Update User
        print("4. Updating User...")
        updated_user = await user_repo.update(user_by_id, {"first_name": "UpdatedName"})
        print(f"   Success! User first name is now: {updated_user.first_name}")
        
        # 5. Get All Users
        print("5. Getting all users...")
        all_users = await user_repo.get_all()
        print(f"   Success! Total users found: {len(all_users)}")

       
if __name__ == "__main__":
    asyncio.run(main())
