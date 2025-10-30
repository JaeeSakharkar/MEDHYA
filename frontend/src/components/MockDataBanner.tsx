import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const MockDataBanner = () => {
  // Only show in production when using mock data
  const isUsingMockData = import.meta.env.PROD && 
    (import.meta.env.VITE_API_BASE_URL?.includes('your-actual-backend-url-here') || 
     import.meta.env.VITE_API_BASE_URL?.includes('execute-api'));

  if (!isUsingMockData) return null;

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> MEDHYA is currently displaying sample medical education content. 
        The backend deployment is in progress. All quiz functionality is available for demonstration.
      </AlertDescription>
    </Alert>
  );
};