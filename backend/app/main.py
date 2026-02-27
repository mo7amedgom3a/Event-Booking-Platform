from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

# Add the parent directory of 'app' to sys.path so 'python app/main.py' works
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import yaml
from fastapi.openapi.docs import get_swagger_ui_html

# Import routers
from app.routes import auth, events, bookings, categories, organizer

from contextlib import asynccontextmanager
from app.database import AsyncSessionLocal
from app.sb import ServiceBase

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize global database session and attach SB object
    async with AsyncSessionLocal() as session:
        app.state.sb = ServiceBase(session)
        yield

app = FastAPI(
    title="Event Booking System API",
    version="1.0.0",
    docs_url=None, # Disable default docs so we can serve custom yaml
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan
)

# Load the custom swagger.yaml
TASKS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../task-docs"))
SWAGGER_PATH = os.path.join(TASKS_DIR, "swagger.yaml")

with open(SWAGGER_PATH, "r") as f:
    custom_openapi = yaml.safe_load(f)

from app.config import settings
custom_openapi["servers"] = [
    {
        "url": f"http://localhost:{settings.port}/api/v1",
        "description": "Dynamic Development server"
    }
]

# Enable global security so Swagger sends the token in every request
custom_openapi["security"] = [{"bearerAuth": []}]

@app.get("/api/v1/openapi.json", include_in_schema=False)
async def get_openapi_endpoint():
    return custom_openapi

@app.get("/api/v1/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/api/v1/openapi.json",
        title="Event Booking System API - Swagger UI",
    )

from app.middleware.error_handler import ErrorHandlingMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.auth import AuthMiddleware

app.add_middleware(AuthMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=100)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ErrorHandlingMiddleware)

# Include routers with version prefix
api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(events.router, prefix=api_prefix)
app.include_router(bookings.router, prefix=api_prefix)
app.include_router(categories.router, prefix=api_prefix)
app.include_router(organizer.router, prefix=api_prefix)

@app.get("/v1/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    from app.config import settings
    uvicorn.run(app, host="0.0.0.0", port=settings.port)
