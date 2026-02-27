import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CalendarCheck, Ticket, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventCard from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/common/Loading';
import { eventService, Event, Category } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    Promise.all([
      eventService.getEvents({ sort: 'popular', limit: 6 }),
      eventService.getCategories(),
    ]).then(([res, cats]) => {
      setFeatured(res.events);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/events?search=${encodeURIComponent(search)}`);
  };

  const steps = [
    { icon: Search, title: 'Browse', desc: 'Explore events across categories, cities, and dates.' },
    { icon: Ticket, title: 'Book', desc: 'Reserve your seats in seconds with a seamless checkout.' },
    { icon: PartyPopper, title: 'Attend', desc: 'Show up and enjoy unforgettable experiences.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-mesh relative overflow-hidden">
        <div className="container py-24 md:py-36 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          >
            Discover Events<br />
            <span className="text-primary">That Move You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            From tech conferences to jazz nights — find, book, and experience extraordinary moments.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex max-w-xl mx-auto gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, categories, cities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-surface border-border h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12">Search</Button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-3 mt-6"
          >
            <Link to="/events"><Button variant="outline" size="lg">Browse Events</Button></Link>
            {(!isAuthenticated || user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to={isAuthenticated ? '/events/create' : '/register'}>
                <Button variant="ghost" size="lg">Host an Event <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Explore Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.id}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-surface hover:border-primary/50 hover:bg-primary/10 transition-all text-sm font-medium"
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="container py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16">
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-8 md:p-12 text-center">
          {isAuthenticated && (user?.role === 'organizer' || user?.role === 'admin') ? (
            <>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Ready to Host?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your next event and reach thousands of attendees.</p>
              <Link to="/events/create"><Button size="lg">Create Event</Button></Link>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Join the Community</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Sign up to book events, save favorites, and never miss out.</p>
              <Link to="/register"><Button size="lg">Get Started Free</Button></Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
