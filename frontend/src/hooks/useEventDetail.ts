import { useState, useEffect } from 'react';
import { eventService, bookingService, Event } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useEventDetail = (id?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // UI state
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      eventService.getEvent(id).then(e => {
        setEvent(e);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBook = async () => {
    if (!user || !event) return;
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

  return {
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
  };
};
