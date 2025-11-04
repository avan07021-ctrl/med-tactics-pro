import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import patternBackground from "@/assets/pattern-background.jpg";

export default function ThemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      setProfile(profileData);
    };

    const fetchTheme = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (!error && data) {
        setTheme(data);
      }
      setLoading(false);
    };

    checkAuth();
    fetchTheme();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout user={user} isAdmin={profile?.role === "admin"}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p>Загрузка...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!theme) {
    return (
      <Layout user={user} isAdmin={profile?.role === "admin"}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p>Тема не найдена</p>
              <Button onClick={() => navigate("/themes")} className="mt-4">
                Вернуться к темам
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} isAdmin={profile?.role === "admin"}>
      <div 
        className="max-w-4xl mx-auto bg-cover bg-center rounded-lg p-8 relative"
        style={{ backgroundImage: `url(${patternBackground})` }}
      >
        <div className="absolute inset-0 bg-background/85 rounded-lg" />
        <div className="relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/themes")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к темам
          </Button>

          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{theme.name}</CardTitle>
                  {theme.description && (
                    <CardDescription className="text-base">
                      {theme.description}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="outline" className="ml-4">
                  Тема #{theme.order_index || theme.id}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                {theme.format && (
                  <Badge variant="secondary">{theme.format}</Badge>
                )}
                {theme.hours && (
                  <Badge variant="secondary">{theme.hours} ак.ч.</Badge>
                )}
                {theme.level && (
                  <Badge variant="secondary">{theme.level}</Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="content" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Содержание</TabsTrigger>
              <TabsTrigger value="practice">Практические навыки</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Теоретический материал
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theme.content ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{theme.content}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Содержание будет добавлено позже
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ключевые моменты</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Что необходимо знать
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Основные принципы и алгоритмы</li>
                          <li>Показания и противопоказания</li>
                          <li>Последовательность действий</li>
                          <li>Критические ошибки</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Важные предостережения
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Безопасность оказывающего помощь - приоритет №1</li>
                          <li>Оценка тактической обстановки перед действиями</li>
                          <li>Контроль времени при наложении жгута</li>
                          <li>Регулярная переоценка состояния пострадавшего</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Практические упражнения</CardTitle>
                  <CardDescription>
                    Отработка навыков на практике
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Упражнение 1: Алгоритм действий</h4>
                    <p className="text-sm text-muted-foreground">
                      Отработайте последовательность действий согласно изученному протоколу
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Упражнение 2: Работа с оборудованием</h4>
                    <p className="text-sm text-muted-foreground">
                      Практическое применение табельных средств первой помощи
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Упражнение 3: Работа в условиях стресса</h4>
                    <p className="text-sm text-muted-foreground">
                      Отработка навыков в условиях, приближенных к реальным
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => navigate("/tests")} 
              className="flex-1 hover-scale"
            >
              Пройти тест по теме
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/themes")}
              className="flex-1"
            >
              К списку тем
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}