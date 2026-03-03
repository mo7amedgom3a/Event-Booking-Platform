import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '@/utils/validators';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Welcome back!' });
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    errors,
    setErrors,
    handleSubmit
  };
};

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName) errs.firstName = 'First name is required';
    if (!lastName) errs.lastName = 'Last name is required';
    
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPw) errs.confirmPw = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await register({ firstName, lastName, email, password, role });
      toast({ title: 'Account created successfully!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirmPw, setConfirmPw,
    role, setRole,
    showPw, setShowPw,
    loading, errors, setErrors,
    handleSubmit
  };
};

export const useProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Validation Error', description: 'Name and email are required', variant: 'destructive' });
      return;
    }
    
    setSaving(true);
    try {
      await updateProfile({ name, email, avatar });
      toast({ title: 'Profile updated' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return {
    user,
    name, setName,
    email, setEmail,
    avatar, setAvatar,
    saving,
    handleSave
  };
};
