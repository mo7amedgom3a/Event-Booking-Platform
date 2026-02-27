import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/common/Loading';
import { eventService, MOCK_CATEGORIES } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CreateEventPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(isEdit);

  const [form, setForm] = useState({
    title: '', description: '', category: 'c1', tags: '',
    date: '', endDate: '', city: '', venue: '', address: '',
    price: 0, totalSeats: 100, image: '',
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
        location: { city: form.city, venue: form.venue, address: form.address },
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

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );

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
                {MOCK_CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
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
              <Input type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} className="bg-surface" />
            </Field>
            <Field label="End" error={errors.endDate}>
              <Input type="datetime-local" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="bg-surface" />
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
