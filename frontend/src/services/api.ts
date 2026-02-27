import { MOCK_DELAY_MIN, MOCK_DELAY_MAX, TOKEN_KEY } from '@/utils/constants';

// Types
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
  bookedSeats: number;
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
  status: 'confirmed' | 'cancelled';
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

// Delay helper
const delay = () => new Promise(r => setTimeout(r, MOCK_DELAY_MIN + Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN)));

// --- MOCK DATA STORES (mutable) ---

let MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', password: 'Password1', role: 'user', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'u2', name: 'Bob Carter', email: 'bob@example.com', password: 'Password1', role: 'organizer', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: 'u3', name: 'Admin User', email: 'admin@example.com', password: 'Password1', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Technology', icon: '💻', color: '#6C63FF' },
  { id: 'c2', name: 'Music', icon: '🎵', color: '#F59E0B' },
  { id: 'c3', name: 'Sports', icon: '⚽', color: '#10B981' },
  { id: 'c4', name: 'Business', icon: '💼', color: '#3B82F6' },
  { id: 'c5', name: 'Arts', icon: '🎨', color: '#EC4899' },
  { id: 'c6', name: 'Food', icon: '🍜', color: '#F97316' },
];

let MOCK_EVENTS: Event[] = [
  {
    id: 'e1', title: 'React Summit 2025', description: 'The largest React conference in Europe. Join 500+ developers for three days of talks, workshops, and networking. Learn from industry leaders about the latest in React, Next.js, and the modern web ecosystem.', category: 'c1', date: '2025-09-15T09:00:00Z', endDate: '2025-09-17T18:00:00Z',
    location: { city: 'Amsterdam', venue: 'NEMO Science Museum', address: 'Oosterdok 2, Amsterdam', lat: 52.3742, lng: 4.9123 }, price: 299, totalSeats: 500, bookedSeats: 342, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['react', 'frontend', 'javascript'], status: 'published', popularity: 95,
  },
  {
    id: 'e2', title: 'Jazz Under the Stars', description: 'An enchanting evening of live jazz music in the heart of Cairo. Featuring renowned musicians from across the Middle East and beyond. Enjoy gourmet food and drinks under the open sky.', category: 'c2', date: '2025-08-20T19:00:00Z', endDate: '2025-08-20T23:00:00Z',
    location: { city: 'Cairo', venue: 'Al-Azhar Park', address: 'Salah Salem St, Cairo', lat: 30.0416, lng: 31.2585 }, price: 75, totalSeats: 300, bookedSeats: 280, image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['jazz', 'live music', 'outdoor'], status: 'published', popularity: 88,
  },
  {
    id: 'e3', title: 'Premier League Watch Party', description: 'Watch the biggest Premier League matches live on a giant screen with fellow football fans. Food, drinks, and incredible atmosphere guaranteed.', category: 'c3', date: '2025-10-05T14:00:00Z', endDate: '2025-10-05T17:00:00Z',
    location: { city: 'London', venue: 'The Sports Bar', address: '12 Kings Road, London', lat: 51.4886, lng: -0.1601 }, price: 0, totalSeats: 200, bookedSeats: 145, image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['football', 'premier league', 'watch party'], status: 'published', popularity: 72,
  },
  {
    id: 'e4', title: 'Startup Pitch Night', description: 'An exclusive evening where 10 hand-picked startups pitch their ideas to a panel of top investors. Networking opportunities with VCs and angel investors.', category: 'c4', date: '2025-11-12T18:00:00Z', endDate: '2025-11-12T22:00:00Z',
    location: { city: 'Dubai', venue: 'DIFC Innovation Hub', address: 'Gate Avenue, DIFC, Dubai', lat: 25.2144, lng: 55.2811 }, price: 150, totalSeats: 150, bookedSeats: 150, image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['startup', 'pitch', 'investors'], status: 'published', popularity: 90,
  },
  {
    id: 'e5', title: 'Contemporary Art Exhibition', description: 'Explore groundbreaking contemporary art from emerging artists around the world. Interactive installations, guided tours, and artist meet-and-greets.', category: 'c5', date: '2025-09-01T10:00:00Z', endDate: '2025-09-30T18:00:00Z',
    location: { city: 'New York', venue: 'Brooklyn Art Space', address: '450 Harrison Ave, Brooklyn' }, price: 25, totalSeats: 1000, bookedSeats: 612, image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['art', 'exhibition', 'contemporary'], status: 'published', popularity: 65,
  },
  {
    id: 'e6', title: 'Street Food Festival', description: 'A three-day culinary adventure featuring 50+ food vendors from around the world. Live cooking demos, eating competitions, and family-friendly activities.', category: 'c6', date: '2025-10-18T11:00:00Z', endDate: '2025-10-20T21:00:00Z',
    location: { city: 'London', venue: 'Brick Lane', address: 'Brick Lane, London E1' }, price: 0, totalSeats: 2000, bookedSeats: 890, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['food', 'street food', 'festival'], status: 'published', popularity: 85,
  },
  {
    id: 'e7', title: 'AI & Machine Learning Conference', description: 'Deep dive into the world of artificial intelligence with hands-on workshops, keynote speeches from leading researchers, and panel discussions on the future of AI.', category: 'c1', date: '2025-12-01T09:00:00Z', endDate: '2025-12-03T17:00:00Z',
    location: { city: 'Dubai', venue: 'Dubai World Trade Centre', address: 'Sheikh Zayed Road, Dubai' }, price: 450, totalSeats: 800, bookedSeats: 520, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['AI', 'machine learning', 'technology'], status: 'published', popularity: 92,
  },
  {
    id: 'e8', title: 'Classical Music Evening', description: 'An evening of timeless classical compositions performed by the Cairo Philharmonic Orchestra. Works by Mozart, Beethoven, and Tchaikovsky.', category: 'c2', date: '2025-09-28T19:30:00Z', endDate: '2025-09-28T22:00:00Z',
    location: { city: 'Cairo', venue: 'Cairo Opera House', address: 'Gezira St, Cairo' }, price: 120, totalSeats: 400, bookedSeats: 310, image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['classical', 'orchestra', 'music'], status: 'published', popularity: 78,
  },
  {
    id: 'e9', title: 'Marathon Training Camp', description: 'A 2-day intensive training camp for marathon runners of all levels. Professional coaches, nutrition advice, and group runs through scenic routes.', category: 'c3', date: '2025-11-08T06:00:00Z', endDate: '2025-11-09T15:00:00Z',
    location: { city: 'New York', venue: 'Central Park', address: 'Central Park, Manhattan, NY' }, price: 85, totalSeats: 100, bookedSeats: 67, image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['marathon', 'running', 'fitness'], status: 'published', popularity: 60,
  },
  {
    id: 'e10', title: 'Entrepreneurship Workshop', description: 'Learn the fundamentals of building a successful business. Topics include market validation, fundraising, team building, and scaling strategies.', category: 'c4', date: '2025-10-25T09:00:00Z', endDate: '2025-10-25T17:00:00Z',
    location: { city: 'Amsterdam', venue: 'WeWork Spaces', address: 'Keizersgracht 126, Amsterdam' }, price: 0, totalSeats: 50, bookedSeats: 48, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['entrepreneurship', 'workshop', 'business'], status: 'published', popularity: 82,
  },
  {
    id: 'e11', title: 'Digital Photography Masterclass', description: 'Master the art of digital photography with hands-on sessions covering composition, lighting, post-processing, and portfolio building.', category: 'c5', date: '2025-11-15T10:00:00Z', endDate: '2025-11-16T16:00:00Z',
    location: { city: 'London', venue: 'The Photography Studio', address: '85 Great Eastern St, London' }, price: 199, totalSeats: 30, bookedSeats: 22, image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['photography', 'masterclass', 'digital'], status: 'published', popularity: 70,
  },
  {
    id: 'e12', title: 'Wine & Cheese Tasting', description: 'An exquisite evening of curated wine and artisan cheese pairings. Learn from expert sommeliers about flavor profiles and pairing techniques.', category: 'c6', date: '2025-10-10T18:00:00Z', endDate: '2025-10-10T21:00:00Z',
    location: { city: 'New York', venue: 'The Cellar NYC', address: '210 W 50th St, New York' }, price: 95, totalSeats: 40, bookedSeats: 38, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', organizerId: 'u2', organizerName: 'Bob Carter', tags: ['wine', 'cheese', 'tasting'], status: 'published', popularity: 75,
  },
];

let MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', eventId: 'e1', userId: 'u1', seats: 2, totalPrice: 598, status: 'confirmed', createdAt: '2025-08-01T10:00:00Z' },
  { id: 'b2', eventId: 'e2', userId: 'u1', seats: 1, totalPrice: 75, status: 'confirmed', createdAt: '2025-08-05T14:00:00Z' },
  { id: 'b3', eventId: 'e6', userId: 'u1', seats: 3, totalPrice: 0, status: 'confirmed', createdAt: '2025-08-10T09:00:00Z' },
  { id: 'b4', eventId: 'e3', userId: 'u1', seats: 1, totalPrice: 0, status: 'cancelled', createdAt: '2025-07-20T11:00:00Z' },
  { id: 'b5', eventId: 'e5', userId: 'u1', seats: 2, totalPrice: 50, status: 'confirmed', createdAt: '2025-08-15T16:00:00Z' },
];

let nextUserId = 4;
let nextEventId = 13;
let nextBookingId = 6;

// --- AUTH SERVICE ---

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('evt_user', JSON.stringify(user));
    const { password: _, ...safeUser } = user;
    return { user: safeUser as User, token };
  },

  async register(data: { name: string; email: string; password: string; role: 'user' | 'organizer' }): Promise<{ user: User; token: string }> {
    await delay();
    if (MOCK_USERS.find(u => u.email === data.email)) throw new Error('Email already exists');
    const user: User = {
      id: `u${nextUserId++}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    };
    MOCK_USERS.push(user);
    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('evt_user', JSON.stringify(user));
    const { password: _, ...safeUser } = user;
    return { user: safeUser as User, token };
  },

  async getMe(): Promise<User | null> {
    await delay();
    const token = localStorage.getItem(TOKEN_KEY);
    const stored = localStorage.getItem('evt_user');
    if (!token || !stored) return null;
    return JSON.parse(stored);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay();
    const stored = localStorage.getItem('evt_user');
    if (!stored) throw new Error('Not authenticated');
    const current = JSON.parse(stored);
    const updated = { ...current, ...data };
    localStorage.setItem('evt_user', JSON.stringify(updated));
    const idx = MOCK_USERS.findIndex(u => u.id === current.id);
    if (idx >= 0) MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data };
    return updated;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('evt_user');
  },
};

// --- EVENT SERVICE ---

export const eventService = {
  async getEvents(filters: EventFilters = {}): Promise<{ events: Event[]; total: number; totalPages: number }> {
    await delay();
    let results = MOCK_EVENTS.filter(e => e.status === 'published');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (filters.category) results = results.filter(e => e.category === filters.category);
    if (filters.city) results = results.filter(e => e.location.city === filters.city);
    if (filters.freeOnly) results = results.filter(e => e.price === 0);
    if (filters.minPrice !== undefined) results = results.filter(e => e.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) results = results.filter(e => e.price <= filters.maxPrice!);

    // Sort
    switch (filters.sort) {
      case 'price-asc': results.sort((a, b) => a.price - b.price); break;
      case 'price-desc': results.sort((a, b) => b.price - a.price); break;
      case 'popular': results.sort((a, b) => b.popularity - a.popularity); break;
      default: results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    const total = results.length;
    const limit = filters.limit || 12;
    const page = filters.page || 1;
    const totalPages = Math.ceil(total / limit);
    results = results.slice((page - 1) * limit, page * limit);

    return { events: results, total, totalPages };
  },

  async getEvent(id: string): Promise<Event | null> {
    await delay();
    return MOCK_EVENTS.find(e => e.id === id) || null;
  },

  async createEvent(data: Omit<Event, 'id' | 'bookedSeats' | 'status' | 'popularity'>): Promise<Event> {
    await delay();
    const event: Event = { ...data, id: `e${nextEventId++}`, bookedSeats: 0, status: 'published', popularity: Math.floor(Math.random() * 50) + 50 };
    MOCK_EVENTS.push(event);
    return event;
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    await delay();
    const idx = MOCK_EVENTS.findIndex(e => e.id === id);
    if (idx < 0) throw new Error('Event not found');
    MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], ...data };
    return MOCK_EVENTS[idx];
  },

  async deleteEvent(id: string): Promise<void> {
    await delay();
    const hasBookings = MOCK_BOOKINGS.some(b => b.eventId === id && b.status === 'confirmed');
    if (hasBookings) throw new Error('Cannot delete event with active bookings');
    MOCK_EVENTS = MOCK_EVENTS.filter(e => e.id !== id);
  },

  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    await delay();
    return MOCK_EVENTS.filter(e => e.organizerId === organizerId);
  },

  async getCategories(): Promise<Category[]> {
    await delay();
    return MOCK_CATEGORIES;
  },

  getCities(): string[] {
    return [...new Set(MOCK_EVENTS.map(e => e.location.city))];
  },
};

// --- BOOKING SERVICE ---

export const bookingService = {
  async getBookings(userId: string): Promise<(Booking & { event?: Event })[]> {
    await delay();
    return MOCK_BOOKINGS
      .filter(b => b.userId === userId)
      .map(b => ({ ...b, event: MOCK_EVENTS.find(e => e.id === b.eventId) }));
  },

  async createBooking(data: { eventId: string; userId: string; seats: number }): Promise<Booking> {
    await delay();
    const event = MOCK_EVENTS.find(e => e.id === data.eventId);
    if (!event) throw new Error('Event not found');
    if (event.bookedSeats + data.seats > event.totalSeats) throw new Error('Not enough seats available');

    const booking: Booking = {
      id: `b${nextBookingId++}`,
      eventId: data.eventId,
      userId: data.userId,
      seats: data.seats,
      totalPrice: event.price * data.seats,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    MOCK_BOOKINGS.push(booking);
    event.bookedSeats += data.seats;
    return booking;
  },

  async cancelBooking(id: string): Promise<void> {
    await delay();
    const booking = MOCK_BOOKINGS.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    booking.status = 'cancelled';
    const event = MOCK_EVENTS.find(e => e.id === booking.eventId);
    if (event) event.bookedSeats -= booking.seats;
  },

  async getEventBookings(eventId: string): Promise<(Booking & { userName?: string })[]> {
    await delay();
    return MOCK_BOOKINGS
      .filter(b => b.eventId === eventId)
      .map(b => ({ ...b, userName: MOCK_USERS.find(u => u.id === b.userId)?.name }));
  },
};
