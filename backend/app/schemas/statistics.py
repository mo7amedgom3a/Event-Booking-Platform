from pydantic import BaseModel

class EventStatisticsResponse(BaseModel):
    total_bookings: int
    revenue: float
    attendance_rate: float | None = None
