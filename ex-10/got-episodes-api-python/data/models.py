from pydantic import BaseModel

class Episode(BaseModel):
    id: int
    title: str
    season: int
