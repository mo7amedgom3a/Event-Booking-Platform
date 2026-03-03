import { useState, useEffect } from 'react';
import { eventService, bookingService, Event, Booking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useOrganizerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [recentBookings, setRecentBookings] = useState<(Booking & { userName?: string; eventTitle?: string })[]>([]);
  const [statsData, setStatsData] = useState<{ total_bookings: number; revenue: number; attendance_rate: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventBookings, setEventBookings] = useState<(Booking & { userName?: string })[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const evts = await eventService.getOrganizerEvents(user.id);
        setEvents(evts);
        
        // Gather recent bookings
        const allBookings: any[] = [];
        for (const evt of evts.slice(0, 5)) {
          const bookings = await bookingService.getEventBookings(evt.id);
          bookings.forEach(b => allBookings.push({ ...b, eventTitle: evt.title }));
        }
        allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentBookings(allBookings.slice(0, 5));
        
        const stats = await eventService.getOrganizerStatistics();
        setStatsData(stats);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Event deleted' });
    } catch (err: any) {
      toast({ title: 'Cannot delete', description: err.message, variant: 'destructive' });
    }
  };

  const handleViewBookings = async (eventId: string) => {
    setSelectedEventId(eventId);
    setBookingsLoading(true);
    try {
      const bookings = await bookingService.getEventBookings(eventId);
      setEventBookings(bookings);
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to load bookings.', variant: 'destructive' });
    } finally {
      setBookingsLoading(false);
    }
  };

  const closeBookingsModal = () => {
    setSelectedEventId(null);
    setEventBookings([]);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!selectedEventId) return;
    try {
      // Optimistic update
      setEventBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b));
      await bookingService.updateBookingStatus(selectedEventId, bookingId, newStatus);
      toast({ title: 'Booking updated' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message || 'Error updating status', variant: 'destructive' });
      // Revert on failure (could be improved by storing previous state, but triggering a re-fetch works simply too)
      handleViewBookings(selectedEventId); 
    }
  };

  const totalBookings = statsData ? statsData.total_bookings : recentBookings.length;
  const totalRevenue = statsData ? statsData.revenue : events.reduce((sum, e) => sum + e.price * (e.totalSeats - e.availableSeats), 0);
  const attendanceRate = statsData ? statsData.attendance_rate : 0;

  return {
    events,
    recentBookings,
    statsData,
    loading,
    selectedEventId,
    eventBookings,
    bookingsLoading,
    totalBookings,
    totalRevenue,
    attendanceRate,
    handleDelete,
    handleViewBookings,
    closeBookingsModal,
    handleStatusChange
  };
};
