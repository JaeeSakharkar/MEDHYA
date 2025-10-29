import { useEffect, useState } from "react";
import { Trophy, Calendar, Target, ArrowUpDown, Loader2 } from "lucide-react";
import { fetchScores, fetchQuizzes, Score, Quiz } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SortField = 'date' | 'score' | 'quiz';
type SortOrder = 'asc' | 'desc';

export default function Scores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [scoresData, quizzesData] = await Promise.all([
        fetchScores(token),
        fetchQuizzes(token),
      ]);
      setScores(scoresData);
      setQuizzes(quizzesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getQuizTitle = (quizId: number) => {
    return quizzes.find(q => q.id === quizId)?.title || "Unknown Quiz";
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedScores = [...scores].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'date':
        comparison = new Date(a.attemptDate).getTime() - new Date(b.attemptDate).getTime();
        break;
      case 'score':
        comparison = (a.score / a.totalQuestions) - (b.score / b.totalQuestions);
        break;
      case 'quiz':
        comparison = getQuizTitle(a.quizId).localeCompare(getQuizTitle(b.quizId));
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-accent";
    return "text-destructive";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Your Scores</h1>
        </div>
        <p className="text-muted-foreground">
          Track your quiz performance and progress over time
        </p>
      </div>

      {scores.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No scores yet</h3>
          <p className="text-muted-foreground">Take a quiz to see your scores here</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex gap-2 flex-wrap">
            <Button
              variant={sortField === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('date')}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Date
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Button
              variant={sortField === 'score' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('score')}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              Score
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Button
              variant={sortField === 'quiz' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('quiz')}
              className="gap-2"
            >
              Quiz
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            {sortedScores.map((score, index) => {
              const percentage = ((score.score / score.totalQuestions) * 100).toFixed(0);
              return (
                <div
                  key={index}
                  className="p-6 hover:bg-muted/20 transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {getQuizTitle(score.quizId)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(score.attemptDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(score.score, score.totalQuestions)}`}>
                          {score.score}/{score.totalQuestions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {percentage}% correct
                        </div>
                      </div>
                      <Badge
                        variant={
                          Number(percentage) >= 80
                            ? "default"
                            : Number(percentage) >= 60
                            ? "secondary"
                            : "destructive"
                        }
                        className="px-3 py-1"
                      >
                        {Number(percentage) >= 80 ? "Excellent" : Number(percentage) >= 60 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
