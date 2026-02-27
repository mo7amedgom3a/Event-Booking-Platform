from fastapi import APIRouter, status, Depends
import uuid
from datetime import datetime, timezone
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.category_service import CategoryService
from app.dependencies import get_category_service

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=list[CategoryResponse])
async def get_categories(service: CategoryService = Depends(get_category_service)):
    return await service.get_all_categories()

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category_in: CategoryCreate, service: CategoryService = Depends(get_category_service)):
    new_category = await service.create_category(category_in)
    return new_category
