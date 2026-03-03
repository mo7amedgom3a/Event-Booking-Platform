import { Search, Grid3X3, List, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import EventCard from '@/components/events/EventCard';
import Loading, { EventCardSkeleton } from '@/components/common/Loading';
import { useEventsFilter } from '@/hooks/useEventsFilter';

import { FilterSidebar } from '@/components/events/FilterSidebar';

const EventsPage = () => {
  const {
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
  } = useEventsFilter();

  const filterProps = {
    categories,
    cities,
    filters,
    setFilter,
    localPrice,
    setLocalPrice,
    clearFilters
  };

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Browse Events</h1>

      <div className="flex gap-8">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar {...filterProps} />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-10 bg-surface"
              />
            </div>
            <Select value={filters.sort || 'date'} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] bg-surface"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="price-asc">Price (Low→High)</SelectItem>
                <SelectItem value="price-desc">Price (High→Low)</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-md overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}><Grid3X3 className="h-4 w-4" /></button>
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}><List className="h-4 w-4" /></button>
            </div>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileFilters(true)}>Filters</Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">Showing {events.length} of {total} events</p>

          {isLoading ? (
            <Loading type="skeleton" />
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-display text-xl font-bold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {events.map(e => <EventCard key={e.id} event={e} view={view} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={filters.page === 1} onClick={() => setPage((filters.page || 1) - 1)}>←</Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={filters.page === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className="w-9"
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={filters.page === totalPages} onClick={() => setPage((filters.page || 1) + 1)}>→</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border p-6 overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-lg font-bold">Filters</h2>
              <button onClick={() => setMobileFilters(false)}><X className="h-5 w-5" /></button>
            </div>
            <FilterSidebar {...filterProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
