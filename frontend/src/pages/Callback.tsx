import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Callback = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Callback URL:', window.location.href);
        
        // First check for implicit flow tokens in hash (preferred)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const idToken = hashParams.get('id_token');
        const hashError = hashParams.get('error');
        
        // Check for errors in hash
        if (hashError) {
          console.error('Cognito error in hash:', hashError, hashParams.get('error_description'));
          navigate('/login', { replace: true });
          return;
        }
        
        if (idToken) {
          console.log('ID token found in hash (implicit flow)');
          
          try {
            // Validate token format
            if (idToken.split('.').length !== 3) {
              throw new Error('Invalid JWT token format');
            }

            setAuthToken(idToken);
            
            // Decode token to get user info for redirect
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            const isAdmin = payload['cognito:groups']?.includes('admin') || false;
            
            console.log('Login successful, user info:', { 
              email: payload.email, 
              groups: payload['cognito:groups'],
              isAdmin 
            });
            
            // Redirect based on role
            navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
            return;
          } catch (tokenError) {
            console.error('Token processing error:', tokenError);
            navigate('/login', { replace: true });
            return;
          }
        }

        // Fallback: Check for authorization code flow
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const urlError = urlParams.get('error');
        
        // Check for errors in URL params
        if (urlError) {
          console.error('Cognito error in URL:', urlError, urlParams.get('error_description'));
          navigate('/login', { replace: true });
          return;
        }

        if (code) {
          console.log('Authorization code received, exchanging for tokens...');
          
          try {
            // Exchange code for tokens via backend
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/exchange-code`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: code,
                redirect_uri: window.location.origin + '/callback'
              })
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Token exchange failed:', errorData);
              throw new Error(`Token exchange failed: ${errorData.error}`);
            }

            const tokenData = await response.json();
            const exchangedIdToken = tokenData.id_token;

            if (!exchangedIdToken) {
              throw new Error('No ID token received from exchange');
            }

            setAuthToken(exchangedIdToken);
            
            // Decode token to get user info for redirect
            const payload = JSON.parse(atob(exchangedIdToken.split('.')[1]));
            const isAdmin = payload['cognito:groups']?.includes('admin') || false;
            
            console.log('Code exchange successful, redirecting...', { isAdmin });
            
            // Redirect based on role
            navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
            return;

          } catch (exchangeError) {
            console.error('Token exchange error:', exchangeError);
            navigate('/login', { replace: true });
            return;
          }
        }

        // No code or token found
        console.error('No authorization code or token found in callback URL');
        console.log('Hash:', hash);
        console.log('Search params:', window.location.search);
        navigate('/login', { replace: true });

      } catch (error) {
        console.error('Callback processing error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return <LoadingSpinner />;
};

export default Callback;
