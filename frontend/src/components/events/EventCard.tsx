import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Event, MOCK_CATEGORIES } from '@/services/api';
import { formatDate, formatPrice, getAvailabilityColor, getAvailabilityLabel } from '@/utils/formatters';

interface EventCardProps {
  event: Event;
  view?: 'grid' | 'list';
}

const EventCard = ({ event, view = 'grid' }: EventCardProps) => {
  const category = MOCK_CATEGORIES.find(c => c.id === event.category);
  const isSoldOut = event.bookedSeats >= event.totalSeats;

  if (view === 'list') {
    return (
      <Link to={`/events/${event.id}`} className="group flex gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all duration-300">
        <img src={event.image} alt={event.title} className="h-24 w-36 rounded-md object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {category && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary">{category.icon} {category.name}</span>}
          </div>
          <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors truncate">{event.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(event.date)}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location.city}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <span className={`font-bold text-lg ${event.price === 0 ? 'text-success' : 'text-foreground'}`}>{formatPrice(event.price)}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${getAvailabilityColor(event.bookedSeats, event.totalSeats)}`} />
            {getAvailabilityLabel(event.bookedSeats, event.totalSeats)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/events/${event.id}`} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative h-48 overflow-hidden">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {category && (
          <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full glass text-foreground">
            {category.icon} {category.name}
          </span>
        )}
        {isSoldOut && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5" />
          {event.location.city}
        </div>
        <div className="flex items-center justify-between">
          <span className={`font-bold text-lg ${event.price === 0 ? 'text-success' : 'text-foreground'}`}>
            {formatPrice(event.price)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${getAvailabilityColor(event.bookedSeats, event.totalSeats)}`} />
            {getAvailabilityLabel(event.bookedSeats, event.totalSeats)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
