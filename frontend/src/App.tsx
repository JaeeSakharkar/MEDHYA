import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import QuizAttempt from "./pages/QuizAttempt";
import Scores from "./pages/Scores";
import Chapters from "./pages/Chapters";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminChapters from "./pages/admin/AdminChapters";
import AdminScores from "./pages/admin/AdminScores";
import AdminUsers from "./pages/admin/AdminUsers";
import AuthTest from "./pages/AuthTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizAttempt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scores"
              element={
                <ProtectedRoute>
                  <Scores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chapters/:subjectId"
              element={
                <ProtectedRoute>
                  <Chapters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chapters"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminChapters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scores"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminScores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
