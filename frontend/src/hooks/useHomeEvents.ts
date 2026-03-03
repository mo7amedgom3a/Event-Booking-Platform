import { useState, useEffect } from 'react';
import { eventService, Event, Category } from '@/services/api';

export const useHomeEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          eventService.getEvents({ limit: 10 }),
          eventService.getCategories()
        ]);
        
        // Ensure that eventsResponse has 'events' key because of API pagination standard response, or is just an array
        const eventsData = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse as any).events || [];
        
        if (Array.isArray(eventsData)) {
          // Note: you can add more complex logic to get "featured" ones, for now just taking first 6 active docs
          const upcoming = eventsData.filter((e: Event) => e.status !== 'cancelled' && new Date(e.date) > new Date());
          upcoming.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setFeaturedEvents(upcoming.slice(0, 6));
        }

        setCategories(categoriesResponse);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    featuredEvents,
    categories,
    loading
  };
};
