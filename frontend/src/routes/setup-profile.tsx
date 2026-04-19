import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { useStore } from '@/lib/store';
import { apiGetMe } from '@/api/services';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText } from 'lucide-react';

export const Route = createFileRoute('/setup-profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { currentUser, setupProfile, authLoading, t } = useStore();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    shopName: '',
    gstNo: '',
    address: '',
    city: '',
    district: '',
    state: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('billcraft_token');
    if (!token) {
      navigate({ to: '/' });
      return;
    }

    apiGetMe()
      .then((user) => {
        if (user.profileCompleted) {
          navigate({ to: '/dashboard' });
          return;
        }

        setForm((prev) => ({
          ...prev,
          name: user.name || '',
          age: user.age || '',
          email: user.email || '',
          mobile: user.mobile || '',
          shopName: user.shopName || '',
          gstNo: user.gstNo || '',
          address: user.address || '',
          city: user.city || '',
          district: user.district || '',
          state: user.state || '',
        }));
      })
      .catch(() => {
        navigate({ to: '/' });
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  useEffect(() => {
    if (currentUser?.profileCompleted) {
      navigate({ to: '/dashboard' });
    }
  }, [currentUser, navigate]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.shopName || !form.gstNo || !form.address || !form.age || !form.email || !form.mobile) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      await setupProfile({
        name: form.name.trim(),
        age: form.age.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        shopName: form.shopName.trim(),
        gstNo: form.gstNo.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
      });
      navigate({ to: '/dashboard' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to save profile.';
      setError(msg);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t('appTitle')}</h1>
            <p className="text-xs opacity-70">{t('appTagline')}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-card rounded-xl border border-border p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">This is a one-time setup after first login.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg p-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Age *</Label>
                <Input type="number" value={form.age} onChange={(e) => updateField('age', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Mobile *</Label>
                <Input value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} maxLength={10} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Shop Name *</Label>
                <Input value={form.shopName} onChange={(e) => updateField('shopName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>GST No. *</Label>
                <Input value={form.gstNo} onChange={(e) => updateField('gstNo', e.target.value.toUpperCase())} className="uppercase" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Address *</Label>
              <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>District</Label>
                <Input value={form.district} onChange={(e) => updateField('district', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-2" disabled={authLoading}>
              {authLoading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Made with <span className="text-destructive">❤</span> by <span className="font-semibold">Shela Gang</span> 🧣
        </p>
      </footer>
    </div>
  );
}
