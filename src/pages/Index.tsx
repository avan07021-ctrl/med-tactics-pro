import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cross, BookOpen, ClipboardList, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Cross className="h-24 w-24 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Тактическая Медицина
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Образовательная платформа для изучения основ тактической медицины и первой помощи
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Войти в систему
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Регистрация
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Обучающие материалы</CardTitle>
              <CardDescription>
                Полный курс по тактической медицине с теоретическими и практическими занятиями
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ClipboardList className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Тестирование</CardTitle>
              <CardDescription>
                Проверьте свои знания с помощью интерактивных тестов по каждой теме курса
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Для педагогов</CardTitle>
              <CardDescription>
                Административная панель для управления вопросами и отслеживания прогресса
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground">
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
