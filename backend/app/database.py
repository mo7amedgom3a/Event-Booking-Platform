from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from .config import settings

db_url = settings.database_url

engine = create_async_engine(db_url, echo=True, future=True)

AsyncSessionLocal = async_sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine, 
    expire_on_commit=False,
    class_=AsyncSession
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
