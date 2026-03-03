export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'organizer' | 'admin';
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface EventLocation {
  city: string;
  venue: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  endDate: string;
  location: EventLocation;
  price: number;
  totalSeats: number;
  availableSeats: number;
  image: string;
  organizerId: string;
  organizerName: string;
  tags: string[];
  status: 'published' | 'cancelled' | 'draft';
  popularity: number;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
}

export interface EventFilters {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  freeOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
