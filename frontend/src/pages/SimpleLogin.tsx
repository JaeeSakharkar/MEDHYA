import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookOpen } from 'lucide-react';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && email.includes('@')) {
      // Simulate login by setting localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Reload the page to trigger auth context update
      window.location.reload();
    } else {
      alert('Please enter a valid email address');
    }
  };

  const handleQuickLogin = (userType: string) => {
    const quickEmail = userType === 'admin' ? 'admin@quizmaster.com' : 'user@quizmaster.com';
    setEmail(quickEmail);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', quickEmail);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to QuizMaster V2</CardTitle>
          <CardDescription>
            Enter your email to access the quiz platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <Button onClick={handleLogin} className="w-full" size="lg">
            Login
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or try demo accounts
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleQuickLogin('admin')}
              className="text-sm"
            >
              Demo Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickLogin('user')}
              className="text-sm"
            >
              Demo User
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>This is a demo app with localStorage data storage.</p>
            <p>No real authentication required.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLogin;