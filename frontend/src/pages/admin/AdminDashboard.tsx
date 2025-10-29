import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { localApi } from '@/services/localApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Users, BookOpen, Trophy, TrendingUp, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data for stats using localStorage
        const [quizzes, users, scores] = await Promise.all([
          localApi.quizzes.getAll(),
          localApi.users.getAll(),
          localApi.scores.getAll()
        ]);
        
        setStats({
          totalQuizzes: Array.isArray(quizzes) ? quizzes.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalAttempts: Array.isArray(scores) ? scores.length : 0,
          avgScore: Array.isArray(scores) && scores.length > 0
            ? Math.round(scores.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / scores.length)
            : 0
        });
      } catch (err: any) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const exportData = () => {
    try {
      const data = {
        quizzes: JSON.parse(localStorage.getItem('quizmaster_quizzes') || '[]'),
        questions: JSON.parse(localStorage.getItem('quizmaster_questions') || '[]'),
        scores: JSON.parse(localStorage.getItem('quizmaster_scores') || '[]'),
        users: JSON.parse(localStorage.getItem('quizmaster_users') || '[]'),
        exportDate: new Date().toISOString(),
        version: '2.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quizmaster-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: 'Success', description: 'Data exported successfully!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to export data' });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.quizzes || !Array.isArray(data.quizzes)) {
          throw new Error('Invalid data format');
        }
        
        // Import data to localStorage
        localStorage.setItem('quizmaster_quizzes', JSON.stringify(data.quizzes || []));
        localStorage.setItem('quizmaster_questions', JSON.stringify(data.questions || []));
        localStorage.setItem('quizmaster_scores', JSON.stringify(data.scores || []));
        localStorage.setItem('quizmaster_users', JSON.stringify(data.users || []));
        
        toast({ title: 'Success', description: 'Data imported successfully!' });
        
        // Refresh the page to show new data
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to import data: Invalid file format' });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">Manage your quiz platform</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={exportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalQuizzes || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Active quizzes</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <Trophy className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalAttempts || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Quiz attempts</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.avgScore || 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">Platform average</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
