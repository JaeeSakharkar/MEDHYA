import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Quiz } from "@/services/api";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6 rounded-2xl hover-lift animate-fade-in group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-smooth">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{quiz.title}</h3>
            <Badge variant="secondary" className="mt-1">
              {quiz.subject}
            </Badge>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-6">
        Test your knowledge with this comprehensive quiz covering essential topics.
      </p>
      
      <Button
        onClick={() => navigate(`/quiz/${quiz.id}`)}
        className="w-full gap-2 gradient-primary hover:opacity-90 transition-smooth"
      >
        Take Quiz
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
