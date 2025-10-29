import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { chaptersApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FolderOpen, BookOpen } from 'lucide-react';

const Chapters = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { token } = useAuth();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!token || !subjectId) return;
      
      try {
        const data = await chaptersApi.getBySubject(subjectId, token);
        setChapters(Array.isArray(data) ? data.sort((a, b) => (a.order || 0) - (b.order || 0)) : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [token, subjectId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Chapters</h1>
          <p className="text-muted-foreground text-lg">Subject: {subjectId}</p>
        </div>

        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No chapters available for this subject</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters.map((chapter, idx) => (
              <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="mb-2">
                        {idx + 1}. {chapter.title}
                      </CardTitle>
                      <CardDescription>{chapter.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Chapters;
