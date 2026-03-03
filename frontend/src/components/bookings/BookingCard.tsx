import { Link } from 'react-router-dom';
import { Calendar, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingWithEvent } from '@/hooks/useMyBookings';
import { formatDateTime, formatCurrency, canCancelBooking, isEventPast } from '@/utils/formatters';

const statusColors: Record<string, string> = {
  confirmed: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
  past: 'bg-muted text-muted-foreground',
  pending: 'bg-primary/20 text-primary',
};

interface BookingCardProps {
  booking: BookingWithEvent;
  onCancelClick: (booking: BookingWithEvent) => void;
}

export const BookingCard = ({ booking, onCancelClick }: BookingCardProps) => {
  const isPast = booking.event ? isEventPast(booking.event.date) : false;
  const canCancel = booking.status !== 'cancelled' && !isPast && booking.event && canCancelBooking(booking.event.date);
  const status = isPast && booking.status !== 'cancelled' ? 'past' : booking.status;

  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border bg-card p-4">
      {booking.event && (
        <Link to={`/events/${booking.event.id}`} className="flex-shrink-0">
          <img src={booking.event.image} alt={booking.event.title} className="h-24 w-36 rounded-md object-cover" />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status}</span>
        </div>
        <h3 className="font-display font-bold mb-1">{booking.event?.title || 'Unknown Event'}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {booking.event && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateTime(booking.event.date)}</span>}
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{booking.seats} seat{booking.seats > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Ticket className="h-3 w-3" />{booking.totalPrice === 0 ? 'FREE' : formatCurrency(booking.totalPrice)}</span>
        </div>
      </div>
      {canCancel && (
        <Button 
          variant="outline" 
          size="sm" 
          className="self-start text-destructive border-destructive/30 hover:bg-destructive/10" 
          onClick={() => onCancelClick(booking)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
