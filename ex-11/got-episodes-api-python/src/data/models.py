from typing import Optional
from pydantic import BaseModel

class Episode(BaseModel):
    id:  Optional[str] = "Quote:"
    title: str
    season: Optional[int] = None
