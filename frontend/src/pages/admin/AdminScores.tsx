import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { scoresApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminScores = () => {
  const { token } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');

  useEffect(() => {
    const fetchScores = async () => {
      if (!token) return;
      try {
        const data = await scoresApi.getAll(token);
        setScores(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching scores:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  const sortedScores = [...scores].sort((a, b) => {
    if (sortBy === 'highest') {
      return (b.score || 0) - (a.score || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + (s.score || 0), 0) / scores.length)
    : 0;

  const topScore = scores.length > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Scores</h1>
            <p className="text-muted-foreground text-lg">View and analyze all quiz attempts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scores.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All quiz attempts</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Average</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{avgScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Average score</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <Award className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{topScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Best performance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>All quiz attempts from all users</CardDescription>
                </div>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {scores.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No quiz attempts yet</p>
              ) : (
                <div className="space-y-3">
                  {sortedScores.map((score, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{score.userName || score.userEmail || 'Anonymous'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {score.quizTitle || 'Quiz'} • {new Date(score.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${score.score >= 70 ? 'text-success' : 'text-destructive'}`}>
                          {score.score}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {score.score >= 70 ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminScores;
