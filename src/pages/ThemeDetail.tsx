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
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Heart, Users, Activity, Shield, FileImage, FileText, Video, Download, ExternalLink } from "lucide-react";
import bgThemes from "@/assets/bg-themes.jpg";
import anatomyImage from "@/assets/theme-anatomy.png";
import skeletonImage from "@/assets/theme-skeleton.jpg";
import jointsImage from "@/assets/theme-joints.jpg";
import musclesImage from "@/assets/theme-muscles.jpg";
import skeletonFrontImg from "@/assets/anatomy-skeleton-front.jpg";
import skeletonBackImg from "@/assets/anatomy-skeleton-back.jpg";
import boneStructureImg from "@/assets/anatomy-bone-structure.jpg";
import respiratorySystemImg from "@/assets/anatomy-respiratory-system.jpg";
import circulatorySystemImg from "@/assets/anatomy-circulatory-system.jpg";
import urinarySystemImg from "@/assets/anatomy-urinary-system.jpg";
import brainImg from "@/assets/anatomy-brain.jpg";

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
  const [themeMedia, setThemeMedia] = useState<any[]>([]);
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
        
        // Fetch media for this theme
        const { data: mediaData } = await supabase
          .from("theme_media")
          .select("*")
          .eq("theme_id", parseInt(id))
          .order("created_at", { ascending: false });
        
        if (mediaData) {
          setThemeMedia(mediaData);
        }
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

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('theme-media')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const images = themeMedia.filter(m => m.media_type === 'image');

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Содержание</TabsTrigger>
              <TabsTrigger value="practice">Практические навыки</TabsTrigger>
              <TabsTrigger value="media">Медиаматериалы</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {theme.id === 18 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Кости скелета человека
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <img 
                            src={skeletonFrontImg} 
                            alt="Кости скелета (вид спереди)"
                            className="w-full h-auto object-contain rounded-lg border"
                          />
                          <p className="text-sm text-center text-muted-foreground mt-2">Вид спереди</p>
                        </div>
                        <div>
                          <img 
                            src={skeletonBackImg} 
                            alt="Кости скелета (вид сзади)"
                            className="w-full h-auto object-contain rounded-lg border"
                          />
                          <p className="text-sm text-center text-muted-foreground mt-2">Вид сзади</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Строение трубчатых костей</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={boneStructureImg} 
                        alt="Строение трубчатых костей"
                        className="w-full max-w-md mx-auto h-auto object-contain rounded-lg border mb-4"
                      />
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>В длинных трубчатых костях есть:</p>
                        <ul>
                          <li><strong>Эпифизы</strong> — расширенные концы костей, содержат красный костный мозг</li>
                          <li><strong>Диафиз</strong> — средняя часть кости</li>
                          <li><strong>Метафиз</strong> — участок между эпифизом и диафизом</li>
                          <li><strong>Компактное вещество</strong> — плотный наружный слой</li>
                          <li><strong>Губчатое вещество</strong> — внутренний слой с сетью костных балок</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Система кровообращения</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={circulatorySystemImg} 
                        alt="Строение системы кровообращения"
                        className="w-full max-w-md mx-auto h-auto object-contain rounded-lg border mb-4"
                      />
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p><strong>Малый круг кровообращения:</strong> правый желудочек → легочные артерии → легкие → легочные вены → левое предсердие</p>
                        <p><strong>Большой круг кровообращения:</strong> левый желудочек → аорта → органы и ткани → полые вены → правое предсердие</p>
                        <ul>
                          <li>Систолическое давление: 110-120 мм рт. ст.</li>
                          <li>Диастолическое давление: 70-80 мм рт. ст.</li>
                          <li>Частота сердечных сокращений: 60-80 уд/мин</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Дыхательная система</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={respiratorySystemImg} 
                        alt="Строение дыхательной системы"
                        className="w-full max-w-md mx-auto h-auto object-contain rounded-lg border mb-4"
                      />
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>Путь воздуха: носовая полость → гортань → трахея → бронхи → легкие → альвеолы</p>
                        <p><strong>Газообмен:</strong> в альвеолах через тонкую мембрану происходит диффузия O₂ в кровь и СО₂ из крови.</p>
                        <p><strong>Кислородная емкость:</strong> 1 г гемоглобина связывает 1,36 мл О₂. При 15% гемоглобина в крови — 100 мл крови переносят до 21 мл О₂.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Выделительная система</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={urinarySystemImg} 
                        alt="Строение мочеполовой системы"
                        className="w-full max-w-md mx-auto h-auto object-contain rounded-lg border mb-4"
                      />
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>Система состоит из:</p>
                        <ul>
                          <li>Почки — фильтрация плазмы крови</li>
                          <li>Мочеточники — транспорт мочи</li>
                          <li>Мочевой пузырь — накопление мочи</li>
                          <li>Мочеиспускательный канал — выведение мочи</li>
                        </ul>
                        <p><strong>Суточный диурез:</strong> 1,2–1,8 л у взрослого человека</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Центральная нервная система</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={brainImg} 
                        alt="Строение головного мозга"
                        className="w-full max-w-md mx-auto h-auto object-contain rounded-lg border mb-4"
                      />
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p><strong>ЦНС включает:</strong> головной и спинной мозг (серое и белое вещество)</p>
                        <p><strong>Соматическая НС:</strong> иннервация скелетных мышц, кожи, связь с внешней средой</p>
                        <p><strong>Вегетативная НС:</strong> иннервация внутренних органов, сосудов, желез, регуляция обменных процессов</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
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

                      {theme.id === 2 && images.length > 0 && (
                        <div className="mt-8 space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации
                          </h3>
                          <div className="grid gap-4">
                            {images.map((media) => (
                              <Card key={media.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex flex-col gap-2">
                                    <h4 className="font-medium text-sm">{media.file_name}</h4>
                                    <img
                                      src={getPublicUrl(media.file_path)}
                                      alt={media.file_name}
                                      className="w-full h-auto rounded-lg border"
                                      loading="lazy"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Ключевые моменты</CardTitle>
                </CardHeader>
                <CardContent>
                  {theme.id === 18 ? (
                    <div className="space-y-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <Heart className="h-5 w-5 text-red-500" />
                          Костная система
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <p><strong>Функции костной системы:</strong></p>
                          <ul className="space-y-1">
                            <li>Опорная — механическая основа тела</li>
                            <li>Защитная — защита жизненно важных органов (череп, грудная клетка, позвоночник)</li>
                            <li>Кроветворная — красный костный мозг производит клетки крови</li>
                            <li>Двигательная — места прикрепления мышц, обеспечивающих движение</li>
                            <li>Минеральная — депо кальция и фосфора</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Классификация костей:</strong></p>
                          <ul className="space-y-1">
                            <li><strong>Трубчатые кости</strong> — плечевая, бедренная, лучевая, локтевая кости. Содержат эпифизы (концы), диафиз (тело), метафиз (зона роста)</li>
                            <li><strong>Губчатые кости</strong> — позвонки, кости запястья, предплюсны. Состоят из губчатого вещества, покрытого тонким слоем компактного</li>
                            <li><strong>Плоские кости</strong> — кости черепа, лопатки, грудина. Защищают органы и служат для прикрепления мышц</li>
                            <li><strong>Смешанные кости</strong> — кости основания черепа (височная, клиновидная)</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Строение трубчатой кости:</strong></p>
                          <ul className="space-y-1">
                            <li>Компактное вещество — плотный наружный слой, содержит остеоны (гаверсовы системы)</li>
                            <li>Губчатое вещество — внутренний слой с трабекулами (костные балки), образующими сеть</li>
                            <li>Красный костный мозг — находится в эпифизах, обеспечивает кроветворение</li>
                            <li>Жёлтый костный мозг — расположен в диафизе, выполняет энергетическую функцию</li>
                          </ul>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <Activity className="h-5 w-5 text-blue-500" />
                          Система кровообращения
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <p><strong>Строение сердца:</strong> четырёхкамерный орган с двумя предсердиями и двумя желудочками. Между камерами находятся клапаны (митральный, трикуспидальный, аортальный, легочный).</p>
                          
                          <p className="mt-3"><strong>Круги кровообращения:</strong></p>
                          <ul className="space-y-2">
                            <li><strong>Малый круг (легочный):</strong> правый желудочек → легочные артерии → капилляры легких (газообмен: O₂ поступает в кровь, CO₂ удаляется) → легочные вены → левое предсердие</li>
                            <li><strong>Большой круг (системный):</strong> левый желудочек → аорта → артерии → капилляры органов и тканей (доставка O₂ и питательных веществ) → вены → полые вены → правое предсердие</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Физиологические показатели:</strong></p>
                          <ul className="space-y-1">
                            <li>Систолическое АД: 110–120 мм рт. ст.</li>
                            <li>Диастолическое АД: 70–80 мм рт. ст.</li>
                            <li>Частота сердечных сокращений: 60–80 уд/мин</li>
                            <li>Ударный объем: 70–80 мл</li>
                            <li>Минутный объем: 4,5–5,5 л</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Состав крови:</strong></p>
                          <ul className="space-y-1">
                            <li>Плазма (55%) — жидкая часть, содержит воду, белки, электролиты</li>
                            <li>Форменные элементы (45%): эритроциты (транспорт O₂), лейкоциты (иммунная защита), тромбоциты (свёртывание)</li>
                            <li>Группы крови: 0(I), A(II), B(III), AB(IV) по системе AB0 и резус-фактор (Rh+ или Rh−)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                          Дыхательная система
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <p><strong>Воздухоносные пути:</strong> носовая полость (согревание, увлажнение, очистка воздуха) → гортань (голосообразование) → трахея → главные бронхи → долевые бронхи → сегментарные бронхи → бронхиолы → альвеолы</p>
                          
                          <p className="mt-3"><strong>Легкие:</strong> парный орган в грудной полости. Правое легкое — 3 доли, левое — 2 доли.</p>
                          
                          <p className="mt-3"><strong>Газообмен в альвеолах:</strong></p>
                          <ul className="space-y-1">
                            <li>Через тонкую альвеоло-капиллярную мембрану происходит диффузия газов</li>
                            <li>Кислород (O₂) из альвеолярного воздуха переходит в кровь</li>
                            <li>Углекислый газ (CO₂) из крови переходит в альвеолы и выдыхается</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Транспорт кислорода:</strong></p>
                          <ul className="space-y-1">
                            <li>1 г гемоглобина связывает 1,36 мл O₂</li>
                            <li>При концентрации гемоглобина 15% в крови: 100 мл крови переносят до 21 мл O₂</li>
                            <li>Насыщение артериальной крови кислородом (SpO₂): в норме 96–100%</li>
                          </ul>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <Shield className="h-5 w-5 text-green-500" />
                          Выделительная система
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <p><strong>Компоненты системы:</strong></p>
                          <ul className="space-y-1">
                            <li><strong>Почки</strong> — парный орган, фильтрует кровь, образует мочу. Функциональная единица — нефрон (около 1 млн в каждой почке)</li>
                            <li><strong>Мочеточники</strong> — транспортируют мочу из почек в мочевой пузырь</li>
                            <li><strong>Мочевой пузырь</strong> — полый орган для накопления мочи (вместимость 300–500 мл)</li>
                            <li><strong>Мочеиспускательный канал</strong> — выводит мочу наружу</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Функции почек:</strong></p>
                          <ul className="space-y-1">
                            <li>Фильтрация плазмы крови (первичная моча — 150–180 л/сут)</li>
                            <li>Реабсорбция (обратное всасывание) полезных веществ</li>
                            <li>Образование вторичной мочи (суточный диурез: 1,2–1,8 л у взрослого)</li>
                            <li>Регуляция водно-электролитного баланса и кислотно-щелочного равновесия</li>
                            <li>Выведение продуктов обмена (мочевина, креатинин, мочевая кислота)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <BookOpen className="h-5 w-5 text-purple-500" />
                          Центральная нервная система
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                          <p><strong>Состав ЦНС:</strong></p>
                          <ul className="space-y-1">
                            <li><strong>Головной мозг</strong> — высший центр регуляции всех функций организма</li>
                            <li><strong>Спинной мозг</strong> — проводниковая и рефлекторная функция, расположен в позвоночном канале</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Отделы головного мозга:</strong></p>
                          <ul className="space-y-1">
                            <li>Продолговатый мозг — регуляция дыхания, сердечной деятельности, рефлексы (кашель, чихание, глотание)</li>
                            <li>Мост — проводниковая функция</li>
                            <li>Мозжечок — координация движений, равновесие, мышечный тонус</li>
                            <li>Средний мозг — зрительные и слуховые рефлексы</li>
                            <li>Промежуточный мозг (таламус, гипоталамус) — центр регуляции обмена веществ, эмоций</li>
                            <li>Конечный мозг (кора больших полушарий) — высшая нервная деятельность, сознание, мышление</li>
                          </ul>
                          
                          <p className="mt-3"><strong>Периферическая нервная система:</strong></p>
                          <ul className="space-y-1">
                            <li><strong>Соматическая НС</strong> — иннервация скелетных мышц, кожи, связь с внешней средой (произвольные движения)</li>
                            <li><strong>Вегетативная НС</strong> — иннервация внутренних органов, сосудов, желёз (непроизвольная регуляция). Включает симпатическую (активация) и парасимпатическую (торможение) системы</li>
                          </ul>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <Heart className="h-5 w-5 text-rose-500" />
                          Применение знаний анатомии в первой помощи
                        </h3>
                        <div className="bg-gradient-to-r from-rose-500/10 to-rose-500/5 p-4 rounded-lg border-l-4 border-rose-500">
                          <ul className="space-y-2">
                            <li><strong>Понимание расположения органов</strong> позволяет правильно оценить характер травмы и возможные повреждения внутренних структур</li>
                            <li><strong>Знание костей</strong> помогает определить места переломов и правильно наложить шины</li>
                            <li><strong>Понимание кровообращения</strong> необходимо для правильной остановки кровотечений и выбора точек прижатия артерий</li>
                            <li><strong>Знание дыхательной системы</strong> критично для обеспечения проходимости дыхательных путей и проведения искусственной вентиляции легких</li>
                            <li><strong>Анатомия ЦНС</strong> важна для оценки неврологического статуса пострадавшего (сознание, рефлексы, чувствительность)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}
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

            <TabsContent value="media" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Медиаматериалы темы
                  </CardTitle>
                  <CardDescription>
                    Дополнительные материалы для изучения темы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {themeMedia.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Медиаматериалы еще не добавлены</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {themeMedia.filter(m => m.media_type === 'image').length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Изображения ({themeMedia.filter(m => m.media_type === 'image').length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {themeMedia
                              .filter(m => m.media_type === 'image')
                              .map((media) => {
                                const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/theme-media/${media.file_path}`;
                                return (
                                  <div key={media.id} className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                                    <img 
                                      src={publicUrl}
                                      alt={media.file_name}
                                      className="w-full h-48 object-cover"
                                    />
                                    <div className="p-3 bg-background">
                                      <p className="text-sm font-medium truncate">{media.file_name}</p>
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-1"
                                          onClick={() => window.open(publicUrl, '_blank')}
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          Открыть
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = publicUrl;
                                            link.download = media.file_name;
                                            link.click();
                                          }}
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {themeMedia.filter(m => m.media_type === 'video').length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            Видео ({themeMedia.filter(m => m.media_type === 'video').length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {themeMedia
                              .filter(m => m.media_type === 'video')
                              .map((media) => {
                                const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/theme-media/${media.file_path}`;
                                return (
                                  <div key={media.id} className="rounded-lg overflow-hidden border">
                                    <video 
                                      controls
                                      className="w-full aspect-video bg-black"
                                      src={publicUrl}
                                    >
                                      Ваш браузер не поддерживает видео.
                                    </video>
                                    <div className="p-3 bg-background">
                                      <p className="text-sm font-medium truncate">{media.file_name}</p>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={() => {
                                          const link = document.createElement('a');
                                          link.href = publicUrl;
                                          link.download = media.file_name;
                                          link.click();
                                        }}
                                      >
                                        <Download className="h-3 w-3 mr-2" />
                                        Скачать
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {themeMedia.filter(m => m.media_type === 'document').length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Документы ({themeMedia.filter(m => m.media_type === 'document').length})
                          </h3>
                          <div className="space-y-2">
                            {themeMedia
                              .filter(m => m.media_type === 'document')
                              .map((media) => {
                                const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/theme-media/${media.file_path}`;
                                return (
                                  <div key={media.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{media.file_name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {media.file_type} • {media.file_size ? `${(media.file_size / 1024).toFixed(1)} KB` : 'Размер неизвестен'}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(publicUrl, '_blank')}
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Открыть
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const link = document.createElement('a');
                                          link.href = publicUrl;
                                          link.download = media.file_name;
                                          link.click();
                                        }}
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
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