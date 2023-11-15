from typing import Optional
from pydantic import BaseModel

class Episode(BaseModel):
    id:  Optional[int] = None
    title: str
    season: Optional[int] = None
