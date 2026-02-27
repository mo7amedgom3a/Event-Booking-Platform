import { Link } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

const Footer = () => (
  <footer className="border-t border-border bg-surface py-12">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-display text-lg font-bold mb-2">{APP_NAME}</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Discover and book extraordinary events. From tech conferences to jazz nights, find experiences that move you.
          </p>
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm mb-3">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/events" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Browse Events</Link>
            <Link to="/events?category=c1" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Technology</Link>
            <Link to="/events?category=c2" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Music</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body font-semibold text-sm mb-3">Account</h4>
          <div className="flex flex-col gap-2">
            <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Log In</Link>
            <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
