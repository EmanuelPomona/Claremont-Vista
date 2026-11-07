"""Pydantic models mirroring docs/openapi.yaml."""

from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    BeforeValidator,
    EmailStr,
    Field,
    StrictBool,
    StringConstraints,
    field_validator,
)


def _integral_float_to_int(value):
    """JSON Schema treats 2.0 as an integer. Pydantic's strict int would reject it."""
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


# JSON integer: accepts 2 and 2.0, rejects true/false, "2" and 2.5 (pydantic's lax
# mode would coerce booleans and numeric strings, which docs/openapi.yaml forbids).
JsonInt = Annotated[int, BeforeValidator(_integral_float_to_int), Field(strict=True)]

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


# --- RSVP ---


class RsvpResponse(BaseModel):
    event_id: str
    going_count: int = Field(ge=0)


# --- applications ---

Employer = Literal["pomona", "cmc", "scripps", "pitzer", "hmc", "cgu", "kgi", "tcc", "other"]
JobCategory = Literal["dining", "grounds", "custodial", "maintenance", "admin", "other"]
UnitType = Literal["studio", "one_bedroom", "two_bedroom", "three_bedroom"]
Language = Literal["en", "es"]
EligibilityStatus = Literal["priority", "eligible", "over_income", "needs_review"]


class ApplicationRequest(BaseModel):
    """At least one of email or phone is required; the route enforces it (contact_required)."""

    full_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    email: EmailStr | None = None
    phone: str | None = Field(default=None, pattern=r"^[0-9 +()\-]{7,20}$")
    employer: Employer
    job_category: JobCategory
    household_size: JsonInt = Field(ge=1, le=8)
    annual_income: JsonInt = Field(ge=0, le=1_000_000)
    unit_type: UnitType
    preferred_language: Language
    needs_accessible_unit: StrictBool = False

    @field_validator("email", "phone", mode="before")
    @classmethod
    def blank_means_missing(cls, value):
        """The form may send "" for an unused contact field; treat it as not provided."""
        if isinstance(value, str):
            value = value.strip()
            return value or None
        return value

    @field_validator("email")
    @classmethod
    def email_length(cls, value):
        if value is not None and len(value) > 200:
            raise ValueError("String should have at most 200 characters")
        return value


class Eligibility(BaseModel):
    status: EligibilityStatus
    income_limit_50: int
    income_limit_80: int
    max_comfortable_rent: int


class ApplicationResponse(BaseModel):
    application_id: str
    submitted_at: str
    eligibility: Eligibility


# --- feedback and metrics ---


class FeedbackRequest(BaseModel):
    rating: JsonInt = Field(ge=1, le=5)
    message: str | None = Field(default=None, max_length=1000)
    page: str | None = Field(default=None, max_length=50)
    language: Language


class FeedbackResponse(BaseModel):
    feedback_id: str


class Metrics(BaseModel):
    applications: int = Field(ge=0)
    rsvps: int = Field(ge=0)
    feedback_count: int = Field(ge=0)
    average_rating: float | None
