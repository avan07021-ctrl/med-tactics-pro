import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, Info, Play } from "lucide-react";
import bgTests from "@/assets/bg-tests.jpg";

export default function Tests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      setProfile(profileData);
    };

    const fetchThemes = async () => {
      const { data } = await supabase
        .from("themes")
        .select("*")
        .order("order_index", { ascending: true });

      if (data) {
        setThemes(data);
      }
    };

    // Установить listener ПЕРВЫМ
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        }
      }
    );

    // ПОТОМ проверить существующую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
      }
    });

    fetchThemes();

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const themeParam = searchParams.get("theme");
    if (themeParam && themes.length > 0) {
      const themeId = parseInt(themeParam);
      if (!isNaN(themeId) && selectedTheme !== themeId) {
        startTest(themeId);
      }
    }
  }, [searchParams, themes]);

  const startTest = async (themeId: number) => {
    const { data } = await supabase
      .from("test_questions")
      .select("*")
      .eq("theme_id", themeId);

    if (data && data.length > 0) {
      setQuestions(data);
      setSelectedTheme(themeId);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
    } else {
      toast({
        title: "Нет вопросов",
        description: "Для этой темы пока нет тестовых вопросов",
      });
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    if (!user) return;

    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / questions.length) * 100);
    const passed = percentage >= 70; // Порог прохождения теста

    // Сохранение результата в базу данных
    try {
      const { error } = await supabase
        .from("test_results")
        .insert({
          user_id: user.id,
          theme_id: selectedTheme,
          score: correct,
          total_questions: questions.length,
          percentage: percentage,
          passed: passed,
          time_spent: 0, // Можно добавить отслеживание времени
        });

      if (error) {
        console.error("Error saving test result:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось сохранить результаты теста",
        });
      } else {
        toast({
          title: passed ? "Тест пройден!" : "Тест не пройден",
          description: `Вы набрали ${percentage}% правильных ответов`,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при сохранении результатов",
      });
    }

    setScore(correct);
    setShowResults(true);
  };

  const resetTest = () => {
    setSelectedTheme(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (!selectedTheme) {
    return (
      <Layout user={user} isAdmin={profile?.role === "admin"}>
        <div 
          className="max-w-4xl mx-auto bg-cover bg-center rounded-lg p-8 relative"
          style={{ backgroundImage: `url(${bgTests})` }}
        >
          <div className="absolute inset-0 bg-background/80 rounded-lg" />
          <div className="relative z-10">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Тестирование</h1>
            <p className="text-muted-foreground">
              Выберите тему для прохождения теста
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {themes.map((theme, index) => (
              <Card key={theme.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    Тема {index + 1}
                  </Badge>
                  <CardTitle className="text-xl">{theme.name}</CardTitle>
                  <CardDescription>
                    {theme.description || "Тестирование по данной теме"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startTest(theme.id)} className="w-full hover-scale">
                    <Play className="mr-2 h-4 w-4" />
                    Начать тест
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Layout user={user} isAdmin={profile?.role === "admin"}>
        <div className="max-w-2xl mx-auto">
          <Card className="animate-scale-in">
            <CardHeader className="text-center">
              <ClipboardCheck className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Результаты теста</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <div className="text-6xl font-bold text-primary mb-2 animate-fade-in">
                  {percentage}%
                </div>
                <p className="text-lg text-muted-foreground">
                  Правильных ответов: {score} из {questions.length}
                </p>
              </div>
              
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-lg text-left transition-all animate-fade-in ${
                      answers[index] === q.correct_answer
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className="font-medium text-sm mb-1">{q.question}</p>
                    <p className="text-xs">
                      Ваш ответ: <strong>{answers[index] || "Не отвечено"}</strong>
                      {answers[index] !== q.correct_answer && (
                        <> • Правильный: <strong>{q.correct_answer}</strong></>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={resetTest} className="w-full hover-scale">
                Вернуться к выбору темы
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Layout user={user} isAdmin={profile?.role === "admin"}>
      <div className="max-w-3xl mx-auto">
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge>
                Вопрос {currentQuestion + 1} из {questions.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={resetTest}>
                Выйти из теста
              </Button>
            </div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswer}
            >
              <div className="space-y-3">
                {["A", "B", "C", "D"].map((option, idx) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent transition-all cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">
                      <strong>{option}:</strong> {question[`option_${option.toLowerCase()}`]}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {question.hint && (
              <div className="flex gap-2 p-4 rounded-lg bg-muted animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Подсказка:</p>
                  <p className="text-sm text-muted-foreground">{question.hint}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Назад
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitTest}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="flex-1 hover-scale"
                >
                  Завершить тест
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="flex-1 hover-scale">
                  Далее
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}