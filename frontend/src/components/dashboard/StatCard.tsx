import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
