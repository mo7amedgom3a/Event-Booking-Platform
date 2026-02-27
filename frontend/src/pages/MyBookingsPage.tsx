import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { bookingService, Booking, Event } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatPrice, formatCurrency, canCancelBooking, isEventPast } from '@/utils/formatters';

type BookingWithEvent = Booking & { event?: Event };

const statusColors: Record<string, string> = {
  confirmed: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
  past: 'bg-muted text-muted-foreground',
};

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      bookingService.getBookings(user.id).then(b => { setBookings(b); setLoading(false); });
    }
  }, [user]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelId);
      setBookings(prev => prev.map(b => b.id === cancelId ? { ...b, status: 'cancelled' as const } : b));
      toast({ title: 'Booking cancelled. Seats released.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setCancelling(false);
    setCancelId(null);
  };

  const filtered = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'past') return b.event && isEventPast(b.event.date);
    return b.status === filter;
  });

  const tabs = ['all', 'confirmed', 'cancelled', 'past'];

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-6">My Bookings</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎫</p>
          <h3 className="font-display text-xl font-bold mb-2">No bookings yet</h3>
          <p className="text-muted-foreground mb-4">Start exploring events and book your next experience!</p>
          <Link to="/events"><Button>Browse Events</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => {
            const isPast = b.event ? isEventPast(b.event.date) : false;
            const canCancel = b.status === 'confirmed' && !isPast && b.event && canCancelBooking(b.event.date);
            const status = isPast && b.status === 'confirmed' ? 'past' : b.status;
            return (
              <div key={b.id} className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border bg-card p-4">
                {b.event && (
                  <Link to={`/events/${b.event.id}`} className="flex-shrink-0">
                    <img src={b.event.image} alt={b.event.title} className="h-24 w-36 rounded-md object-cover" />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status}</span>
                  </div>
                  <h3 className="font-display font-bold mb-1">{b.event?.title || 'Unknown Event'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {b.event && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(b.event.date)}</span>}
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{b.seats} seat{b.seats > 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1"><Ticket className="h-3 w-3" />{b.totalPrice === 0 ? 'FREE' : formatCurrency(b.totalPrice)}</span>
                  </div>
                </div>
                {canCancel && (
                  <Button variant="outline" size="sm" className="self-start text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setCancelId(b.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Booking?" size="sm">
        <p className="text-muted-foreground text-sm mb-4">Are you sure? This cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setCancelId(null)}>Keep</Button>
          <Button variant="destructive" className="flex-1" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <Spinner className="h-4 w-4" /> : 'Cancel Booking'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
