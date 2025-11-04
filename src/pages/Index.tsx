import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Users, BarChart3, Settings, ArrowRight } from "lucide-react";
import avangardLogo from "@/assets/avangard-logo.jpg";
import bgMain from "@/assets/bg-main.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Функция для загрузки профиля
    const fetchProfile = async (userId: string) => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    };

    // Установить listener ПЕРВЫМ
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Использовать setTimeout для отложенных Supabase вызовов
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // ПОТОМ проверить существующую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Рендер для авторизованных пользователей
  if (user) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${bgMain})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={avangardLogo} alt="ОСЛ Авангард" className="h-24 w-24 object-contain hover-scale animate-float" />
            </div>
            <h1 className="text-4xl font-bold mb-4 vr-text-xl">
              Добро пожаловать, {profile?.full_name || user.email}!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto vr-text-lg">
              {(profile?.role === "admin") 
                ? "Панель управления образовательной платформой"
                : "Выберите раздел для продолжения обучения"
              }
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="mt-4 hover-scale"
            >
              Выйти
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card 
              className="card-hover animate-fade-in cursor-pointer group backdrop-blur-sm bg-card/95 border-2 border-primary/10 hover:border-primary/30" 
              style={{ animationDelay: '0.1s' }}
              onClick={() => navigate("/themes")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 animate-pulse-glow">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2 vr-text-lg">
                  Темы курса
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="vr-text-lg">
                  Изучайте теоретические материалы по тактической медицине
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full hover-scale">
                  Перейти к темам
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="card-hover animate-fade-in cursor-pointer group backdrop-blur-sm bg-card/95 border-2 border-primary/10 hover:border-primary/30" 
              style={{ animationDelay: '0.2s' }}
              onClick={() => navigate("/tests")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2 vr-text-lg">
                  Тестирование
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="vr-text-lg">
                  Проверьте свои знания интерактивными тестами
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full hover-scale">
                  Начать тест
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="card-hover animate-fade-in cursor-pointer group backdrop-blur-sm bg-card/95 border-2 border-primary/10 hover:border-primary/30" 
              style={{ animationDelay: '0.3s' }}
              onClick={() => navigate("/statistics")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2 vr-text-lg">
                  Статистика
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="vr-text-lg">
                  {(profile?.role === "admin") 
                    ? "Отслеживайте прогресс всех студентов"
                    : "Просматривайте свой прогресс обучения"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full hover-scale">
                  Открыть статистику
                </Button>
              </CardContent>
            </Card>

            {(profile?.role === "admin") && (
              <Card 
                className="card-hover animate-fade-in cursor-pointer group backdrop-blur-sm bg-card/95 border-2 border-primary/10 hover:border-primary/30" 
                style={{ animationDelay: '0.4s' }}
                onClick={() => navigate("/admin")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 vr-text-lg">
                    Администрирование
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription className="vr-text-lg">
                    Управление вопросами и темами курса
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full hover-scale">
                    Панель админа
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-12 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card className="backdrop-blur-sm bg-primary/95 text-primary-foreground border-2 border-primary-glow shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-center vr-text-lg">Быстрые ссылки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3 hover-scale"
                    onClick={() => navigate("/themes")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Темы
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3 hover-scale"
                    onClick={() => navigate("/tests")}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Тесты
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3 hover-scale"
                    onClick={() => navigate("/statistics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Статистика
                  </Button>
                  {(profile?.role === "admin") && (
                    <Button 
                      variant="secondary" 
                      className="h-auto py-3"
                      onClick={() => navigate("/admin")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Админ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Рендер для неавторизованных пользователей
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={avangardLogo} alt="ОСЛ Авангард" className="h-32 w-32 object-contain hover-scale" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Тактическая Медицина
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Образовательная платформа для изучения основ тактической медицины и первой помощи
          </p>
          <p className="text-lg font-medium text-primary">
            ОСЛ «Авангард»
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="hover-scale">
              Войти в систему
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="hover-scale">
              Регистрация
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Обучающие материалы</CardTitle>
              <CardDescription>
                Полный курс по тактической медицине с теоретическими и практическими занятиями
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <ClipboardList className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Тестирование</CardTitle>
              <CardDescription>
                Проверьте свои знания с помощью интерактивных тестов по каждой теме курса
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Для педагогов</CardTitle>
              <CardDescription>
                Административная панель для управления вопросами и отслеживания прогресса
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Card className="bg-primary text-primary-foreground card-hover">
            <CardHeader>
              <CardTitle className="text-2xl">Что вы изучите?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li>✓ Основы тактической медицины</li>
                <li>✓ Универсальный алгоритм первой помощи</li>
                <li>✓ Остановка кровотечений</li>
                <li>✓ Проходимость дыхательных путей</li>
                <li>✓ Сердечно-легочная реанимация</li>
                <li>✓ Помощь при травмах</li>
                <li>✓ Иммобилизация и транспортировка</li>
                <li>✓ И многое другое...</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
