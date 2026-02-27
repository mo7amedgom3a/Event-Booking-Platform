import { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/common/Loading';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email, avatar });
      toast({ title: 'Profile updated!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  if (!user) return null;

  const roleColors: Record<string, string> = {
    user: 'bg-primary/20 text-primary',
    organizer: 'bg-accent/20 text-accent-foreground',
    admin: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="container py-8 max-w-2xl">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-surface flex items-center justify-center border-2 border-border">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleColors[user.role]}`}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-surface mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-surface mt-1" />
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input value={avatar} onChange={e => setAvatar(e.target.value)} className="bg-surface mt-1" placeholder="https://..." />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Spinner className="h-4 w-4" /> : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
