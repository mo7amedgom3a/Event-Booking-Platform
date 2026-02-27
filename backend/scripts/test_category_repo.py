import sys
import os
import asyncio
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.repositories.category import CategoryRepository

async def main():
    print("--- Testing Category Repository ---")
    async with AsyncSessionLocal() as session:
        category_repo = CategoryRepository(session)
        
        # 1. Create Category
        print("1. Creating Category...")
        timestamp = int(time.time())
        cat_slug = f"health-wellness-{timestamp}"
        cat_data = {
            "name": f"Health and Wellness {timestamp}",
            "slug": cat_slug,
            "description": "Health events"
        }
        
        try:
            new_cat = await category_repo.create(cat_data)
            print(f"   Success! Category created: {new_cat.name} (ID: {new_cat.id})")
        except Exception as e:
            print(f"   Failed to create category: {e}")
            return
            
        # 2. Get by slug
        print("2. Getting Category by Slug...")
        cat = await category_repo.get_by_slug(cat_slug)
        if cat:
            print(f"   Success! Found category via slug: {cat.slug}")
            
        # 3. Get all categories
        print("3. Getting all Categories...")
        all_cats = await category_repo.get_all()
        print(f"   Success! Total categories: {len(all_cats)}")
        
        # 4. Delete Category
        print("4. Deleting Category...")
        deleted = await category_repo.delete(new_cat.id)
        if deleted:
            print("   Success! Category deleted.")
        else:
            print("   Failed: Could not delete category.")

if __name__ == "__main__":
    asyncio.run(main())
