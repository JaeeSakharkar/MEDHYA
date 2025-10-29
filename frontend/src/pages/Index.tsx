import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Trophy, Users, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect if already logged in
    if (user) {
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow mb-6">
            <GraduationCap className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            QuizLearn Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master your subjects through interactive quizzes and organized learning paths. 
            Track your progress and compete with peers.
          </p>
          <Button 
            size="lg" 
            className="h-14 px-8 text-lg font-semibold"
            onClick={() => navigate('/login')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Engage with carefully crafted quizzes designed to test and enhance your knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your performance with detailed scores and analytics across all subjects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>
                Compete with other learners and see how you rank on the platform leaderboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Ready to Start Learning?</CardTitle>
            <CardDescription className="text-lg">
              Sign in with AWS Cognito to access your personalized dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              size="lg" 
              variant="default"
              className="h-12 px-8"
              onClick={() => navigate('/login')}
            >
              Sign In Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 QuizLearn Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
