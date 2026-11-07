"""Pydantic models mirroring docs/openapi.yaml."""

from typing import Literal

from pydantic import BaseModel

Band = Literal["early", "midday", "evening", "weekend"]
Vibe = Literal["solo", "small", "big"]
Audience = Literal["everyone", "families", "adults"]
FacilityCategory = Literal["fitness", "outdoor", "family", "community", "transport"]


class Localized(BaseModel):
    en: str
    es: str


class Event(BaseModel):
    id: str
    title: Localized
    description: Localized
    location: Localized
    starts_at: str
    ends_at: str
    band: Band
    vibe: Vibe
    audience: Audience
    image: str
    recurrence: Localized | None
    going_count: int


class EventsResponse(BaseModel):
    events: list[Event]


class Club(BaseModel):
    id: str
    name: Localized
    description: Localized
    meets: Localized
    vibe: Vibe
    audience: Audience
    how_to_join: Localized


class ClubsResponse(BaseModel):
    clubs: list[Club]


class Facility(BaseModel):
    id: str
    name: Localized
    description: Localized
    hours: Localized
    accessibility: Localized
    category: FacilityCategory


class FacilitiesResponse(BaseModel):
    facilities: list[Facility]
