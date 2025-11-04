import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import testData from "@/data/test_base.json";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileData?.role !== "admin") {
        navigate("/themes");
        return;
      }

      setUser(session.user);
      setProfile(profileData);
    };

    const fetchData = async () => {
      const { data: themesData } = await supabase
        .from("themes")
        .select("*")
        .order("order_index", { ascending: true });

      const { data: questionsData } = await supabase
        .from("test_questions")
        .select("*")
        .order("id", { ascending: true });

      if (themesData) setThemes(themesData);
      if (questionsData) setQuestions(questionsData);
    };

    checkAuth();
    fetchData();
  }, [navigate]);

  const importTestData = async () => {
    try {
      // First, get unique themes from test data
      const uniqueThemes = new Map();
      testData.test_questions.forEach((q: any) => {
        if (!uniqueThemes.has(q.theme_id)) {
          uniqueThemes.set(q.theme_id, {
            name: q.theme_name,
            order_index: q.theme_id
          });
        }
      });

      // Insert themes
      const themesArray = Array.from(uniqueThemes.values());
      const { data: insertedThemes, error: themesError } = await supabase
        .from("themes")
        .upsert(themesArray.map((t: any, index) => ({
          id: index + 1,
          name: t.name,
          order_index: t.order_index
        })))
        .select();

      if (themesError) throw themesError;

      // Insert questions
      const questionsToInsert = testData.test_questions.map((q: any) => ({
        theme_id: q.theme_id,
        question: q.question,
        option_a: q.options.A,
        option_b: q.options.B,
        option_c: q.options.C,
        option_d: q.options.D,
        correct_answer: q.correct_answer,
        hint: q.hint,
        source: q.source
      }));

      const { error: questionsError } = await supabase
        .from("test_questions")
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast({
        title: "Успешно",
        description: "Тестовые данные импортированы",
      });

      // Refresh data
      const { data: themesData } = await supabase.from("themes").select("*");
      const { data: questionsData } = await supabase.from("test_questions").select("*");
      if (themesData) setThemes(themesData);
      if (questionsData) setQuestions(questionsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const deleteQuestion = async (id: number) => {
    const { error } = await supabase
      .from("test_questions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      setQuestions(questions.filter(q => q.id !== id));
      toast({
        title: "Успешно",
        description: "Вопрос удален",
      });
    }
  };

  return (
    <Layout user={user} isAdmin={true}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">
              Управление темами и тестовыми вопросами
            </p>
          </div>
          <Button onClick={importTestData} className="hover-scale">
            <Upload className="mr-2 h-4 w-4" />
            Импортировать тестовые данные
          </Button>
        </div>

        <Tabs defaultValue="questions">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="questions">Вопросы ({questions.length})</TabsTrigger>
            <TabsTrigger value="themes">Темы ({themes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <div className="space-y-4">
              {questions.map((question, idx) => (
                <Card key={question.id} className="card-hover animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{question.question}</CardTitle>
                        <CardDescription>
                          Тема ID: {question.theme_id} • Правильный ответ: {question.correct_answer}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>A: {question.option_a}</div>
                      <div>B: {question.option_b}</div>
                      <div>C: {question.option_c}</div>
                      <div>D: {question.option_d}</div>
                    </div>
                    {question.hint && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Подсказка: {question.hint}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="themes">
            <div className="space-y-4">
              {themes.map((theme, idx) => (
                <Card key={theme.id} className="card-hover animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CardHeader>
                    <CardTitle>{theme.name}</CardTitle>
                    <CardDescription>
                      {theme.description || "Нет описания"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {theme.format && `Формат: ${theme.format} • `}
                      {theme.hours && `Часы: ${theme.hours} • `}
                      {theme.level && `Уровень: ${theme.level}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}