import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { backendApi } from '@/services/backendApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminChapters = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [subjectId, setSubjectId] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', order: 0 });

  const fetchChapters = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const data = await backendApi.chapters.getBySubject(subjectId);
      setChapters(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return;

    try {
      if (editingChapter) {
        await backendApi.chapters.update(subjectId, editingChapter.id, formData);
        toast({ title: 'Success', description: 'Chapter updated successfully' });
      } else {
        await backendApi.chapters.create(subjectId, formData);
        toast({ title: 'Success', description: 'Chapter created successfully' });
      }
      setIsDialogOpen(false);
      setEditingChapter(null);
      setFormData({ title: '', description: '', order: 0 });
      fetchChapters();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleEdit = (chapter: any) => {
    setEditingChapter(chapter);
    setFormData({ title: chapter.title, description: chapter.description, order: chapter.order || 0 });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!subjectId || !confirm('Are you sure you want to delete this chapter?')) return;

    try {
      await backendApi.chapters.delete(subjectId, id);
      toast({ title: 'Success', description: 'Chapter deleted successfully' });
      fetchChapters();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Manage Chapters</h1>
            <p className="text-muted-foreground text-lg">Organize learning content into chapters</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subject Selection</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Input
                placeholder="Enter Subject ID"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={fetchChapters} disabled={!subjectId}>
                Load Chapters
              </Button>
            </CardContent>
          </Card>

          {loading ? (
            <LoadingSpinner />
          ) : subjectId && (
            <>
              <div className="mb-6 flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingChapter(null); setFormData({ title: '', description: '', order: 0 }); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Chapter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Create New Chapter'}</DialogTitle>
                      <DialogDescription>
                        {editingChapter ? 'Update chapter information' : 'Add a new chapter to this subject'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="order">Order</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          {editingChapter ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {chapters.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No chapters created yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter) => (
                    <Card key={chapter.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{chapter.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-2">{chapter.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Order: {chapter.order}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(chapter)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(chapter.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
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

export default AdminChapters;
