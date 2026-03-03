import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/services/api';
import { formatDate, isEventPast } from '@/utils/formatters';

interface OrganizerEventsTableProps {
  events: Event[];
  handleViewBookings: (id: string) => void;
  handleDelete: (id: string) => void;
}

export const OrganizerEventsTable = ({ events, handleViewBookings, handleDelete }: OrganizerEventsTableProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border border-border bg-card">
        <p className="text-4xl mb-3">📅</p>
        <p className="text-muted-foreground mb-3">No events yet</p>
        <Link to="/events/create"><Button size="sm">Create Your First Event</Button></Link>
      </div>
    );
  }

  return (
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
  );
};
