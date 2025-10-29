import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthTest = () => {
  const { user, token, isAdmin, login, logout } = useAuth();

  const testUrls = {
    implicit: `https://medhya.auth.us-east-1.amazoncognito.com/login?client_id=6npa9g9it0o66diikabm29j9je&response_type=token&scope=email+openid+phone&redirect_uri=${encodeURIComponent('http://localhost:8081/callback')}`,
    code: `https://medhya.auth.us-east-1.amazoncognito.com/login?client_id=6npa9g9it0o66diikabm29j9je&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent('http://localhost:8081/callback')}`
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
            <CardDescription>Debug Cognito authentication flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current Auth State:</h3>
              <div className="bg-gray-100 p-4 rounded text-sm">
                <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
                <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>User Groups:</strong> {user?.['cognito:groups']?.join(', ') || 'None'}</p>
                <p><strong>Token Present:</strong> {token ? 'Yes' : 'No'}</p>
                {token && (
                  <p><strong>Token Preview:</strong> {token.substring(0, 50)}...</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Actions:</h3>
              <div className="flex gap-2">
                <Button onClick={login}>Login (Current Method)</Button>
                <Button onClick={logout} variant="outline">Logout</Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test URLs:</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Implicit Flow (recommended):</p>
                  <a 
                    href={testUrls.implicit}
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {testUrls.implicit}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium">Authorization Code Flow:</p>
                  <a 
                    href={testUrls.code}
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {testUrls.code}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Current URL Info:</h3>
              <div className="bg-gray-100 p-4 rounded text-sm">
                <p><strong>Current URL:</strong> {window.location.href}</p>
                <p><strong>Hash:</strong> {window.location.hash || 'None'}</p>
                <p><strong>Search:</strong> {window.location.search || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;