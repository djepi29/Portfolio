const CAL_API = 'https://api.cal.com/v2'

export function getCalApiKey(): string {
  const key = process.env.CAL_API_KEY?.trim()
  if (!key) {
    throw new Error('CAL_API_KEY is not set')
  }
  return key
}

export function getCalApiVersion(fallback = '2026-05-01'): string {
  return process.env.CAL_API_VERSION?.trim() || fallback
}

export function getCalUsername(): string | null {
  const username = process.env.CAL_USERNAME?.trim()
  return username || null
}

/** Public booking URL for the hero button / embeds. */
export function getPublicCalBookingUrl(): string | null {
  const username = getCalUsername()
  if (!username) return null
  return `https://cal.com/${username}`
}

function calHeaders(apiVersion?: string): HeadersInit {
  return {
    Authorization: `Bearer ${getCalApiKey()}`,
    'cal-api-version': apiVersion ?? getCalApiVersion(),
    'Content-Type': 'application/json',
  }
}

async function calFetch<T>(
  path: string,
  init?: RequestInit & { apiVersion?: string }
): Promise<T> {
  const { apiVersion, ...rest } = init ?? {}
  const res = await fetch(`${CAL_API}${path}`, {
    ...rest,
    headers: {
      ...calHeaders(apiVersion),
      ...(rest.headers ?? {}),
    },
    cache: 'no-store',
  })

  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  if (!res.ok) {
    const message =
      typeof json === 'object' &&
      json &&
      'error' in json &&
      typeof (json as { error?: unknown }).error === 'object' &&
      (json as { error?: { message?: string } }).error?.message
        ? (json as { error: { message: string } }).error.message
        : typeof json === 'object' &&
            json &&
            'message' in json &&
            typeof (json as { message?: unknown }).message === 'string'
          ? (json as { message: string }).message
          : text || `Cal.com request failed (${res.status})`
    throw new Error(message)
  }

  return json as T
}

export type CalBookingStatus =
  | 'upcoming'
  | 'recurring'
  | 'past'
  | 'cancelled'
  | 'unconfirmed'

export type CalBookingAttendee = {
  name?: string
  email?: string
  timeZone?: string
}

export type CalBooking = {
  id: number
  uid: string
  title: string
  status: string
  start: string
  end: string
  duration?: number
  location?: string | null
  meetingUrl?: string | null
  cancellationReason?: string | null
  attendees?: CalBookingAttendee[]
  eventType?: { id?: number; slug?: string }
}

type CalListBookingsResponse = {
  status?: string
  data?: CalBooking[]
  pagination?: {
    hasMore?: boolean
    nextCursor?: string | null
  }
}

export async function listCalBookings(opts?: {
  status?: CalBookingStatus
  limit?: number
}): Promise<CalBooking[]> {
  const params = new URLSearchParams()
  if (opts?.status) params.set('status', opts.status)
  if (opts?.limit) params.set('limit', String(opts.limit))
  const qs = params.toString()
  const json = await calFetch<CalListBookingsResponse>(
    `/bookings${qs ? `?${qs}` : ''}`,
    { apiVersion: getCalApiVersion('2026-05-01') }
  )
  return Array.isArray(json.data) ? json.data : []
}

export async function cancelCalBooking(
  bookingUid: string,
  cancellationReason?: string
): Promise<unknown> {
  return calFetch(`/bookings/${encodeURIComponent(bookingUid)}/cancel`, {
    method: 'POST',
    apiVersion: getCalApiVersion('2026-02-25'),
    body: JSON.stringify({
      cancellationReason: cancellationReason?.trim() || 'Cancelled from site admin',
    }),
  })
}

export function isCalConfigured(): boolean {
  return Boolean(process.env.CAL_API_KEY?.trim())
}
