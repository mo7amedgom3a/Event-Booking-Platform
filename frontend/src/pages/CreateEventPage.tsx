import { useState, useEffect, useRef, useMemo, useCallback, useId } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/common/Loading';
import { eventService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useCreateEventForm } from '@/hooks/useCreateEventForm';
import { Field } from '@/components/form/Field';
import { LocationPicker } from '@/components/form/LocationPicker';
import { DateTimePickerField } from '@/components/form/DateTimePickerField';

const CreateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useEvents();

  const {
    form,
    errors,
    loading,
    loadingEvent,
    isEdit,
    setFormField,
    handleSubmit
  } = useCreateEventForm(id);

  if (loadingEvent) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">{isEdit ? 'Edit Event' : 'Create Event'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Basic Info</h2>
          <Field label="Event Title" error={errors.title}>
            <Input value={form.title} onChange={e => setFormField('title', e.target.value)} className="bg-surface" placeholder="React Summit 2025" />
          </Field>
          <Field label="Description" error={errors.description}>
            <Textarea value={form.description} onChange={e => setFormField('description', e.target.value)} className="bg-surface min-h-[120px]" placeholder="Describe your event (min 50 chars)..." />
          </Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={v => setFormField('category', v)}>
              <SelectTrigger className="bg-surface"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tags (comma-separated)">
            <Input value={form.tags} onChange={e => setFormField('tags', e.target.value)} className="bg-surface" placeholder="react, javascript, frontend" />
          </Field>
        </section>

        {/* Date & Time */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Date & Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start" error={errors.date}>
              <DateTimePickerField value={form.date} onChange={v => setFormField('date', v)} placeholder="Set start date & time" />
            </Field>
            <Field label="End" error={errors.endDate}>
              <DateTimePickerField value={form.endDate} onChange={v => setFormField('endDate', v)} placeholder="Set end date & time" />
            </Field>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Location</h2>
          <Field label="City" error={errors.city}>
            <Input value={form.city} onChange={e => setFormField('city', e.target.value)} className="bg-surface" placeholder="Amsterdam" />
          </Field>
          <Field label="Venue" error={errors.venue}>
            <Input value={form.venue} onChange={e => setFormField('venue', e.target.value)} className="bg-surface" placeholder="NEMO Science Museum" />
          </Field>
          <Field label="Address">
            <Input value={form.address} onChange={e => setFormField('address', e.target.value)} className="bg-surface" placeholder="Oosterdok 2, Amsterdam" />
          </Field>
          <div>
            <Label>Map Location (Click to adjust)</Label>
            <div className="mt-2 h-[300px] rounded-md overflow-hidden border border-border">
              <MapContainer center={[form.lat, form.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                />
                <LocationPicker position={{lat: form.lat, lng: form.lng}} setPosition={(pos) => setFormField('lat', pos.lat) || setFormField('lng', pos.lng)} />
              </MapContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Lat: {form.lat.toFixed(4)}, Lng: {form.lng.toFixed(4)}</p>
          </div>
        </section>

        {/* Tickets */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price ($)" error={errors.price}>
              <Input type="number" min="0" value={form.price} onChange={e => setFormField('price', e.target.value)} className="bg-surface" />
            </Field>
            <Field label="Total Seats" error={errors.totalSeats}>
              <Input type="number" min="1" value={form.totalSeats} onChange={e => setFormField('totalSeats', e.target.value)} className="bg-surface" />
            </Field>
          </div>
        </section>

        {/* Image */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Event Image</h2>
          <Field label="Image URL">
            <Input value={form.image} onChange={e => setFormField('image', e.target.value)} className="bg-surface" placeholder="https://images.unsplash.com/..." />
          </Field>
          {form.image && (
            <img src={form.image} alt="Preview" className="rounded-lg h-48 w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : isEdit ? 'Save Changes' : 'Publish Event'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
