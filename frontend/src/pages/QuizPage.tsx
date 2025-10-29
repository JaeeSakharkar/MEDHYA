import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetchQuestions, fetchQuizById, submitScore, Question, Quiz } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    if (!id || !token) return;
    
    try {
      setLoading(true);
      const [quizData, questionsData] = await Promise.all([
        fetchQuizById(Number(id), token),
        fetchQuestions(Number(id), token),
      ]);
      
      if (!quizData) {
        toast({
          title: "Error",
          description: "Quiz not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setQuiz(quizData);
      setQuestions(questionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!token) return;

    try {
      setSubmitting(true);
      // Simple scoring: assume first option is correct for demo
      const calculatedScore = Object.values(answers).filter((ans, idx) => 
        ans === questions[idx]?.options?.[0]
      ).length;
      
      setScore(calculatedScore);
      
      await submitScore({
        quizId: Number(id),
        score: calculatedScore,
        totalQuestions: questions.length,
      }, token);
      
      setSubmitted(true);
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${calculatedScore} out of ${questions.length}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="glass-card p-8 rounded-2xl text-center animate-fade-in">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You scored {score} out of {questions.length}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/scores")} className="gap-2 gradient-primary">
              View All Scores
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-6 animate-fade-in">
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="glass-card p-8 rounded-2xl mb-6">
        <h1 className="text-3xl font-bold mb-2">{quiz?.title}</h1>
        <p className="text-muted-foreground">Answer all questions to complete the quiz</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="glass-card p-6 rounded-2xl animate-slide-up">
            <h3 className="font-semibold text-lg mb-4">
              {index + 1}. {question.question}
            </h3>
            
            {question.options ? (
              <RadioGroup
                value={answers[index]}
                onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
              >
                {question.options.map((option, optIdx) => (
                  <div key={optIdx} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/30 transition-smooth">
                    <RadioGroupItem value={option} id={`q${index}-opt${optIdx}`} />
                    <Label htmlFor={`q${index}-opt${optIdx}`} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-muted/30 border border-border focus:border-primary outline-none transition-smooth"
                placeholder="Type your answer..."
                value={answers[index] || ""}
                onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          size="lg"
          className="gap-2 gradient-primary hover:opacity-90"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Submit Quiz
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
