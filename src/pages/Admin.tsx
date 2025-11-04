import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Search } from "lucide-react";
import { QuestionForm } from "@/components/QuestionForm";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import testData from "@/data/test_base.json";
import patternBackground from "@/assets/pattern-background.jpg";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

      if (themesData) {
        setThemes(themesData);
      }
      if (questionsData) {
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);
      }
    };

    checkAuth();
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.option_a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.option_b.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.option_c.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.option_d.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  }, [searchQuery, questions]);

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
      const { data: themesData } = await supabase.from("themes").select("*").order("order_index");
      const { data: questionsData } = await supabase.from("test_questions").select("*").order("id");
      if (themesData) setThemes(themesData);
      if (questionsData) {
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот вопрос?")) return;

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
      const updated = questions.filter(q => q.id !== id);
      setQuestions(updated);
      setFilteredQuestions(updated);
      toast({
        title: "Успешно",
        description: "Вопрос удален",
      });
    }
  };

  const saveQuestion = async (questionData: any) => {
    try {
      if (questionData.id) {
        // Update existing
        const { error } = await supabase
          .from("test_questions")
          .update({
            theme_id: questionData.theme_id,
            question: questionData.question,
            option_a: questionData.option_a,
            option_b: questionData.option_b,
            option_c: questionData.option_c,
            option_d: questionData.option_d,
            correct_answer: questionData.correct_answer,
            hint: questionData.hint || null,
            source: questionData.source || null,
          })
          .eq("id", questionData.id);

        if (error) throw error;

        const updated = questions.map(q => 
          q.id === questionData.id ? { ...q, ...questionData } : q
        );
        setQuestions(updated);
        setFilteredQuestions(updated);
        
        toast({
          title: "Успешно",
          description: "Вопрос обновлен",
        });
      } else {
        // Create new
        const { data, error } = await supabase
          .from("test_questions")
          .insert({
            theme_id: questionData.theme_id,
            question: questionData.question,
            option_a: questionData.option_a,
            option_b: questionData.option_b,
            option_c: questionData.option_c,
            option_d: questionData.option_d,
            correct_answer: questionData.correct_answer,
            hint: questionData.hint || null,
            source: questionData.source || null,
          })
          .select()
          .single();

        if (error) throw error;

        const updated = [...questions, data];
        setQuestions(updated);
        setFilteredQuestions(updated);

        toast({
          title: "Успешно",
          description: "Вопрос добавлен",
        });
      }

      setEditingQuestion(null);
      setShowQuestionForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  return (
    <Layout user={user} isAdmin={true}>
      <div 
        className="max-w-6xl mx-auto bg-cover bg-center rounded-lg p-8 relative"
        style={{ backgroundImage: `url(${patternBackground})` }}
      >
        <div className="absolute inset-0 bg-background/85 rounded-lg" />
        <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">
              Управление темами и тестовыми вопросами
            </p>
          </div>
          <Button onClick={importTestData} variant="outline" className="hover-scale">
            <Upload className="mr-2 h-4 w-4" />
            Импортировать данные
          </Button>
        </div>

        <Tabs defaultValue="questions">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="questions">Вопросы ({questions.length})</TabsTrigger>
            <TabsTrigger value="themes">Темы ({themes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            {(showQuestionForm || editingQuestion) && (
              <QuestionForm
                themes={themes}
                question={editingQuestion}
                onSave={saveQuestion}
                onCancel={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                }}
              />
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по вопросам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {!showQuestionForm && !editingQuestion && (
                <Button onClick={() => setShowQuestionForm(true)} className="hover-scale">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить вопрос
                </Button>
              )}
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead className="w-24">Тема</TableHead>
                    <TableHead>Вопрос</TableHead>
                    <TableHead className="w-20">Ответ</TableHead>
                    <TableHead className="w-32 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {searchQuery ? "Вопросы не найдены" : "Нет вопросов"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                      <TableRow key={question.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{question.id}</TableCell>
                        <TableCell>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {themes.find(t => t.id === question.theme_id)?.name?.substring(0, 15) || `ID: ${question.theme_id}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="line-clamp-2 text-sm">{question.question}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary">{question.correct_answer}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingQuestion(question);
                                setShowQuestionForm(false);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
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
      </div>
    </Layout>
  );
}