import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { backendApi } from '@/services/backendApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuizAttempt = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        const [quizData, questionsData] = await Promise.all([
          backendApi.quizzes.getById(id),
          backendApi.questions.getByQuiz(id)
        ]);
        setQuiz(quizData);
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
        
        // Debug logging
        console.log('Quiz data:', quizData);
        console.log('Questions data:', questionsData);
        
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message || 'Failed to load quiz'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, toast]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setShowResults(true);

    // Submit score to backend
    if (id) {
      try {
        await backendApi.scores.submit({
          quizId: id,
          score: correct,
          totalQuestions: questions.length
        });
      } catch (err: any) {
        console.error('Failed to submit score:', err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The quiz you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
              <p className="text-muted-foreground mb-4">
                This quiz is being prepared. Questions will be added soon by the instructor.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <p><strong>Subject:</strong> {quiz.subject}</p>
                <p><strong>Description:</strong> {quiz.description}</p>
              </div>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${score >= 70 ? 'text-success' : 'text-destructive'}`}>
                  {score}%
                </div>
                <p className="text-muted-foreground">
                  You got {questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {questions.length} correct
                </p>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  return (
                    <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-1">{idx + 1}. {q.question}</p>
                          <p className="text-sm text-muted-foreground">
                            Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>{answers[q.id]}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-success">Correct answer: {q.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    idx === currentQuestion ? 'bg-primary' : answers[questions[idx].id] ? 'bg-success' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options?.map((option: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted transition-colors">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="flex-1"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className="flex-1"
                  >
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QuizAttempt;
