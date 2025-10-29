import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          <span className="font-bold text-xl">QuizLearn</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user.email}</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  Admin
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
