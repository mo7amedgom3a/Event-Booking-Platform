import { useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/services/api';
import { formatCurrency, getAvailabilityColor, isEventPast } from '@/utils/formatters';

interface BookingSidebarProps {
  event: Event;
  seats: number;
  setSeats: (num: number) => void;
  isAuthenticated: boolean;
  setShowModal: (show: boolean) => void;
}

export const BookingSidebar = ({ event, seats, setSeats, isAuthenticated, setShowModal }: BookingSidebarProps) => {
  const navigate = useNavigate();
  
  const available = event.availableSeats;
  const isSoldOut = available <= 0;
  const isPast = isEventPast(event.date);
  const total = event.price * seats;

  return (
    <div className="lg:w-96 flex-shrink-0">
      <div className="lg:sticky lg:top-24 rounded-lg border border-border bg-card p-6">
        <div className="text-3xl font-bold mb-4">{event.price === 0 ? <span className="text-success">FREE</span> : formatCurrency(event.price)}</div>

        {/* Availability bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Availability</span>
            <span className="font-medium">{available} / {event.totalSeats}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getAvailabilityColor(available, event.totalSeats)}`}
              style={{ width: `${(available / event.totalSeats) * 100}%` }}
            />
          </div>
        </div>

        {!isPast && !isSoldOut && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Seats</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setSeats(Math.max(1, seats - 1))} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-surface transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="font-bold w-8 text-center">{seats}</span>
                <button onClick={() => setSeats(Math.min(available, seats + 1))} className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-surface transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            {event.price > 0 && (
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">{formatCurrency(event.price)} × {seats}</span>
                <span className="font-bold text-lg">{formatCurrency(total)}</span>
              </div>
            )}
          </>
        )}

        {!isAuthenticated ? (
          <Button className="w-full" size="lg" onClick={() => navigate(`/login?redirect=/events/${event.id}`)}>Login to Book</Button>
        ) : isPast ? (
          <Button className="w-full" size="lg" disabled>Event Ended</Button>
        ) : isSoldOut ? (
          <Button className="w-full" size="lg" disabled>Sold Out</Button>
        ) : (
          <Button className="w-full" size="lg" onClick={() => setShowModal(true)}>Book Now</Button>
        )}
      </div>
    </div>
  );
};
