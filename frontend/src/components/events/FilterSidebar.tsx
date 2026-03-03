import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Category } from '@/services/api';

interface FilterSidebarProps {
  categories: Category[];
  cities: string[];
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  localPrice: number;
  setLocalPrice: (price: number) => void;
  clearFilters: () => void;
}

export const FilterSidebar = ({
  categories,
  cities,
  filters,
  setFilter,
  localPrice,
  setLocalPrice,
  clearFilters
}: FilterSidebarProps) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-body font-semibold text-sm mb-3">Categories</h3>
      <div className="space-y-2">
        {categories.map(cat => (
          <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={filters.category === cat.id}
              onCheckedChange={checked => setFilter('category', checked ? cat.id : undefined)}
            />
            <span>{cat.icon} {cat.name}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-body font-semibold text-sm mb-3">City</h3>
      <Select value={filters.city || 'all'} onValueChange={v => setFilter('city', v === 'all' ? undefined : v)}>
        <SelectTrigger className="bg-surface"><SelectValue placeholder="All Cities" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>

    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-body font-semibold text-sm">Price Range</h3>
        <span className="text-sm font-medium text-primary">
          Up to ${localPrice === 500 ? '500+' : localPrice}
        </span>
      </div>
      <Slider
        key={filters.maxPrice ?? 500}
        value={[localPrice]}
        max={500}
        step={10}
        onValueChange={([v]) => setLocalPrice(v)}
        className="mt-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>$0</span>
        <span>$500+</span>
      </div>
    </div>

    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <Checkbox
        checked={!!filters.freeOnly}
        onCheckedChange={checked => setFilter('freeOnly', checked || undefined)}
      />
      Free Events Only
    </label>

    <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>Clear Filters</Button>
  </div>
);
