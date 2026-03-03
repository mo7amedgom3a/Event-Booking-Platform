import { Label } from '@/components/ui/label';

export const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <Label>{label}</Label>
    <div className="mt-1">{children}</div>
    {error && <p className="text-destructive text-xs mt-1">{error}</p>}
  </div>
);
