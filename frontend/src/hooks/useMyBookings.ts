import { useState, useEffect } from 'react';
import { bookingService, Booking, Event } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type BookingWithEvent = Booking & { event?: Event };

export const useMyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<BookingWithEvent | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      bookingService.getBookings(user.id)
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load bookings', err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleCancel = async () => {
    if (!selectedBooking) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b));
      setSelectedBooking(null);
      toast({ title: 'Booking cancelled successfully' });
    } catch (err: any) {
      toast({ title: 'Cancellation failed', description: err.message, variant: 'destructive' });
    }
    setCancelling(false);
  };

  const filteredBookings = bookings.filter(booking => {
    if (!booking.event) return false;
    const isPast = new Date(booking.event.date) < new Date();
    
    if (filter === 'upcoming') return !isPast && booking.status !== 'cancelled';
    if (filter === 'past') return isPast && booking.status !== 'cancelled';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  return {
    bookings,
    filteredBookings,
    loading,
    filter,
    setFilter,
    selectedBooking,
    setSelectedBooking,
    cancelling,
    handleCancel
  };
};
