from pydantic import BaseModel


class JobDetailsResponse(BaseModel):
    id: str
    next_run_time: str
    time_until_next_run: str  # Time until next run in seconds
    trigger: str
    interval: float  # Interval in seconds
