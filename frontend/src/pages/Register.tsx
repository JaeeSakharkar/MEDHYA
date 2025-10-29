import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Register() {
  const { login } = useAuth();

  // For sign-up, Hosted UI login handles both signup & signin flows.
  const handleSignUp = () => {
    // The login() function already redirects to Cognito Hosted UI,
    // which includes both 'sign in' and 'sign up' links/screens.
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-fade-in text-center">
        <h1 className="text-3xl font-bold mb-4">Create Your Account</h1>
        <p className="text-muted-foreground mb-6">
          You’ll be securely redirected to AWS Cognito for sign-up.
        </p>
        <Button
          onClick={handleSignUp}
          className="w-full gradient-primary"
          size="lg"
        >
          Sign Up / Sign In with AWS Cognito
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Already registered? Use the same button to sign in!
        </p>
      </div>
    </div>
  );
}
