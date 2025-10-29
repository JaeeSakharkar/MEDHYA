import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const { user, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Welcome to QuizLearn</CardTitle>
            <CardDescription className="text-base mt-2">
              Your interactive learning platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={login} 
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Sign In with AWS Cognito
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You'll be redirected to AWS Cognito Hosted UI for secure authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
