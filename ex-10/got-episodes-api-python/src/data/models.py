from typing import Optional
from pydantic import BaseModel

class Episode(BaseModel):
    id:  str
    title: str
    season: Optional[int] = None
