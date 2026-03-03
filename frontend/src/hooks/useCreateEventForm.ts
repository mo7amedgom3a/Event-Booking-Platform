import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreateEventForm = (id?: string) => {
  const isEdit = !!id;
  const { user } = useAuth();
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

  const setFormField = (key: string, value: any) => {
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

  return {
    form,
    errors,
    loading,
    loadingEvent,
    isEdit,
    setFormField,
    handleSubmit
  };
};
