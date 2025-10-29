import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quizzesApi, scoresApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BookOpen, Trophy, Play, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [recentScores, setRecentScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        const [quizzesData, scoresData] = await Promise.all([
          quizzesApi.getAll(token),
          scoresApi.getMy(token)
        ]);
        setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
        setRecentScores(Array.isArray(scoresData) ? scoresData.slice(0, 5) : []); // Show last 5 scores
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground text-lg">Ready to continue your learning journey?</p>
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
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Available to attempt</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attempts</CardTitle>
              <Play className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentScores.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Quiz attempts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {recentScores.length > 0 
                  ? Math.round(recentScores.reduce((acc, s) => acc + (s.score || 0), 0) / recentScores.length)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Available Quizzes
              </CardTitle>
              <CardDescription>Choose a quiz to start learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizzes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No quizzes available yet</p>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    </div>
                    <Link to={`/quiz/${quiz.id}`}>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Recent Scores
              </CardTitle>
              <CardDescription>Your latest quiz attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentScores.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No attempts yet. Start a quiz!</p>
              ) : (
                recentScores.map((score, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex-1">
                      <h3 className="font-semibold">{score.quizTitle}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(score.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-2xl font-bold ${score.score >= 70 ? 'text-success' : 'text-destructive'}`}>
                      {score.score}%
                    </div>
                  </div>
                ))
              )}
              <Link to="/scores" className="block">
                <Button variant="outline" className="w-full">View All Scores</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
