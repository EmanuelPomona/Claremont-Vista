// Hand-mirrored from docs/openapi.yaml (the authoritative contract).
// If the contract is wrong, file a CONTRACT CHANGE REQUEST; never invent fields here.

export interface Localized {
  en: string
  es: string
}

export type Band = 'early' | 'midday' | 'evening' | 'weekend'
export type Vibe = 'solo' | 'small' | 'big'
export type Audience = 'everyone' | 'families' | 'adults'

export interface Event {
  id: string
  title: Localized
  description: Localized
  location: Localized
  /** ISO 8601 with offset, America/Los_Angeles, e.g. 2026-11-10T05:30:00-08:00 */
  starts_at: string
  ends_at: string
  band: Band
  vibe: Vibe
  audience: Audience
  /** path served by the frontend, e.g. /images/events/sunrise-yoga.jpg */
  image: string
  /** null for one-off events */
  recurrence: Localized | null
  going_count: number
}

export interface Club {
  id: string
  name: Localized
  description: Localized
  meets: Localized
  vibe: Vibe
  audience: Audience
  how_to_join: Localized
}

export type FacilityCategory = 'fitness' | 'outdoor' | 'family' | 'community' | 'transport'

export interface Facility {
  id: string
  name: Localized
  description: Localized
  hours: Localized
  accessibility: Localized
  category: FacilityCategory
}

export type Employer = 'pomona' | 'cmc' | 'scripps' | 'pitzer' | 'hmc' | 'cgu' | 'kgi' | 'tcc' | 'other'
export type JobCategory = 'dining' | 'grounds' | 'custodial' | 'maintenance' | 'admin' | 'other'
export type UnitType = 'studio' | 'one_bedroom' | 'two_bedroom' | 'three_bedroom'

export interface ApplicationRequest {
  full_name: string
  email?: string | null
  phone?: string | null
  employer: Employer
  job_category: JobCategory
  household_size: number
  annual_income: number
  unit_type: UnitType
  preferred_language: 'en' | 'es'
  needs_accessible_unit?: boolean
}

export type EligibilityStatus = 'priority' | 'eligible' | 'over_income' | 'needs_review'

export interface ApplicationResponse {
  application_id: string
  submitted_at: string
  eligibility: {
    status: EligibilityStatus
    income_limit_50: number
    income_limit_80: number
    max_comfortable_rent: number
  }
}

export interface FeedbackRequest {
  rating: number
  message?: string | null
  page?: string | null
  language: 'en' | 'es'
}

export interface Metrics {
  applications: number
  rsvps: number
  feedback_count: number
  average_rating: number | null
}

export interface RsvpCount {
  event_id: string
  going_count: number
}

/** Error body for every 4xx/5xx: { error, message, field? } */
export interface ApiErrorBody {
  error: string
  message: string
  field?: string
}

export interface EventQuery {
  band?: Band
  vibe?: Vibe
  limit?: number
}
