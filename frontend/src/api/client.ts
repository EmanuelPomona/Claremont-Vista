import type {
  ApiErrorBody,
  ApplicationRequest,
  ApplicationResponse,
  Club,
  Event,
  EventQuery,
  Facility,
  FeedbackRequest,
  Metrics,
  RsvpCount,
} from './types'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === '1'

/** Thrown for every non-2xx response and for network failures (status 0). */
export class ApiError extends Error {
  readonly status: number
  readonly error: string
  readonly field?: string

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.error = body.error
    this.field = body.field
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, { error: 'network_error', message: 'Could not reach the server.' })
  }
  if (!res.ok) {
    let err: ApiErrorBody
    try {
      err = (await res.json()) as ApiErrorBody
    } catch {
      err = { error: 'internal_error', message: res.statusText || 'Request failed.' }
    }
    throw new ApiError(res.status, err)
  }
  return (await res.json()) as T
}

const fixtures = () => import('./fixtures')

export async function getEvents(params: EventQuery = {}): Promise<Event[]> {
  if (USE_FIXTURES) return (await fixtures()).events(params)
  const q = new URLSearchParams()
  if (params.band) q.set('band', params.band)
  if (params.vibe) q.set('vibe', params.vibe)
  if (params.limit) q.set('limit', String(params.limit))
  const qs = q.toString()
  return (await request<{ events: Event[] }>('GET', `/api/events${qs ? `?${qs}` : ''}`)).events
}

export async function getClubs(): Promise<Club[]> {
  if (USE_FIXTURES) return (await fixtures()).clubs()
  return (await request<{ clubs: Club[] }>('GET', '/api/clubs')).clubs
}

export async function getFacilities(): Promise<Facility[]> {
  if (USE_FIXTURES) return (await fixtures()).facilities()
  return (await request<{ facilities: Facility[] }>('GET', '/api/facilities')).facilities
}

export async function rsvp(id: string): Promise<RsvpCount> {
  if (USE_FIXTURES) return (await fixtures()).rsvp(id, 1)
  return request<RsvpCount>('POST', `/api/events/${encodeURIComponent(id)}/rsvp`)
}

export async function unrsvp(id: string): Promise<RsvpCount> {
  if (USE_FIXTURES) return (await fixtures()).rsvp(id, -1)
  return request<RsvpCount>('DELETE', `/api/events/${encodeURIComponent(id)}/rsvp`)
}

export async function submitApplication(body: ApplicationRequest): Promise<ApplicationResponse> {
  if (USE_FIXTURES) return (await fixtures()).application(body)
  return request<ApplicationResponse>('POST', '/api/applications', body)
}

export async function submitFeedback(body: FeedbackRequest): Promise<{ feedback_id: string }> {
  if (USE_FIXTURES) return (await fixtures()).feedback(body)
  return request<{ feedback_id: string }>('POST', '/api/feedback', body)
}

export async function getMetrics(): Promise<Metrics> {
  if (USE_FIXTURES) return (await fixtures()).metrics()
  return request<Metrics>('GET', '/api/metrics')
}
