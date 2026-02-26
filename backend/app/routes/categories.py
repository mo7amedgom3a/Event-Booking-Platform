from fastapi import APIRouter, status
import uuid
from datetime import datetime, timezone
from app.schemas.category import CategoryCreate, CategoryResponse

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
async def get_categories():
    return [get_mock_category(), get_mock_category()]

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category_in: CategoryCreate):
    return get_mock_category()
