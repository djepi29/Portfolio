import {
  listCalBookings,
  type CalBooking,
  type CalBookingStatus,
} from '@/lib/cal'

export type AdminBookingRow = {
  uid: string
  title: string
  status: string
  start: string
  end: string
  duration: number | null
  location: string | null
  attendeeName: string | null
  attendeeEmail: string | null
  calUrl: string
}

function toRow(booking: CalBooking): AdminBookingRow {
  const attendee = booking.attendees?.[0]
  return {
    uid: booking.uid,
    title: booking.title,
    status: booking.status,
    start: booking.start,
    end: booking.end,
    duration: typeof booking.duration === 'number' ? booking.duration : null,
    location: booking.location ?? booking.meetingUrl ?? null,
    attendeeName: attendee?.name ?? null,
    attendeeEmail: attendee?.email ?? null,
    calUrl: `https://app.cal.com/booking/${booking.uid}`,
  }
}

export async function listAdminBookings(
  status: CalBookingStatus = 'upcoming'
): Promise<AdminBookingRow[]> {
  const bookings = await listCalBookings({ status, limit: 50 })
  return bookings.map(toRow)
}
