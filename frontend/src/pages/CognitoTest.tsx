import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';

const CognitoTest = () => {
  const { user, token, isAdmin, login, logout } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const COGNITO_DOMAIN = 'medhya.auth.us-east-1.amazoncognito.com';
  const CLIENT_ID = '6npa9g9it0o66diikabm29j9je';
  const REDIRECT_URI = window.location.origin + '/callback';

  const authUrl = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  const checkToken = () => {
    const storedToken = localStorage.getItem('idToken');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setDebugInfo({
          token: storedToken,
          payload,
          isExpired: payload.exp * 1000 < Date.now(),
          expiresAt: new Date(payload.exp * 1000).toLocaleString()
        });
      } catch (error) {
        setDebugInfo({ error: 'Invalid token format' });
      }
    } else {
      setDebugInfo({ message: 'No token found in localStorage' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAuth = () => {
    localStorage.removeItem('idToken');
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔐 Cognito Authentication Test</CardTitle>
            <CardDescription>
              Debug and test your Cognito authentication setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Auth State */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Authentication Status</div>
                <Badge variant={user ? "default" : "secondary"} className="mt-1">
                  {user ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">User Role</div>
                <Badge variant={isAdmin ? "default" : "outline"} className="mt-1">
                  {isAdmin ? "Admin" : "User"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Token Status</div>
                <Badge variant={token ? "default" : "secondary"} className="mt-1">
                  {token ? "Present" : "Missing"}
                </Badge>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ User Information</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>User ID:</strong> {user.sub}</div>
                  <div><strong>Groups:</strong> {user['cognito:groups']?.join(', ') || 'None'}</div>
                  <div><strong>Token Expires:</strong> {new Date(user.exp * 1000).toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!user ? (
                <Button onClick={login} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Login with Cognito
                </Button>
              ) : (
                <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Logout
                </Button>
              )}
              
              <Button onClick={checkToken} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Check Token
              </Button>
              
              <Button onClick={clearAuth} variant="destructive" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Clear All Auth Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Cognito Domain:</strong>
                <div className="font-mono bg-gray-100 p-2 rounded mt-1">
                  {COGNITO_DOMAIN}
                </div>
              </div>
              <div>
                <strong>Client ID:</strong>
                <div className="font-mono bg-gray-100 p-2 rounded mt-1">
                  {CLIENT_ID}
                </div>
              </div>
              <div>
                <strong>Redirect URI:</strong>
                <div className="font-mono bg-gray-100 p-2 rounded mt-1">
                  {REDIRECT_URI}
                </div>
              </div>
              <div>
                <strong>Current URL:</strong>
                <div className="font-mono bg-gray-100 p-2 rounded mt-1">
                  {window.location.href}
                </div>
              </div>
            </div>

            <div>
              <strong>Generated Auth URL:</strong>
              <div className="flex items-center gap-2 mt-1">
                <div className="font-mono bg-gray-100 p-2 rounded flex-1 text-xs break-all">
                  {authUrl}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(authUrl)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(authUrl, '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>🐛 Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Test Direct Cognito URL:</strong>
              <p>Click the "Test" button above to open Cognito login in a new tab</p>
            </div>
            <div>
              <strong>2. Check Callback:</strong>
              <p>After login, you should be redirected to /callback with a token in the URL hash</p>
            </div>
            <div>
              <strong>3. Verify Token:</strong>
              <p>Click "Check Token" to see if the token was stored correctly</p>
            </div>
            <div>
              <strong>4. Check Console:</strong>
              <p>Open browser DevTools → Console to see detailed logs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CognitoTest;