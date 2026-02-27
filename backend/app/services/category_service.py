from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate
from app.models.category import Category

class CategoryService:
    def __init__(self, db: AsyncSession):
        self.repo = CategoryRepository(db)

    async def get_all_categories(self, skip: int = 0, limit: int = 100) -> list[Category]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def create_category(self, category_in: CategoryCreate) -> Category:
        existing = await self.repo.get_by_slug(category_in.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category with slug '{category_in.slug}' already exists."
            )
            
        return await self.repo.create(category_in.model_dump())
