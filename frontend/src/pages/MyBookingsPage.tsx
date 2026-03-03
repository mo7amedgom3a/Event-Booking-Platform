import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { useMyBookings } from '@/hooks/useMyBookings';
import { BookingCard } from '@/components/bookings/BookingCard';

const MyBookingsPage = () => {
  const {
    filteredBookings,
    loading,
    filter,
    setFilter,
    selectedBooking,
    setSelectedBooking,
    cancelling,
    handleCancel
  } = useMyBookings();

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

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎫</p>
          <h3 className="font-display text-xl font-bold mb-2">No bookings yet</h3>
          <p className="text-muted-foreground mb-4">Start exploring events and book your next experience!</p>
          <Link to="/events"><Button>Browse Events</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(b => (
            <BookingCard key={b.id} booking={b} onCancelClick={setSelectedBooking} />
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Cancel Booking?" size="sm">
        <p className="text-muted-foreground text-sm mb-4">Are you sure? This cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setSelectedBooking(null)}>Keep</Button>
          <Button variant="destructive" className="flex-1" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <Spinner className="h-4 w-4" /> : 'Cancel Booking'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
