import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { LoginForm } from '@/components/auth/LoginForm';
import { FileText } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const { currentUser, t } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.profileCompleted) {
        navigate({ to: '/dashboard' });
      } else {
        navigate({ to: '/setup-profile' });
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('appTitle')}</h1>
              <p className="text-xs opacity-70">{t('appTagline')}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <p className="text-xs opacity-70">{t('languageSelectionHint')}</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full">
          <LoginForm
            onLoginSuccess={(requiresProfileSetup) => {
              if (requiresProfileSetup) {
                navigate({ to: '/setup-profile' });
              } else {
                navigate({ to: '/dashboard' });
              }
            }}
          />
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
