/**
 * LoginForm — authenticates vendor using Unique ID via real API
 */
import { useState, type FormEvent } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (requiresProfileSetup: boolean) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login, authLoading, t } = useStore();
  const [uniqueId, setUniqueId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!uniqueId.trim()) {
      setError(t('loginErrorFillFields'));
      return;
    }
    const result = await login(uniqueId.trim());
    if (result.success) {
      onLoginSuccess(!!result.requiresProfileSetup);
    } else {
      setError(result.error || t('loginErrorCredentials'));
    }
  };

  return (
    <div className="auth-card w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{t('welcomeBackTitle')}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{t('welcomeBackSubtitle')}</p>
        </div>

        {error && (
          <div className="toast-animate flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg p-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input type="text" name="username" autoComplete="username" className="hidden" tabIndex={-1} />
          <div className="space-y-2">
            <Label htmlFor="uniqueId" className="text-sm font-medium">{t('uniqueVendorId')}</Label>
            <Input
              id="uniqueId"
              name="uniqueId"
              placeholder="VND-XXXXXX"
              value={uniqueId}
              onChange={e => setUniqueId(e.target.value)}
              className="h-11 uppercase tracking-wider font-mono"
              autoComplete="off"
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={authLoading}>
            {authLoading ? t('loggingIn') : t('loginButton')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have a Unique ID? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
