import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Award, BookOpen, Clock, TrendingUp, Users, CheckCircle2, XCircle } from "lucide-react";
import patternBackground from "@/assets/pattern-background.jpg";

interface UserProgress {
  id: string;
  user_id: string;
  theme_id: number;
  completed: boolean;
  completed_at: string | null;
  time_spent: number;
  theme?: any;
  profile?: any;
}

interface TestResult {
  id: string;
  user_id: string;
  theme_id: number | null;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  time_spent: number;
  created_at: string;
  theme?: any;
  profile?: any;
}

export default function Statistics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

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

      if (!profileData) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      setProfile(profileData);
      setIsAdmin(profileData.role === "admin");

      if (profileData.role === "admin") {
        await fetchAllUsersData();
      } else {
        await fetchUserData(session.user.id);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: progressData } = await supabase
        .from("user_progress")
        .select(`
          *,
          theme:themes(*)
        `)
        .eq("user_id", userId);

      const { data: resultsData } = await supabase
        .from("test_results")
        .select(`
          *,
          theme:themes(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (progressData) setUserProgress(progressData);
      if (resultsData) setTestResults(resultsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const fetchAllUsersData = async () => {
    try {
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: progressData } = await supabase
        .from("user_progress")
        .select(`
          *,
          theme:themes(*),
          profile:profiles(*)
        `);

      const { data: resultsData } = await supabase
        .from("test_results")
        .select(`
          *,
          theme:themes(*),
          profile:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (usersData) setAllUsers(usersData);
      if (progressData) setUserProgress(progressData);
      if (resultsData) setTestResults(resultsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  const getCompletionRate = () => {
    if (userProgress.length === 0) return 0;
    const completed = userProgress.filter(p => p.completed).length;
    return Math.round((completed / userProgress.length) * 100);
  };

  const getAverageScore = () => {
    if (testResults.length === 0) return 0;
    const sum = testResults.reduce((acc, r) => acc + r.percentage, 0);
    return Math.round(sum / testResults.length);
  };

  const getTotalTimeSpent = () => {
    const progressTime = userProgress.reduce((acc, p) => acc + (p.time_spent || 0), 0);
    const testTime = testResults.reduce((acc, r) => acc + (r.time_spent || 0), 0);
    return progressTime + testTime;
  };

  const renderUserStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Прогресс обучения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getCompletionRate()}%</div>
            <Progress value={getCompletionRate()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Средний балл
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getAverageScore()}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Пройдено тестов: {testResults.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Время обучения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTime(getTotalTimeSpent())}</div>
            <p className="text-xs text-muted-foreground mt-2">Общее время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Завершено тем
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userProgress.filter(p => p.completed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              из {userProgress.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">Прогресс по темам</TabsTrigger>
          <TabsTrigger value="tests">Результаты тестов</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Прогресс по темам</CardTitle>
              <CardDescription>Ваше продвижение по курсу</CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет данных о прогрессе
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Тема</TableHead>
                      <TableHead className="text-center">Статус</TableHead>
                      <TableHead className="text-right">Время</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProgress.map((progress) => (
                      <TableRow key={progress.id}>
                        <TableCell className="font-medium">
                          {progress.theme?.name || `Тема ${progress.theme_id}`}
                        </TableCell>
                        <TableCell className="text-center">
                          {progress.completed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Завершено
                            </Badge>
                          ) : (
                            <Badge variant="outline">В процессе</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatTime(progress.time_spent || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Результаты тестов</CardTitle>
              <CardDescription>История ваших попыток</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет результатов тестов
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Тема</TableHead>
                      <TableHead className="text-center">Результат</TableHead>
                      <TableHead className="text-center">Статус</TableHead>
                      <TableHead className="text-right">Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          {result.theme?.name || "Общий тест"}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold">
                            {result.score}/{result.total_questions}
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            ({result.percentage}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {result.passed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Сдано
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Не сдано
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {new Date(result.created_at).toLocaleDateString("ru-RU")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAdminStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Всего студентов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allUsers.filter(u => u.role === "student").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Средний балл группы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getAverageScore()}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Всего тестов: {testResults.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Активность
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userProgress.filter(p => p.completed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Завершено тем</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Успеваемость
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {testResults.length > 0 
                ? Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">Сдано тестов</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Студенты</TabsTrigger>
          <TabsTrigger value="progress">Прогресс</TabsTrigger>
          <TabsTrigger value="tests">Результаты</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Список студентов</CardTitle>
              <CardDescription>Все зарегистрированные пользователи</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead className="text-right">Дата регистрации</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "Не указано"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Администратор" : "Студент"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString("ru-RU")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Прогресс студентов</CardTitle>
              <CardDescription>Продвижение по темам курса</CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет данных о прогрессе
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead className="text-center">Статус</TableHead>
                      <TableHead className="text-right">Время</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProgress.map((progress) => (
                      <TableRow key={progress.id}>
                        <TableCell className="font-medium">
                          {progress.profile?.full_name || progress.profile?.email || "Неизвестно"}
                        </TableCell>
                        <TableCell>
                          {progress.theme?.name || `Тема ${progress.theme_id}`}
                        </TableCell>
                        <TableCell className="text-center">
                          {progress.completed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Завершено
                            </Badge>
                          ) : (
                            <Badge variant="outline">В процессе</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatTime(progress.time_spent || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Результаты тестов</CardTitle>
              <CardDescription>История всех попыток</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет результатов тестов
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead className="text-center">Результат</TableHead>
                      <TableHead className="text-center">Статус</TableHead>
                      <TableHead className="text-right">Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          {result.profile?.full_name || result.profile?.email || "Неизвестно"}
                        </TableCell>
                        <TableCell>
                          {result.theme?.name || "Общий тест"}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold">
                            {result.score}/{result.total_questions}
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            ({result.percentage}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {result.passed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Сдано
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Не сдано
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {new Date(result.created_at).toLocaleDateString("ru-RU")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Layout user={user} isAdmin={isAdmin}>
      <div 
        className="max-w-7xl mx-auto bg-cover bg-center rounded-lg p-8 relative"
        style={{ backgroundImage: `url(${patternBackground})` }}
      >
        <div className="absolute inset-0 bg-background/90 rounded-lg" />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isAdmin ? "Панель контроля" : "Моя статистика"}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Отслеживание прогресса всех студентов"
                : "Отслеживание вашего прогресса в обучении"
              }
            </p>
          </div>

          {isAdmin ? renderAdminStats() : renderUserStats()}
        </div>
      </div>
    </Layout>
  );
}