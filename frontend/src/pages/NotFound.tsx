import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
    <h1 className="font-display text-8xl font-black text-primary mb-4">404</h1>
    <h2 className="font-display text-2xl font-bold mb-2">Page Not Found</h2>
    <p className="text-muted-foreground mb-6 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/">
      <Button size="lg">Back to Home</Button>
    </Link>
  </div>
);

export default NotFound;
