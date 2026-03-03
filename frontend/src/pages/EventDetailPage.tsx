import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { formatDateTime, formatCurrency, isEventPast } from '@/utils/formatters';
import { useEventDetail } from '@/hooks/useEventDetail';

import { EventLocationMap } from '@/components/events/EventLocationMap';
import { BookingSidebar } from '@/components/events/BookingSidebar';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { categories } = useEvents();
  const navigate = useNavigate();
  
  const {
    event,
    loading,
    seats,
    setSeats,
    booking,
    showModal,
    setShowModal,
    expanded,
    setExpanded,
    handleBook
  } = useEventDetail(id);

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;
  if (!event) return <div className="container py-16 text-center"><h2 className="font-display text-2xl">Event not found</h2></div>;

  const category = categories.find(c => c.id === event.category);
  const isPast = isEventPast(event.date);
  const total = event.price * seats;

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

            <div className="flex flex-col gap-2 text-muted-foreground mb-6">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> <strong>Start Date:</strong> {formatDateTime(event.date)}</span>
              {event.endDate && <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> <strong>End Date:</strong> {formatDateTime(event.endDate)}</span>}
              <span className="flex items-center gap-2 mt-2"><MapPin className="h-4 w-4 text-primary" />{event.location.venue}, {event.location.city}</span>
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
                  <EventLocationMap lat={event.location.lat} lng={event.location.lng} />
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
          <BookingSidebar 
            event={event} 
            seats={seats} 
            setSeats={setSeats} 
            isAuthenticated={isAuthenticated} 
            setShowModal={setShowModal} 
          />
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
