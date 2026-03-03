import { Booking, Event } from './types';
import { API_URL, getHeaders, handleResponse, fetchWithCredentials } from './api.backend.utils';
import { eventService } from './api.backend.events';

export const bookingService = {
  async getBookings(userId: string): Promise<(Booking & { event?: Event })[]> {
    const res = await fetchWithCredentials(`${API_URL}/bookings`, { headers: getHeaders() });
    const data = await handleResponse(res);
    
    // Expand with event if backend does not return it inline
    const bookings = data.map((b: any) => ({
      id: b.id,
      eventId: b.eventId,
      userId: b.userId,
      seats: b.numberOfSeats,
      totalPrice: b.totalAmount,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return Promise.all(
      bookings.map(async (booking: any) => {
        const event = await eventService.getEvent(booking.eventId);
        return { ...booking, event: event || undefined };
      })
    );
  },

  async createBooking(data: { eventId: string; userId: string; seats: number }): Promise<Booking> {
    const res = await fetchWithCredentials(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        eventId: data.eventId,
        numberOfSeats: data.seats
      })
    });
    const b = await handleResponse(res);
    return {
      id: b.id,
      eventId: b.eventId,
      userId: b.userId || data.userId,
      seats: b.numberOfSeats,
      totalPrice: b.totalAmount,
      status: b.status,
      createdAt: b.createdAt
    };
  },

  async cancelBooking(id: string): Promise<void> {
    const res = await fetchWithCredentials(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    // Can optionally handle response json
    if (res.status !== 204 && res.status !== 200) {
      await handleResponse(res);
    }
  },

  async getEventBookings(eventId: string): Promise<(Booking & { userName?: string })[]> {
    const res = await fetchWithCredentials(`${API_URL}/organizer/events/${eventId}/bookings`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await handleResponse(res);
    return data.map((b: any) => ({
      id: b.id,
      eventId: b.eventId,
      userId: b.userId,
      seats: b.numberOfSeats || b.number_of_seats,
      totalPrice: b.totalAmount || b.total_amount,
      status: b.status,
      createdAt: b.createdAt || b.created_at,
      userName: b.userName || b.user_name || 'Unknown User'
    }));
  },

  async updateBookingStatus(eventId: string, bookingId: string, status: string): Promise<Booking> {
    const res = await fetchWithCredentials(`${API_URL}/organizer/events/${eventId}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const b = await handleResponse(res);
    return {
      id: b.id,
      eventId: b.eventId,
      userId: b.userId,
      seats: b.numberOfSeats || b.number_of_seats,
      totalPrice: b.totalAmount || b.total_amount,
      status: b.status,
      createdAt: b.createdAt || b.created_at
    };
  }
};
