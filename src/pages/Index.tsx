import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Users, BarChart3, Settings, ArrowRight } from "lucide-react";
import avangardLogo from "@/assets/avangard-logo.jpg";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Проверка текущей сессии
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Получить профиль пользователя
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    checkSession();

    // Подписка на изменения auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Рендер для авторизованных пользователей
  if (user && profile) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={avangardLogo} alt="ОСЛ Авангард" className="h-24 w-24 object-contain hover-scale" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Добро пожаловать, {profile.full_name || user.email}!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {profile.role === "admin" 
                ? "Панель управления образовательной платформой"
                : "Выберите раздел для продолжения обучения"
              }
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="mt-4"
            >
              Выйти
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card 
              className="card-hover animate-fade-in cursor-pointer group" 
              style={{ animationDelay: '0.1s' }}
              onClick={() => navigate("/themes")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  Темы курса
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  Изучайте теоретические материалы по тактической медицине
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">
                  Перейти к темам
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="card-hover animate-fade-in cursor-pointer group" 
              style={{ animationDelay: '0.2s' }}
              onClick={() => navigate("/tests")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  Тестирование
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  Проверьте свои знания интерактивными тестами
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">
                  Начать тест
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="card-hover animate-fade-in cursor-pointer group" 
              style={{ animationDelay: '0.3s' }}
              onClick={() => navigate("/statistics")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  Статистика
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  {profile.role === "admin" 
                    ? "Отслеживайте прогресс всех студентов"
                    : "Просматривайте свой прогресс обучения"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">
                  Открыть статистику
                </Button>
              </CardContent>
            </Card>

            {profile.role === "admin" && (
              <Card 
                className="card-hover animate-fade-in cursor-pointer group" 
                style={{ animationDelay: '0.4s' }}
                onClick={() => navigate("/admin")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    Администрирование
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>
                    Управление вопросами и темами курса
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Панель админа
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-12 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-xl text-center">Быстрые ссылки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3"
                    onClick={() => navigate("/themes")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Темы
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3"
                    onClick={() => navigate("/tests")}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Тесты
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-auto py-3"
                    onClick={() => navigate("/statistics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Статистика
                  </Button>
                  {profile.role === "admin" && (
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
      style={{ backgroundImage: `url(${heroBackground})` }}
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
