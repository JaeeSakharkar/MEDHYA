import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi, quizzesApi, usersApi, scoresApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Users, BookOpen, Trophy, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        // Fetch all data for stats
        const [quizzes, users, scores] = await Promise.all([
          quizzesApi.getAll(token),
          usersApi.getAll(token),
          scoresApi.getAll(token)
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
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage your quiz platform</p>
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
