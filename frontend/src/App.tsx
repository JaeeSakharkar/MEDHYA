import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminChapters from "./pages/admin/AdminChapters";
import AdminScores from "./pages/admin/AdminScores";
import AdminUsers from "./pages/admin/AdminUsers";
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
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/quizzes" element={<AdminQuizzes />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/chapters" element={<AdminChapters />} />
            <Route path="/admin/scores" element={<AdminScores />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
