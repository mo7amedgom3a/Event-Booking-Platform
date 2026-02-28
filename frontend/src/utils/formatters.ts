import { format, formatDistanceToNow, isPast, differenceInHours } from 'date-fns';

export const formatDate = (date: string) => date ? format(new Date(date), 'EEEE, MMMM d') : '';
export const formatTime = (date: string) => date ? format(new Date(date), 'h:mm a') : '';
export const formatDateTime = (start: string, end?: string) => {
  const s = new Date(start);
  const formatted = `${format(s, 'EEEE, MMMM d')} · ${format(s, 'h:mm a')}`;
  if (end) return `${formatted} – ${format(new Date(end), 'h:mm a')}`;
  return formatted;
};

export const formatPrice = (price: number) => {
  if (price === 0) return 'FREE';
  return `$${price.toFixed(0)}`;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

export const isEventPast = (date: string) => isPast(new Date(date));

export const canCancelBooking = (eventDate: string) =>
  differenceInHours(new Date(eventDate), new Date()) > 24;

export const timeUntil = (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true });

export const getAvailabilityColor = (available: number, total: number) => {
  const pct = available / total;
  if (pct <= 0) return 'bg-muted-foreground';
  if (pct <= 0.1) return 'bg-destructive';
  if (pct <= 0.5) return 'bg-accent';
  return 'bg-success';
};

export const getAvailabilityLabel = (available: number, total: number) => {
  if (available <= 0) return 'Sold Out';
  if (available <= total * 0.1) return `Only ${available} left!`;
  return `${available} seats available`;
};
