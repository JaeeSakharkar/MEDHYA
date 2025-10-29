import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Trophy, Settings } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            QuizMaster V2
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern quiz platform built with React, TypeScript, and localStorage. 
            Create, manage, and take quizzes with a beautiful, responsive interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" className="px-8">
                <Settings className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
            <Link to="/admin/quizzes">
              <Button variant="outline" size="lg" className="px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Manage Quizzes
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Quiz Management</CardTitle>
              <CardDescription>
                Create, edit, and organize quizzes with an intuitive interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/quizzes">
                <Button variant="outline" className="w-full">
                  Manage Quizzes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>User Dashboard</CardTitle>
              <CardDescription>
                Track user progress and manage quiz statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>LocalStorage Data</CardTitle>
              <CardDescription>
                All data stored locally in your browser for instant access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Data Persisted
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🚀 Demo Mode Active
          </h3>
          <p className="text-blue-700">
            This is a demo version with mock authentication and localStorage data storage. 
            All features are fully functional for testing and demonstration purposes.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>Built with React, TypeScript, Vite, and Tailwind CSS</p>
          <p className="mt-2">Deployed on AWS Amplify</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;