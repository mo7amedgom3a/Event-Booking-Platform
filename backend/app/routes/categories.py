from fastapi import APIRouter, status
import uuid
from datetime import datetime, timezone
from app.schemas.category import CategoryCreate, CategoryResponse
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.category import CategoryRepository

router = APIRouter(prefix="/categories", tags=["Categories"])

def get_mock_category(category_id: uuid.UUID = None) -> CategoryResponse:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    return CategoryResponse(
        id=category_id or uuid.uuid4(),
        name="Technology",
        slug="technology",
        description="Tech related events",
        created_at=now,
        updated_at=now
    )

@router.get("", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    repo = CategoryRepository(db)
    categories = await repo.get_all()
    if categories: # If db has items, use them, otherwise mock
        return categories
    return [get_mock_category(), get_mock_category()]

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category_in: CategoryCreate, db: AsyncSession = Depends(get_db)):
    repo = CategoryRepository(db)
    new_category = await repo.create(category_in.model_dump())
    return new_category
