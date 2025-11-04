import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Heart, Users, Activity, Shield } from "lucide-react";
import bgThemes from "@/assets/bg-themes.jpg";
import anatomyImage from "@/assets/theme-anatomy.png";
import skeletonImage from "@/assets/theme-skeleton.jpg";
import jointsImage from "@/assets/theme-joints.jpg";
import musclesImage from "@/assets/theme-muscles.jpg";

const themeImages: Record<number, string> = {
  1: anatomyImage,
  2: skeletonImage,
  3: jointsImage,
  4: musclesImage,
};

export default function ThemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
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

    fetchTheme();

    return () => subscription.unsubscribe();
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
        style={{ backgroundImage: `url(${bgThemes})` }}
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
              {themeImages[theme.id] && (
                <Card className="overflow-hidden">
                  <img 
                    src={themeImages[theme.id]} 
                    alt={theme.name}
                    className="w-full h-auto object-cover"
                  />
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Теоретический материал
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theme.content ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap leading-relaxed">{theme.content}</div>
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
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          Основные принципы
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Безопасность оказывающего помощь - приоритет №1</li>
                          <li>Следование установленным алгоритмам действий</li>
                          <li>Оценка тактической обстановки перед вмешательством</li>
                          <li>Контроль критических параметров: кровотечение, дыхание</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          Последовательность действий
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Первичная оценка обстановки и угроз</li>
                          <li>Остановка критического кровотечения</li>
                          <li>Обеспечение проходимости дыхательных путей</li>
                          <li>Регулярная переоценка состояния пострадавшего</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Важные предостережения
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Контроль времени при наложении жгута (не более 1 часа)</li>
                          <li>Не использовать промедол при ранении головы</li>
                          <li>Профилактика гипотермии (согревание раненого)</li>
                          <li>Полный осмотр для выявления всех повреждений</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          Критические ошибки
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>Несвоевременное снятие жгута</li>
                          <li>Игнорирование оценки тактической обстановки</li>
                          <li>Введение обезболивающего до остановки кровотечения</li>
                          <li>Неполный осмотр пострадавшего</li>
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
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {theme.id === 18 ? "Практические навыки изучения анатомии" : "Практические упражнения"}
                  </CardTitle>
                  <CardDescription>
                    {theme.id === 18 
                      ? "Отработка навыков идентификации и понимания строения человеческого тела"
                      : "Отработка навыков на практике в условиях, приближенных к боевым"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theme.id === 18 ? (
                    <>
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            1
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Изучение опорно-двигательного аппарата</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Освоение знаний о строении скелета и классификации костей
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Идентификация типов костей: трубчатые, губчатые, плоские, смешанные</li>
                              <li>Определение основных костей скелета на схемах и макетах</li>
                              <li>Изучение строения трубчатых костей (эпифиз, диафиз, метафиз)</li>
                              <li>Понимание функций красного костного мозга в кроветворении</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            2
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Система кровообращения</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Понимание строения сердечно-сосудистой системы и гемодинамики
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Различение малого и большого кругов кровообращения</li>
                              <li>Понимание систолы и диастолы, нормы АД (110-120/70-80 мм рт.ст.)</li>
                              <li>Изучение состава крови: плазма (55%) и форменные элементы (45%)</li>
                              <li>Определение групп крови по системе AB0 и резус-фактору</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-lg border-l-4 border-amber-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            3
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Дыхательная система</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Изучение органов дыхания и процесса газообмена
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Понимание строения: носовая полость → гортань → трахея → бронхи → легкие</li>
                              <li>Механизм газообмена через альвеолы (О₂ и СО₂)</li>
                              <li>Роль гемоглобина в транспорте кислорода (1 г = 1,36 мл О₂)</li>
                              <li>Локализация грудной полости и плевральных полостей</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            4
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Полости тела и органы</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Топографическая анатомия и расположение внутренних органов
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Грудная полость: сердце, легкие, средостение</li>
                              <li>Брюшная полость: органы пищеварения, брюшина</li>
                              <li>Выделительная система: почки, мочеточники, мочевой пузырь</li>
                              <li>ЦНС: головной и спинной мозг, соматическая и вегетативная НС</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            5
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Применение знаний на практике</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Связь анатомических знаний с оказанием первой помощи
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Понимание логики процессов при ранениях разных областей</li>
                              <li>Знание расположения крупных сосудов для остановки кровотечений</li>
                              <li>Ориентация в топографии для внутрикостных инфузий</li>
                              <li>Понимание функциональной анатомии для квалифицированной помощи</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            1
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Алгоритм действий</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Отработайте последовательность действий согласно изученному протоколу
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Оценка обстановки и угроз</li>
                              <li>Выполнение алгоритма по шагам</li>
                              <li>Контроль критических параметров</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            2
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Работа с оборудованием</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Практическое применение табельных средств первой помощи
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Наложение жгута в различных условиях</li>
                              <li>Использование гемостатиков и повязок</li>
                              <li>Работа с дыхательными путями</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-lg border-l-4 border-amber-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            3
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Работа в условиях стресса</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Отработка навыков в условиях, приближенных к реальным боевым действиям
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Выполнение действий под давлением времени</li>
                              <li>Работа при ограниченной видимости</li>
                              <li>Взаимодействие в составе группы</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            4
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Комплексная отработка</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Отработка всех элементов темы в комплексе
                            </p>
                            <ul className="text-sm space-y-1 ml-4 list-disc">
                              <li>Сценарные учения с ролевым распределением</li>
                              <li>Работа с несколькими пострадавшими</li>
                              <li>Анализ и работа над ошибками</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => navigate(`/tests?theme=${theme.id}`)} 
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