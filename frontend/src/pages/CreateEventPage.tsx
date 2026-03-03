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

// Fix marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <Label>{label}</Label>
    <div className="mt-1">{children}</div>
    {error && <p className="text-destructive text-xs mt-1">{error}</p>}
  </div>
);

const LocationPicker = ({ position, setPosition }: { position: {lat: number, lng: number}, setPosition: (pos: {lat: number, lng: number}) => void }) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position.lat && position.lng ? <Marker position={[position.lat, position.lng]} /> : null;
};

const DateTimePickerField = ({ value, onChange, placeholder = "Schedule appointment" }: { value: string, onChange: (v: string) => void, placeholder?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const idPrefix = useId();
  
  const getTimeString = (d: Date) => {
    if (isNaN(d.getTime())) return "12:00 AM";
    const hours = d.getHours();
    const mins = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12 < 10 && ampm === 'PM' ? '0'+h12 : (h12 < 10 && h12 !== 0 ? h12.toString() : h12.toString())}:${mins === 0 ? '00' : '30'} ${ampm}`;
  };

  let initialDate = "";
  let initialTime = "12:00 AM"; 
  if (value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      initialDate = d.toISOString().split('T')[0];
      initialTime = getTimeString(d);
    }
  }

  const [tempDate, setTempDate] = useState(initialDate);
  const [tempTime, setTempTime] = useState(initialTime);

  const times = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
  ];

  const timeToId = (t: string) => t.toLowerCase().replace(/[: ]/g, '-');

  const handleOpen = () => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setTempDate(d.toISOString().split('T')[0]);
        setTempTime(getTimeString(d));
      }
    } else {
      setTempDate("");
      setTempTime("12:00 AM");
    }
    setIsOpen(true);
  };

  const onSave = () => {
    if (tempDate && tempTime) {
      const match = tempTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const formattedDate = `${tempDate}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
        onChange(formattedDate);
      }
    } else if (tempDate) {
      onChange(`${tempDate}T00:00:00`);
    } else {
      onChange("");
    }
    setIsOpen(false);
  };

  const displayValue = value ? new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : placeholder;

  return (
    <>
      <button 
        type="button" 
        onClick={handleOpen}
        className="inline-flex w-full items-center justify-center text-foreground bg-secondary box-border border border-border hover:bg-secondary/80 focus:ring-4 focus:ring-primary/20 shadow-sm font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none"
      >
         <svg className="w-4 h-4 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
         {displayValue}
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm">
          <div className="relative p-4 w-full max-w-[23rem] max-h-full">
            <div className="relative bg-background rounded-md shadow-lg border border-border">
              <div className="flex items-center justify-between p-4 border-b rounded-t border-border">
                  <h3 className="font-medium text-foreground">
                      Schedule appointment
                  </h3>
                 <button type="button" onClick={() => setIsOpen(false)} className="text-foreground bg-transparent hover:bg-secondary hover:text-foreground rounded-md text-sm w-9 h-9 ms-auto inline-flex justify-center items-center">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                      <span className="sr-only">Close modal</span>
                  </button>
              </div>
              <div className="p-4 pt-0">
                  <div className="mx-auto flex justify-center my-5">
                    <Input 
                      type="date" 
                      value={tempDate} 
                      onChange={(e) => setTempDate(e.target.value)} 
                      className="w-full bg-secondary border-border"
                    />
                  </div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                  Pick your time
                  </label>
                  <ul className="grid w-full grid-cols-3 gap-2 mb-5">
                      {times.map((t) => (
                        <li key={t}>
                            <input 
                              type="radio" 
                              id={`time-${idPrefix}-${timeToId(t)}`} 
                              className="hidden peer" 
                              name={`timetable-${idPrefix}`}
                              checked={tempTime === t}
                              onChange={() => setTempTime(t)}
                            />
                            <label htmlFor={`time-${idPrefix}-${timeToId(t)}`}
                            className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-background border rounded-md cursor-pointer text-primary border-primary peer-checked:border-primary peer-checked:bg-primary hover:text-primary-foreground peer-checked:text-primary-foreground hover:bg-primary/90">
                            {t}
                            </label>
                        </li>
                      ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={onSave} className="text-primary-foreground bg-primary border border-transparent hover:bg-primary/90 shadow-sm font-medium rounded-md text-sm px-4 py-2.5 focus:outline-none">Save</button>
                      <button type="button" onClick={() => setIsOpen(false)} className="text-foreground bg-secondary border border-border hover:bg-secondary/80 shadow-sm font-medium rounded-md text-sm px-4 py-2.5 focus:outline-none">Discard</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CreateEventPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const { categories } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(isEdit);

  const [form, setForm] = useState({
    title: '', description: '', category: 'c1', tags: '',
    date: '', endDate: '', city: '', venue: '', address: '',
    price: 0, totalSeats: 100, image: '', lat: 52.3742, lng: 4.9123 // default Amsterdam
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      eventService.getEvent(id).then(e => {
        if (e) {
          setForm({
            title: e.title, description: e.description, category: e.category,
            tags: e.tags.join(', '), date: e.date.slice(0, 16), endDate: e.endDate.slice(0, 16),
            city: e.location.city, venue: e.location.venue, address: e.location.address,
            price: e.price, totalSeats: e.totalSeats, image: e.image,
            lat: e.location.lat || 52.3742, lng: e.location.lng || 4.9123
          });
        }
        setLoadingEvent(false);
      });
    }
  }, [id, isEdit]);

  const set = (key: string, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (form.description.length < 50) errs.description = 'Min 50 characters';
    if (!form.date) errs.date = 'Required';
    if (!form.endDate) errs.endDate = 'Required';
    if (form.date && form.endDate && new Date(form.endDate) <= new Date(form.date)) errs.endDate = 'Must be after start';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.venue.trim()) errs.venue = 'Required';
    if (form.totalSeats < 1) errs.totalSeats = 'Must be at least 1';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        date: new Date(form.date).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        location: { city: form.city, venue: form.venue, address: form.address, lat: form.lat, lng: form.lng },
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        image: form.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        organizerId: user!.id,
        organizerName: user!.name,
      };

      if (isEdit && id) {
        await eventService.updateEvent(id, data);
        toast({ title: 'Event updated!' });
        navigate(`/events/${id}`);
      } else {
        const created = await eventService.createEvent(data as any);
        toast({ title: 'Event published successfully!' });
        navigate(`/events/${created.id}`);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  if (loadingEvent) return <div className="container py-16"><Spinner className="h-8 w-8 mx-auto" /></div>;

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">{isEdit ? 'Edit Event' : 'Create Event'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Basic Info</h2>
          <Field label="Event Title" error={errors.title}>
            <Input value={form.title} onChange={e => set('title', e.target.value)} className="bg-surface" placeholder="React Summit 2025" />
          </Field>
          <Field label="Description" error={errors.description}>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} className="bg-surface min-h-[120px]" placeholder="Describe your event (min 50 chars)..." />
          </Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger className="bg-surface"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tags (comma-separated)">
            <Input value={form.tags} onChange={e => set('tags', e.target.value)} className="bg-surface" placeholder="react, javascript, frontend" />
          </Field>
        </section>

        {/* Date & Time */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Date & Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start" error={errors.date}>
              <DateTimePickerField value={form.date} onChange={v => set('date', v)} placeholder="Set start date & time" />
            </Field>
            <Field label="End" error={errors.endDate}>
              <DateTimePickerField value={form.endDate} onChange={v => set('endDate', v)} placeholder="Set end date & time" />
            </Field>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Location</h2>
          <Field label="City" error={errors.city}>
            <Input value={form.city} onChange={e => set('city', e.target.value)} className="bg-surface" placeholder="Amsterdam" />
          </Field>
          <Field label="Venue" error={errors.venue}>
            <Input value={form.venue} onChange={e => set('venue', e.target.value)} className="bg-surface" placeholder="NEMO Science Museum" />
          </Field>
          <Field label="Address">
            <Input value={form.address} onChange={e => set('address', e.target.value)} className="bg-surface" placeholder="Oosterdok 2, Amsterdam" />
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
                <LocationPicker position={{lat: form.lat, lng: form.lng}} setPosition={(pos) => setForm(f => ({...f, lat: pos.lat, lng: pos.lng}))} />
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
              <Input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} className="bg-surface" />
            </Field>
            <Field label="Total Seats" error={errors.totalSeats}>
              <Input type="number" min="1" value={form.totalSeats} onChange={e => set('totalSeats', e.target.value)} className="bg-surface" />
            </Field>
          </div>
        </section>

        {/* Image */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Event Image</h2>
          <Field label="Image URL">
            <Input value={form.image} onChange={e => set('image', e.target.value)} className="bg-surface" placeholder="https://images.unsplash.com/..." />
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
