from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.category import Category
from app.repositories.base import BaseRepository

class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session: AsyncSession):
        super().__init__(Category, session)

    async def get_by_slug(self, slug: str) -> Category | None:
        result = await self.session.execute(select(Category).filter(Category.slug == slug))
        return result.scalars().first()
