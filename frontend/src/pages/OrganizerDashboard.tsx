import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CalendarCheck, Users, DollarSign, Calendar, Pencil, Trash2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

  const totalBookings = recentBookings.length;
  const totalRevenue = events.reduce((sum, e) => sum + e.price * e.bookedSeats, 0);
  const upcoming = events.filter(e => !isEventPast(e.date)).length;

  const stats = [
    { label: 'Total Events', value: events.length, icon: CalendarCheck, color: 'text-primary' },
    { label: 'Total Bookings', value: totalBookings, icon: Users, color: 'text-accent' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-success' },
    { label: 'Upcoming', value: upcoming, icon: Calendar, color: 'text-primary' },
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
                        <td className="p-3 text-muted-foreground">{e.bookedSeats}/{e.totalSeats}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isEventPast(e.date) ? 'bg-muted text-muted-foreground' : 'bg-success/20 text-success'}`}>
                            {isEventPast(e.date) ? 'Past' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Link to={`/events/${e.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(e.id)}>
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
    </div>
  );
};

export default OrganizerDashboard;
