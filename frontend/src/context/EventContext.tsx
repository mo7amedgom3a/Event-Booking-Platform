import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { eventService, Event, Category, EventFilters } from '@/services/api';

interface EventState {
  events: Event[];
  categories: Category[];
  filters: EventFilters;
  total: number;
  totalPages: number;
  isLoading: boolean;
}

interface EventContextType extends EventState {
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  fetchEvents: () => Promise<void>;
  cities: string[];
}

const defaultFilters: EventFilters = { search: '', page: 1, limit: 12, sort: 'date' };

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EventState>({
    events: [],
    categories: [],
    filters: defaultFilters,
    total: 0,
    totalPages: 1,
    isLoading: false,
  });

  const fetchEvents = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const [result, categories] = await Promise.all([
        eventService.getEvents(state.filters),
        state.categories.length ? Promise.resolve(state.categories) : eventService.getCategories(),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setState(s => ({
        ...s,
        events: result.events,
        total: result.total,
        totalPages: result.totalPages,
        categories,
        isLoading: false,
      }));
    } catch {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, [state.filters, state.categories.length]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const setFilter = useCallback((key: string, value: any) => {
    setState(s => ({ ...s, filters: { ...s.filters, [key]: value, page: 1 } }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(s => ({ ...s, filters: defaultFilters }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setState(s => ({ ...s, filters: { ...s.filters, sort, page: 1 } }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(s => ({ ...s, filters: { ...s.filters, page } }));
  }, []);

  const cities = eventService.getCities();

  return (
    <EventContext.Provider value={{ ...state, setFilter, clearFilters, setSort, setPage, fetchEvents, cities }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
};
