import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';
import { Event, Booking } from '@/services/api';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface BookingWithEvent extends Booking {
  userName?: string;
}

interface EventBookingsModalProps {
  selectedEventId: string | null;
  events: Event[];
  eventBookings: BookingWithEvent[];
  bookingsLoading: boolean;
  closeBookingsModal: () => void;
  handleStatusChange: (bookingId: string, status: string) => void;
}

export const EventBookingsModal = ({
  selectedEventId,
  events,
  eventBookings,
  bookingsLoading,
  closeBookingsModal,
  handleStatusChange
}: EventBookingsModalProps) => {
  if (!selectedEventId) return null;

  const eventTitle = events.find(e => e.id === selectedEventId)?.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-3xl rounded-lg border border-border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-semibold text-lg">
            Event Bookings{eventTitle ? ` - ${eventTitle}` : ''}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeBookingsModal}>
            <X className="h-5 w-5" />
          </Button>
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
  );
};
