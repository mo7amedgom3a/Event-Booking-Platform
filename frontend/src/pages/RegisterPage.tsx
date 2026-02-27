import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/common/Loading';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword, validateName } from '@/utils/validators';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const nameErr = validateName(name); if (nameErr) errs.name = nameErr;
    const emailErr = validateEmail(email); if (emailErr) errs.email = emailErr;
    const pwErr = validatePassword(password); if (pwErr) errs.password = pwErr;
    if (password !== confirmPw) errs.confirmPw = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register({ name, email, password, role });
      toast({ title: 'Account created! Welcome aboard 🎉' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 gradient-mesh">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-muted-foreground text-sm mb-6">Join EventHub today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => { setName(e.target.value); setErrors({}); }} placeholder="Alice Johnson" className="bg-surface mt-1" />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} placeholder="alice@example.com" className="bg-surface mt-1" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative mt-1">
              <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }} placeholder="Min 8 chars, 1 uppercase, 1 number" className="bg-surface pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setErrors({}); }} placeholder="••••••••" className="bg-surface mt-1" />
            {errors.confirmPw && <p className="text-destructive text-xs mt-1">{errors.confirmPw}</p>}
          </div>
          <div>
            <Label>I want to</Label>
            <Select value={role} onValueChange={(v: 'user' | 'organizer') => setRole(v)}>
              <SelectTrigger className="bg-surface mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Attend Events</SelectItem>
                <SelectItem value="organizer">Organize Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
