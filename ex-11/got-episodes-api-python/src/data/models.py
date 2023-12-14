from pydantic import BaseModel

class Episode(BaseModel):
    id:  str
    title: str
    season: int
