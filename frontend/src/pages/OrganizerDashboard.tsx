import { Link } from 'react-router-dom';
import { Plus, CalendarCheck, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatters';
import { useOrganizerDashboard } from '@/hooks/useOrganizerDashboard';

import { StatCard } from '@/components/dashboard/StatCard';
import { OrganizerEventsTable } from '@/components/dashboard/OrganizerEventsTable';
import { EventBookingsModal } from '@/components/dashboard/EventBookingsModal';

const OrganizerDashboard = () => {
  const {
    events,
    recentBookings,
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
  } = useOrganizerDashboard();

  if (loading) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

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
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events table */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-4">My Events</h2>
          <OrganizerEventsTable 
            events={events} 
            handleViewBookings={handleViewBookings} 
            handleDelete={handleDelete} 
          />
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
      <EventBookingsModal 
        selectedEventId={selectedEventId}
        events={events}
        eventBookings={eventBookings}
        bookingsLoading={bookingsLoading}
        closeBookingsModal={closeBookingsModal}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default OrganizerDashboard;
