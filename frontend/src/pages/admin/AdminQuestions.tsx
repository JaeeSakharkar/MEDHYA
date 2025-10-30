import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { backendApi } from '@/services/backendApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminQuestions = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await backendApi.quizzes.getAll();
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedQuizId) return;
      try {
        const data = await backendApi.questions.getByQuiz(selectedQuizId);
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err.message });
      }
    };
    fetchQuestions();
  }, [token, selectedQuizId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedQuizId) return;

    try {
      if (editingQuestion) {
        await backendApi.questions.update(selectedQuizId, editingQuestion.id, formData);
        toast({ title: 'Success', description: 'Question updated successfully' });
      } else {
        await backendApi.questions.create(selectedQuizId, formData);
        toast({ title: 'Success', description: 'Question created successfully' });
      }
      setIsDialogOpen(false);
      setEditingQuestion(null);
      setFormData({ question: '', options: ['', '', '', ''], correctAnswer: '' });
      const data = await backendApi.questions.getByQuiz(selectedQuizId);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !selectedQuizId || !confirm('Are you sure you want to delete this question?')) return;

    try {
      await backendApi.questions.delete(selectedQuizId, id);
      toast({ title: 'Success', description: 'Question deleted successfully' });
      const data = await backendApi.questions.getByQuiz(selectedQuizId);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Manage Questions</h1>
            <p className="text-muted-foreground text-lg">Create and edit questions for quizzes</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a quiz to manage its questions" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedQuizId && (
            <>
              <div className="mb-6 flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingQuestion(null); setFormData({ question: '', options: ['', '', '', ''], correctAnswer: '' }); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
                      <DialogDescription>
                        {editingQuestion ? 'Update question details' : 'Add a new question to this quiz'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="question">Question *</Label>
                        <Input
                          id="question"
                          value={formData.question}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          required
                        />
                      </div>
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx}>
                          <Label htmlFor={`option-${idx}`}>Option {idx + 1} *</Label>
                          <Input
                            id={`option-${idx}`}
                            value={formData.options[idx]}
                            onChange={(e) => {
                              const newOptions = [...formData.options];
                              newOptions[idx] = e.target.value;
                              setFormData({ ...formData, options: newOptions });
                            }}
                            required
                          />
                        </div>
                      ))}
                      <div>
                        <Label htmlFor="correctAnswer">Correct Answer *</Label>
                        <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.options.filter(o => o).map((option, idx) => (
                              <SelectItem key={idx} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          {editingQuestion ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {questions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No questions added yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, idx) => (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {idx + 1}. {question.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {question.options?.map((option: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg ${
                                option === question.correctAnswer ? 'bg-success/10 border border-success' : 'bg-muted'
                              }`}
                            >
                              {option}
                              {option === question.correctAnswer && (
                                <span className="ml-2 text-xs font-semibold text-success">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(question)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminQuestions;
