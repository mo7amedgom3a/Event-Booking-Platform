import { Event, Category, EventFilters } from './types';
import { API_URL, getHeaders, handleResponse, fetchWithCredentials } from './api.backend.utils';

export const mapEvent = (e: any): Event => ({
  id: e.id,
  title: e.title,
  description: e.description,
  category: e.categoryId || 'c1',
  date: e.startDateTime,
  endDate: e.endDateTime,
  location: {
    city: e.location?.city || '',
    venue: e.location?.address || '',
    address: `${e.location?.address || ''}, ${e.location?.city || ''}, ${e.location?.country || ''}`.replace(/^[,\s]+|[,\s]+$/g, ''),
    lat: e.location?.coordinates?.latitude,
    lng: e.location?.coordinates?.longitude,
  },
  price: e.price || 0,
  totalSeats: e.capacity || 0,
  availableSeats: e.availableSeats ?? e.capacity ?? 0,
  image: e.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  organizerId: e.organizerId || '',
  organizerName: e.organizerName || 'Organizer',
  tags: e.tags || [],
  status: e.status || 'published',
  popularity: e.popularity || 80,
});

export const eventService = {
  async getEvents(filters: EventFilters = {}): Promise<{ events: Event[]; total: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category) params.append('categoryId', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.freeOnly !== undefined) params.append('isFree', filters.freeOnly.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) {
      if (filters.sort === 'price-asc') { params.append('sortBy', 'price'); params.append('order', 'asc'); }
      else if (filters.sort === 'price-desc') { params.append('sortBy', 'price'); params.append('order', 'desc'); }
      // The backend accepts startDateTime, createdAt, price for sortBy
    }

    const res = await fetchWithCredentials(`${API_URL}/events?${params.toString()}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return {
      events: (data.events || []).map(mapEvent),
      total: data.pagination?.total || 0,
      totalPages: data.pagination?.totalPages || 1
    };
  },

  async getEvent(id: string): Promise<Event | null> {
    try {
      const res = await fetchWithCredentials(`${API_URL}/events/${id}`, { headers: getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      return mapEvent(data);
    } catch {
      return null;
    }
  },

  async createEvent(data: Omit<Event, 'id' | 'availableSeats' | 'status' | 'popularity'>): Promise<Event> {
    const payload = {
      title: data.title,
      description: data.description,
      categoryId: data.category,
      location: {
        address: data.location.address || data.location.venue,
        city: data.location.city || "Unknown",
        country: "Unknown",
        coordinates: {
          latitude: data.location.lat || 0,
          longitude: data.location.lng || 0
        }
      },
      startDateTime: data.date,
      endDateTime: data.endDate,
      capacity: data.totalSeats,
      price: data.price,
      currency: "USD",
      imageUrl: data.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      status: "published"
    };
    
    const res = await fetchWithCredentials(`${API_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const resData = await handleResponse(res);
    return mapEvent(resData);
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const payload: any = {};
    if (data.title) payload.title = data.title;
    if (data.description) payload.description = data.description;
    if (data.category) payload.categoryId = data.category;
    if (data.date) payload.startDateTime = data.date;
    if (data.endDate) payload.endDateTime = data.endDate;
    if (data.totalSeats !== undefined) payload.capacity = data.totalSeats;
    if (data.price !== undefined) payload.price = data.price;
    if (data.image) payload.imageUrl = data.image;
    if (data.status) payload.status = data.status;
    if (data.location) {
      payload.location = {
        address: data.location.address || data.location.venue,
        city: data.location.city,
        country: "Unknown",
        coordinates: {
          latitude: data.location.lat,
          longitude: data.location.lng
        }
      };
    }
    
    const res = await fetchWithCredentials(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const resData = await handleResponse(res);
    return mapEvent(resData);
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetchWithCredentials(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.status !== 204) {
      await handleResponse(res);
    }
  },

  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    // Currently no native endpoint or parameter exists in Swagger, so fetch events manually.
    const res = await fetchWithCredentials(`${API_URL}/events?limit=100`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return (data.events || []).map(mapEvent).filter((e: Event) => e.organizerId === organizerId);
  },

  async getOrganizerStatistics(eventId?: string): Promise<{ total_bookings: number, revenue: number, attendance_rate: number }> {
    const url = eventId 
      ? `${API_URL}/organizer/events/statistics?event_id=${eventId}`
      : `${API_URL}/organizer/events/statistics`;
    const res = await fetchWithCredentials(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetchWithCredentials(`${API_URL}/categories`, { headers: getHeaders() });
    const data = await handleResponse(res);
    // Provide a default icon/color since the backend might only have name/slug/description
    const categoryMeta: Record<string, { icon: string, color: string }> = {
      "Technology": { icon: "💻", color: "#6C63FF" },
      "Music": { icon: "🎵", color: "#F59E0B" },
      "Sports": { icon: "⚽", color: "#10B981" },
      "Business": { icon: "💼", color: "#3B82F6" },
      "Arts": { icon: "🎨", color: "#EC4899" },
      "Food": { icon: "🍜", color: "#F97316" }
    };
    
    return data.map((c: any) => {
      const meta = categoryMeta[c.name] || { icon: '✨', color: '#9CA3AF' };
      return {
        id: c.id,
        name: c.name,
        icon: c.icon || meta.icon,
        color: c.color || meta.color
      };
    });
  },

  getCities(): string[] {
    return ["Amsterdam", "Cairo", "London", "Dubai", "New York", "Paris"];
  },
};
