import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';

export const useEventsFilter = () => {
  const { events, categories, filters, total, totalPages, isLoading, setFilter, clearFilters, setSort, setPage, cities } = useEvents();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [localPrice, setLocalPrice] = useState(filters.maxPrice ?? 500);

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setFilter('category', cat);
    if (q) { setFilter('search', q); setSearchInput(q); }
    setFilter('limit', 3);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setFilter('search', searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync local price on mount / external change
  useEffect(() => {
    if (filters.maxPrice !== undefined && filters.maxPrice !== localPrice) {
       setLocalPrice(filters.maxPrice);
    }
  }, [filters.maxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced price filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('maxPrice', localPrice === 500 ? undefined : localPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [localPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    events,
    categories,
    filters,
    total,
    totalPages,
    isLoading,
    setFilter,
    clearFilters,
    setSort,
    setPage,
    cities,
    view,
    setView,
    searchInput,
    setSearchInput,
    mobileFilters,
    setMobileFilters,
    localPrice,
    setLocalPrice
  };
};
