import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CalendarCheck, Users, DollarSign, Calendar, Pencil, Trash2, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import { eventService, bookingService, Event, Booking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatCurrency, isEventPast } from '@/utils/formatters';

const OrganizerDashboard = () => {
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
      try {
        const stats = await eventService.getOrganizerStatistics();
        setStatsData(stats);
      } catch (err) {
        console.error('Failed to load stats', err);
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
      setEventBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      await bookingService.updateBookingStatus(selectedEventId, bookingId, newStatus);
      toast({ title: 'Booking updated' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message || 'Error updating status', variant: 'destructive' });
      // Revert on failure (could be improved by storing previous state, but triggering a re-fetch works simply too)
      handleViewBookings(selectedEventId); 
    }
  };

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

  const totalBookings = statsData ? statsData.total_bookings : recentBookings.length;
  const totalRevenue = statsData ? statsData.revenue : events.reduce((sum, e) => sum + e.price * (e.totalSeats - e.availableSeats), 0);
  const attendanceRate = statsData ? statsData.attendance_rate : 0;

  const stats = [
    { label: 'Total Events', value: events.length, icon: CalendarCheck, color: 'text-primary' },
    { label: 'Total Bookings', value: totalBookings, icon: Users, color: 'text-accent' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-success' },
    { label: 'Attendance', value: `${attendanceRate.toFixed(1)}%`, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <Link to="/events/create"><Button className="gap-2"><Plus className="h-4 w-4" />Create Event</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events table */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-4">My Events</h2>
          {events.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-border bg-card">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-muted-foreground mb-3">No events yet</p>
              <Link to="/events/create"><Button size="sm">Create Your First Event</Button></Link>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Seats</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e.id} className="border-t border-border">
                        <td className="p-3 font-medium">
                          <Link to={`/events/${e.id}`} className="hover:text-primary transition-colors">{e.title}</Link>
                        </td>
                        <td className="p-3 text-muted-foreground">{formatDate(e.date)}</td>
                        <td className="p-3 text-muted-foreground">{e.totalSeats - e.availableSeats}/{e.totalSeats}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isEventPast(e.date) ? 'bg-muted text-muted-foreground' : 'bg-success/20 text-success'}`}>
                            {isEventPast(e.date) ? 'Past' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleViewBookings(e.id)} title="View Bookings">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Link to={`/events/${e.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Event"><Pencil className="h-3.5 w-3.5" /></Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(e.id)} title="Delete Event">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="rounded-lg border border-border bg-card p-3">
                  <p className="font-medium text-sm">{b.userName || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{b.eventTitle} · {b.seats} seat{b.seats > 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(b.totalPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bookings Modal */}
      {selectedEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-3xl rounded-lg border border-border flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display font-semibold text-lg">
                Event Bookings
                {events.find(e => e.id === selectedEventId) && ` - ${events.find(e => e.id === selectedEventId)?.title}`}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeBookingsModal}><X className="h-5 w-5" /></Button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              {bookingsLoading ? (
                <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
              ) : eventBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No bookings found for this event.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface">
                        <tr>
                          <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Seats</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventBookings.map(b => (
                          <tr key={b.id} className="border-t border-border">
                            <td className="p-3 font-medium">{b.userName || 'Unknown'}</td>
                            <td className="p-3 text-muted-foreground">{formatDate(b.createdAt)}</td>
                            <td className="p-3 text-right">{b.seats}</td>
                            <td className="p-3 text-right">{formatCurrency(b.totalPrice)}</td>
                            <td className="p-3 text-right">
                              <select 
                                className={`text-xs px-2 py-1 rounded-md border outline-none font-medium ${
                                  b.status === 'confirmed' ? 'bg-success/20 text-success border-success/30' :
                                  b.status === 'cancelled' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                                  b.status === 'refunded' ? 'bg-muted text-muted-foreground border-border' :
                                  'bg-accent/20 text-accent border-accent/30'
                                }`}
                                value={b.status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={closeBookingsModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
