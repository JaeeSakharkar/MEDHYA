import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { scoresApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

const Scores = () => {
  const { token } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (!token) return;
      
      try {
        const data = await scoresApi.getMy(token);
        setScores(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + (s.score || 0), 0) / scores.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Scores</h1>
          <p className="text-muted-foreground text-lg">Track your quiz performance over time</p>
        </div>

        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scores.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Quiz attempts completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {scores.length > 0 ? Math.max(...scores.map(s => s.score || 0)) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Personal best</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Attempts</CardTitle>
            <CardDescription>Complete history of your quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No quiz attempts yet. Start a quiz from your dashboard!
              </p>
            ) : (
              <div className="space-y-3">
                {scores.map((score, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{score.quizTitle || 'Quiz'}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(score.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${score.score >= 70 ? 'text-success' : 'text-destructive'}`}>
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
  );
};

export default Scores;
