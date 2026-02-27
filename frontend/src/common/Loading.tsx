import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'overlay';
  className?: string;
}

export const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn('h-5 w-5 animate-spin text-primary', className)} />
);

export const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn('shimmer rounded-lg', className)} />
);

export const EventCardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card overflow-hidden">
    <SkeletonBlock className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBlock className="h-4 w-20" />
      <SkeletonBlock className="h-6 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
      <div className="flex justify-between">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
  </div>
);

const Loading = ({ type = 'spinner', className }: LoadingProps) => {
  if (type === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (type === 'skeleton') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Spinner className="h-8 w-8" />
    </div>
  );
};

export default Loading;
