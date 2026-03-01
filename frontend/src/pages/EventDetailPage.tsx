import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, User as UserIcon, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { eventService, bookingService, Event } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { formatDateTime, formatPrice, formatCurrency, getAvailabilityColor, isEventPast } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { categories } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      eventService.getEvent(id).then(e => { setEvent(e); setLoading(false); });
    }
  }, [id]);

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;
  if (!event) return <div className="container py-16 text-center"><h2 className="font-display text-2xl">Event not found</h2></div>;

  const category = categories.find(c => c.id === event.category);
  const available = event.availableSeats;
  const isSoldOut = available <= 0;
  const isPast = isEventPast(event.date);
  const total = event.price * seats;

  const handleBook = async () => {
    if (!user) return;
    setBooking(true);
    try {
      await bookingService.createBooking({ eventId: event.id, userId: user.id, seats });
      setEvent(prev => prev ? { ...prev, availableSeats: prev.availableSeats - seats } : prev);
      setShowModal(false);
      toast({ title: "You're booked! See you there 🎟️" });
    } catch (err: any) {
      toast({ title: 'Booking failed', description: err.message, variant: 'destructive' });
    }
    setBooking(false);
  };

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div className="absolute top-4 left-4 z-20 md:top-6 md:left-6">
          <Link to="/events" className="inline-flex items-center text-primary bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-background transition-colors text-sm font-medium border border-border shadow-md">
            ← Back to Events
          </Link>
        </div>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container -mt-24 relative z-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {category && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/20 text-primary">{category.icon} {category.name}</span>}
              {isPast && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">Event Ended</span>}
              {event.status === 'cancelled' && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/20 text-destructive">Cancelled</span>}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-black mb-4">{event.title}</h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{formatDateTime(event.date, event.endDate)}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{event.location.venue}, {event.location.city}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className={`text-muted-foreground leading-relaxed ${!expanded && event.description.length > 300 ? 'line-clamp-4' : ''}`}>
                {event.description}
              </p>
              {event.description.length > 300 && (
                <button onClick={() => setExpanded(!expanded)} className="text-primary text-sm font-medium mt-2">
                  {expanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-surface-2 text-muted-foreground">
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>

            {/* Location card */}
            <div className="rounded-lg border border-border bg-card p-4 mb-6">
              <h3 className="font-body font-semibold mb-2">📍 Location</h3>
              <p className="text-foreground font-medium">{event.location.venue}</p>
              <p className="text-muted-foreground text-sm mb-4">{event.location.address}</p>
              {event.location.lat && event.location.lng && (
                <div className="h-48 w-full rounded-md overflow-hidden border border-border">
                  <MapContainer center={[event.location.lat, event.location.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    />
                    <Marker position={[event.location.lat, event.location.lng]} />
                  </MapContainer>
                </div>
              )}
            </div>

            {/* Organizer */}
            <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organized by</p>
                <p className="font-medium">{event.organizerName}</p>
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24 rounded-lg border border-border bg-card p-6">
              <div className="text-3xl font-bold mb-4">{event.price === 0 ? <span className="text-success">FREE</span> : formatCurrency(event.price)}</div>

              {/* Availability bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">{available} / {event.totalSeats}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getAvailabilityColor(available, event.totalSeats)}`}
                    style={{ width: `${(available / event.totalSeats) * 100}%` }}
                  />
                </div>
              </div>

              {!isPast && !isSoldOut && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Seats</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSeats(Math.max(1, seats - 1))} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-surface transition-colors"><Minus className="h-4 w-4" /></button>
                      <span className="font-bold w-8 text-center">{seats}</span>
                      <button onClick={() => setSeats(Math.min(available, seats + 1))} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-surface transition-colors"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>

                  {event.price > 0 && (
                    <div className="flex justify-between mb-4 text-sm">
                      <span className="text-muted-foreground">{formatCurrency(event.price)} × {seats}</span>
                      <span className="font-bold text-lg">{formatCurrency(total)}</span>
                    </div>
                  )}
                </>
              )}

              {!isAuthenticated ? (
                <Button className="w-full" size="lg" onClick={() => navigate(`/login?redirect=/events/${event.id}`)}>Login to Book</Button>
              ) : isPast ? (
                <Button className="w-full" size="lg" disabled>Event Ended</Button>
              ) : isSoldOut ? (
                <Button className="w-full" size="lg" disabled>Sold Out</Button>
              ) : (
                <Button className="w-full" size="lg" onClick={() => setShowModal(true)}>Book Now</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Booking" size="sm">
        <div className="space-y-4">
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{event.title}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDateTime(event.date)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span>{seats}</span></div>
            <div className="flex justify-between border-t border-border pt-2"><span className="font-medium">Total</span><span className="font-bold text-lg">{event.price === 0 ? 'FREE' : formatCurrency(total)}</span></div>
          </div>
          <Button className="w-full" onClick={handleBook} disabled={booking}>
            {booking ? <Spinner className="h-4 w-4" /> : 'Confirm Booking'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetailPage;
