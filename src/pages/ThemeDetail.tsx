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
import arterialPressurePoints from "@/assets/arterial-pressure-points.png";

import skeletonFrontImg from "@/assets/anatomy-skeleton-front.jpg";
import skeletonBackImg from "@/assets/anatomy-skeleton-back.jpg";
import boneStructureImg from "@/assets/anatomy-bone-structure.jpg";
import respiratorySystemImg from "@/assets/anatomy-respiratory-system.jpg";
import circulatorySystemImg from "@/assets/anatomy-circulatory-system.jpg";
import urinarySystemImg from "@/assets/anatomy-urinary-system.jpg";
import brainImg from "@/assets/anatomy-brain.jpg";
import kulakBarinYellowZone from "@/assets/kulak-barin-yellow-zone.jpg";
import kulakBarinEvacuation from "@/assets/kulak-barin-evacuation.jpg";
import kulakBarinPreventableLosses from "@/assets/kulak-barin-preventable-losses.jpg";
import kulakBarinOrder760 from "@/assets/kulak-barin-order-760.jpg";
import kulakBarinTacticalZones from "@/assets/kulak-barin-tactical-zones.jpg";
import kulakBarinAlgorithm from "@/assets/kulak-barin-algorithm.jpg";
import kulakBarinMedhelp from "@/assets/kulak-barin-medhelp.jpg";
import kulakBarinTourniquetHand from "@/assets/kulak-barin-tourniquet-hand.jpg";
import kulakBarinTourniquetLeg from "@/assets/kulak-barin-tourniquet-leg.jpg";
import kulakBarinMassiveBleeding from "@/assets/kulak-barin-massive-bleeding.jpg";
import airwayTongueCollapse from "@/assets/airway-tongue-collapse.jpg";
import airwayRecoveryPosition1 from "@/assets/airway-recovery-position-1.jpg";
import airwayRecoveryPosition2 from "@/assets/airway-recovery-position-2.jpg";
import airwayRecoveryPosition3 from "@/assets/airway-recovery-position-3.jpg";
import airwayOropharyngeal1 from "@/assets/airway-oropharyngeal-1.jpg";
import airwayOropharyngeal2 from "@/assets/airway-oropharyngeal-2.jpg";
import airwayNasal1 from "@/assets/airway-nasal-1.jpg";
import airwayNasal2 from "@/assets/airway-nasal-2.jpg";
import airwayNasal3 from "@/assets/airway-nasal-3.jpg";
import airwayNasal4 from "@/assets/airway-nasal-4.jpg";
import airwayIgel1 from "@/assets/airway-igel-1.jpg";
import airwayIgel2 from "@/assets/airway-igel-2.jpg";
import airwayCricothyrotomy1 from "@/assets/airway-cricothyrotomy-1.jpg";
import airwayCricothyrotomy2 from "@/assets/airway-cricothyrotomy-2.jpg";
import airwayCricothyrotomy3 from "@/assets/airway-cricothyrotomy-3.jpg";
import cprCheckBreathing from "@/assets/cpr-check-breathing.jpg";
import cprPrecardialPoint from "@/assets/cpr-precardial-point.jpg";
import cprAlgorithm1 from "@/assets/cpr-algorithm-1.jpg";
import cprAlgorithm2 from "@/assets/cpr-algorithm-2.jpg";
import cprAlgorithm3 from "@/assets/cpr-algorithm-3.jpg";
import cprAlgorithm4 from "@/assets/cpr-algorithm-4.jpg";
import cprHandPosition from "@/assets/cpr-hand-position.jpg";
import cprSafarManeuver from "@/assets/cpr-safar-maneuver.jpg";
import cprBreathControl from "@/assets/cpr-breath-control.jpg";
import cprEffectivenessCheck from "@/assets/cpr-effectiveness-check.jpg";
import cprRecoveryPosition from "@/assets/cpr-recovery-position.jpg";
import cprTeamPosition from "@/assets/cpr-team-position.jpg";
import cprTeamIvl from "@/assets/cpr-team-ivl.jpg";
import cprAmbuBag1 from "@/assets/cpr-ambu-bag-1.jpg";
import cprAmbuBag2 from "@/assets/cpr-ambu-bag-2.jpg";
import cprAed1 from "@/assets/cpr-aed-1.jpg";
import cprAed2 from "@/assets/cpr-aed-2.jpg";
import cprAedUse from "@/assets/cpr-aed-use.jpg";
import cprAutopulse from "@/assets/cpr-autopulse.jpg";
import cprAssistantDevices from "@/assets/cpr-assistant-devices.jpg";
import pneumothoraxClosed1 from "@/assets/pneumothorax-closed-1.jpg";
import pneumothoraxClosed2 from "@/assets/pneumothorax-closed-2.jpg";
import pneumothoraxPosition1 from "@/assets/pneumothorax-position-1.jpg";
import pneumothoraxPosition2 from "@/assets/pneumothorax-position-2.jpg";
import pneumothoraxTension from "@/assets/pneumothorax-tension.jpg";
import pneumothoraxDecompression1 from "@/assets/pneumothorax-decompression-1.jpg";
import pneumothoraxDecompression2 from "@/assets/pneumothorax-decompression-2.jpg";
import pneumothoraxSeal1 from "@/assets/pneumothorax-seal-1.jpg";
import pneumothoraxSeal2 from "@/assets/pneumothorax-seal-2.jpg";
import pneumothoraxSeal3 from "@/assets/pneumothorax-seal-3.jpg";
import pneumothoraxSeal4 from "@/assets/pneumothorax-seal-4.jpg";
import pneumothoraxSeal5 from "@/assets/pneumothorax-seal-5.jpg";
import pneumothoraxSeal6 from "@/assets/pneumothorax-seal-6.jpg";
import pneumothoraxImprovisedSeal1 from "@/assets/pneumothorax-improvised-seal-1.jpg";
import pneumothoraxImprovisedSeal2 from "@/assets/pneumothorax-improvised-seal-2.jpg";
import chestBrokenRibs1 from "@/assets/chest-broken-ribs-1.jpg";
import chestBrokenRibs2 from "@/assets/chest-broken-ribs-2.jpg";
import chestFlail1 from "@/assets/chest-flail-1.jpg";
import chestFlail2 from "@/assets/chest-flail-2.jpg";
import chestFlail3 from "@/assets/chest-flail-3.jpg";
import chestBandage1 from "@/assets/chest-bandage-1.jpg";
import chestBandage2 from "@/assets/chest-bandage-2.jpg";
import chestBandage3 from "@/assets/chest-bandage-3.jpg";
import desmurgyMaterials1 from "@/assets/desmurgy-materials-1.jpg";
import desmurgyMaterials2 from "@/assets/desmurgy-materials-2.jpg";
import desmurgyMaterials3 from "@/assets/desmurgy-materials-3.jpg";
import desmurgyTechnique1 from "@/assets/desmurgy-technique-1.jpg";
import desmurgyTechnique2 from "@/assets/desmurgy-technique-2.jpg";
import desmurgyNeck1 from "@/assets/desmurgy-neck-1.jpg";
import desmurgyNeck2 from "@/assets/desmurgy-neck-2.jpg";
import desmurgyNeck3 from "@/assets/desmurgy-neck-3.jpg";
import desmurgyNeck4 from "@/assets/desmurgy-neck-4.jpg";
import desmurgyNeck5 from "@/assets/desmurgy-neck-5.jpg";
import desmurgyNeck6 from "@/assets/desmurgy-neck-6.jpg";
import desmurgyNeck7 from "@/assets/desmurgy-neck-7.jpg";
import desmurgyNeck8 from "@/assets/desmurgy-neck-8.jpg";
import desmurgyNeck9 from "@/assets/desmurgy-neck-9.jpg";
import desmurgyNeck10 from "@/assets/desmurgy-neck-10.jpg";
import desmurgyHead1 from "@/assets/desmurgy-head-1.jpg";
import desmurgyHead2 from "@/assets/desmurgy-head-2.jpg";
import desmurgyHead3 from "@/assets/desmurgy-head-3.jpg";
import desmurgyHead4 from "@/assets/desmurgy-head-4.jpg";
import desmurgyHead5 from "@/assets/desmurgy-head-5.jpg";
import desmurgyHead6 from "@/assets/desmurgy-head-6.jpg";
import desmurgyStump1 from "@/assets/desmurgy-stump-1.jpg";
import desmurgyStump2 from "@/assets/desmurgy-stump-2.jpg";
import desmurgyStump3 from "@/assets/desmurgy-stump-3.jpg";
import desmurgyShoulder1 from "@/assets/desmurgy-shoulder-1.jpg";
import desmurgyShoulder2 from "@/assets/desmurgy-shoulder-2.jpg";
import desmurgyShoulder3 from "@/assets/desmurgy-shoulder-3.jpg";
import desmurgyAxilla1 from "@/assets/desmurgy-axilla-1.jpg";
import desmurgyAxilla2 from "@/assets/desmurgy-axilla-2.jpg";
import desmurgyAxilla3 from "@/assets/desmurgy-axilla-3.jpg";
import transportStretcher1 from "@/assets/transport-stretcher-1.jpg";
import transportStretcher2 from "@/assets/transport-stretcher-2.jpg";
import transportSafetyRope from "@/assets/transport-safety-rope.jpg";
import transportHelicopterLift1 from "@/assets/transport-helicopter-lift-1.jpg";
import transportHelicopterLift2 from "@/assets/transport-helicopter-lift-2.jpg";
import transportHelicopterLift3 from "@/assets/transport-helicopter-lift-3.jpg";
import transportVehicle1 from "@/assets/transport-vehicle-1.jpg";
import transportVehicle2 from "@/assets/transport-vehicle-2.jpg";
import transportVehicle3 from "@/assets/transport-vehicle-3.jpg";
import transportVehicle4 from "@/assets/transport-vehicle-4.jpg";
import traumaBrokenRibs from "@/assets/trauma-broken-ribs.jpg";
import traumaFlailChest1 from "@/assets/trauma-flail-chest-1.jpg";
import traumaFlailChest2 from "@/assets/trauma-flail-chest-2.jpg";
import traumaChestBandageTechnique from "@/assets/trauma-chest-bandage-technique.jpg";
import traumaAmbuBag from "@/assets/trauma-ambu-bag.jpg";
import traumaShockVolume from "@/assets/trauma-shock-volume.jpg";
import traumaObstructiveShock from "@/assets/trauma-obstructive-shock.jpg";
import traumaVesselCapacity from "@/assets/trauma-vessel-capacity.jpg";
import traumaNoPulse from "@/assets/trauma-no-pulse.jpg";
import traumaCapillaryRefill from "@/assets/trauma-capillary-refill.jpg";
import traumaSyringeTube from "@/assets/trauma-syringe-tube.jpg";
import traumaIvCatheter1 from "@/assets/trauma-iv-catheter-1.jpg";
import traumaIvCatheter2 from "@/assets/trauma-iv-catheter-2.jpg";
import traumaIoAccessPoints from "@/assets/trauma-io-access-points.jpg";
import traumaIoMainPoints from "@/assets/trauma-io-main-points.jpg";
import hypothermiaClassification from "@/assets/hypothermia-classification.jpg";
import burnsDegrees from "@/assets/burns-degrees.jpg";
import burnsFirstAid from "@/assets/burns-first-aid.jpg";
import electricalInjuryMarks from "@/assets/electrical-injury-marks.jpg";
import electricalLoops from "@/assets/electrical-loops.jpg";
import precardialStrike1 from "@/assets/precardial-strike-1.jpg";
import precardialStrike2 from "@/assets/precardial-strike-2.jpg";
import precardialStrike3 from "@/assets/precardial-strike-3.jpg";
import defibrillation from "@/assets/defibrillation.jpg";

const themeImages: Record<number, string> = {
  1: anatomyImage,
  2: skeletonImage,
  3: arterialPressurePoints,
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
                  {themeImages[theme.id] && theme.id !== 2 && (
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

                      {theme.id === 2 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <img
                                  src={kulakBarinPreventableLosses}
                                  alt="Предотвратимые потери"
                                  className="w-full h-auto rounded-lg"
                                />
                                <p className="text-sm text-center text-muted-foreground mt-2">Предотвратимые потери</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <img
                                  src={kulakBarinOrder760}
                                  alt="Приказ Минобороны №760"
                                  className="w-full h-auto rounded-lg"
                                />
                                <p className="text-sm text-center text-muted-foreground mt-2">Приказ Минобороны №760</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <img
                                  src={kulakBarinTacticalZones}
                                  alt="Условные тактические зоны"
                                  className="w-full h-auto rounded-lg"
                                />
                                <p className="text-sm text-center text-muted-foreground mt-2">Условные тактические зоны</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <img
                                  src={kulakBarinYellowZone}
                                  alt="Помощь в желтой зоне"
                                  className="w-full h-auto rounded-lg"
                                />
                                <p className="text-sm text-center text-muted-foreground mt-2">Помощь в желтой зоне - алгоритм КУЛАК БАРИН</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <img
                                  src={kulakBarinEvacuation}
                                  alt="Эвакуация раненых"
                                  className="w-full h-auto rounded-lg"
                                />
                                <p className="text-sm text-center text-muted-foreground mt-2">Эвакуация раненых</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
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

                      {theme.id === 4 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Западение языка</h4>
                                <img
                                  src={airwayTongueCollapse}
                                  alt="Западение языка"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Перемещение раненого в устойчивое положение</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={airwayRecoveryPosition1}
                                    alt="Перемещение раненого - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayRecoveryPosition2}
                                    alt="Перемещение раненого - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayRecoveryPosition3}
                                    alt="Перемещение раненого - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Орофарингеальный воздуховод</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={airwayOropharyngeal1}
                                    alt="Орофарингеальный воздуховод - 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayOropharyngeal2}
                                    alt="Орофарингеальный воздуховод - 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Назальный воздуховод</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={airwayNasal1}
                                    alt="Назальный воздуховод - 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayNasal2}
                                    alt="Назальный воздуховод - 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayNasal3}
                                    alt="Назальный воздуховод - 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayNasal4}
                                    alt="Назальный воздуховод - 4"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Установка ларингеальной маски I-Gel</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={airwayIgel1}
                                    alt="Ларингеальная маска I-Gel - 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayIgel2}
                                    alt="Ларингеальная маска I-Gel - 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Алгоритм коникотомии</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={airwayCricothyrotomy1}
                                    alt="Коникотомия - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayCricothyrotomy2}
                                    alt="Коникотомия - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={airwayCricothyrotomy3}
                                    alt="Коникотомия - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 5 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Проверка дыхания и пульса</h4>
                                <img
                                  src={cprCheckBreathing}
                                  alt="Проверка дыхания и пульса"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Точка прекардиального удара</h4>
                                <img
                                  src={cprPrecardialPoint}
                                  alt="Точка прекардиального удара"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Алгоритм СЛР</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={cprAlgorithm1}
                                    alt="Алгоритм СЛР - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={cprAlgorithm2}
                                    alt="Алгоритм СЛР - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={cprAlgorithm3}
                                    alt="Алгоритм СЛР - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={cprAlgorithm4}
                                    alt="Алгоритм СЛР - этап 4"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Положение рук и точка СЛР</h4>
                                <img
                                  src={cprHandPosition}
                                  alt="Положение рук и точка СЛР"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Прием Сафара (обеспечение проходимости дыхательных путей)</h4>
                                <img
                                  src={cprSafarManeuver}
                                  alt="Прием Сафара"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Контроль движения грудной клетки при ИВЛ</h4>
                                <img
                                  src={cprBreathControl}
                                  alt="Контроль движения грудной клетки"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Контроль эффективности реанимации</h4>
                                <img
                                  src={cprEffectivenessCheck}
                                  alt="Контроль эффективности"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Восстановительное положение</h4>
                                <img
                                  src={cprRecoveryPosition}
                                  alt="Восстановительное положение"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Расположение команды при СЛР</h4>
                                <img
                                  src={cprTeamPosition}
                                  alt="Расположение команды"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Расположение команды при ИВЛ</h4>
                                <img
                                  src={cprTeamIvl}
                                  alt="Расположение команды при ИВЛ"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Применение дыхательного мешка АМБУ</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={cprAmbuBag1}
                                    alt="Дыхательный мешок АМБУ - вариант 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={cprAmbuBag2}
                                    alt="Дыхательный мешок АМБУ - вариант 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Автоматический наружный дефибриллятор (АНД)</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={cprAed1}
                                    alt="АНД - наложение электродов"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={cprAed2}
                                    alt="АНД - подключение"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Использование АНД</h4>
                                <img
                                  src={cprAedUse}
                                  alt="Использование АНД"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Аппарат автоматической СЛР - AutoPulse</h4>
                                <img
                                  src={cprAutopulse}
                                  alt="AutoPulse"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Ассистенты СЛР (контроль эффективности)</h4>
                                <img
                                  src={cprAssistantDevices}
                                  alt="Ассистенты СЛР"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 6 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Закрытый пневмоторакс</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={pneumothoraxClosed1}
                                    alt="Закрытый пневмоторакс - схема 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxClosed2}
                                    alt="Закрытый пневмоторакс - схема 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Положения для иммобилизации при пневмотораксе</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={pneumothoraxPosition1}
                                    alt="Положение полусидя"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxPosition2}
                                    alt="Положение на поврежденном боку"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Напряженный (клапанный) пневмоторакс</h4>
                                <img
                                  src={pneumothoraxTension}
                                  alt="Напряженный пневмоторакс"
                                  className="w-full h-auto rounded-lg"
                                />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Декомпрессия специальной иглой</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={pneumothoraxDecompression1}
                                    alt="Точки декомпрессии"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxDecompression2}
                                    alt="Техника декомпрессии"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Окклюзионные заклейки (штатные средства)</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={pneumothoraxSeal1}
                                    alt="Окклюзионная заклейка - тип 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxSeal2}
                                    alt="Окклюзионная заклейка - тип 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxSeal3}
                                    alt="Окклюзионная заклейка - тип 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxSeal4}
                                    alt="Окклюзионная заклейка - тип 4"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxSeal5}
                                    alt="Окклюзионная заклейка - тип 5"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxSeal6}
                                    alt="Окклюзионная заклейка - тип 6"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Подручные средства герметизации</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={pneumothoraxImprovisedSeal1}
                                    alt="Пленка с пластырем - вариант 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={pneumothoraxImprovisedSeal2}
                                    alt="Пленка с пластырем - вариант 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Повреждения грудного каркаса</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={chestBrokenRibs1}
                                    alt="Сломанные ребра - схема 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={chestBrokenRibs2}
                                    alt="Сломанные ребра - схема 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Реберный клапан (флотация грудной клетки)</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={chestFlail1}
                                    alt="Реберный клапан - механизм"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={chestFlail2}
                                    alt="Реберный клапан - патофизиология"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={chestFlail3}
                                    alt="Реберный клапан - диагностика"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Наложение тугой повязки при переломах ребер</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={chestBandage1}
                                    alt="Тугая повязка - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={chestBandage2}
                                    alt="Тугая повязка - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={chestBandage3}
                                    alt="Тугая повязка - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 7 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Перевязочные материалы</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={desmurgyMaterials1}
                                    alt="Перевязочные материалы - бинты"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyMaterials2}
                                    alt="Перевязочный пакет"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyMaterials3}
                                    alt="Подручные средства"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Техника наложения повязок</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img
                                    src={desmurgyTechnique1}
                                    alt="Правильное натяжение бинта"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyTechnique2}
                                    alt="Закрепление повязки"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Бандаж на рану шеи (пошаговый алгоритм)</h4>
                                <div className="grid md:grid-cols-5 gap-2">
                                  <img
                                    src={desmurgyNeck1}
                                    alt="Бандаж на шею - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck2}
                                    alt="Бандаж на шею - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck3}
                                    alt="Бандаж на шею - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck4}
                                    alt="Бандаж на шею - этап 4"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck5}
                                    alt="Бандаж на шею - этап 5"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck6}
                                    alt="Бандаж на шею - этап 6"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck7}
                                    alt="Бандаж на шею - этап 7"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck8}
                                    alt="Бандаж на шею - этап 8"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck9}
                                    alt="Бандаж на шею - этап 9"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyNeck10}
                                    alt="Бандаж на шею - этап 10"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Бандаж на голове (алгоритм)</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={desmurgyHead1}
                                    alt="Бандаж на голову - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyHead2}
                                    alt="Бандаж на голову - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyHead3}
                                    alt="Бандаж на голову - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyHead4}
                                    alt="Бандаж на голову - этап 4"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyHead5}
                                    alt="Бандаж на голову - этап 5"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyHead6}
                                    alt="Бандаж на голову - этап 6"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Бандаж на культе конечности</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={desmurgyStump1}
                                    alt="Бандаж на культю - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyStump2}
                                    alt="Бандаж на культю - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyStump3}
                                    alt="Бандаж на культю - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Бандаж на плече</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={desmurgyShoulder1}
                                    alt="Бандаж на плечо - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyShoulder2}
                                    alt="Бандаж на плечо - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyShoulder3}
                                    alt="Бандаж на плечо - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Бандаж в области подмышечной впадины</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img
                                    src={desmurgyAxilla1}
                                    alt="Бандаж подмышечной впадины - этап 1"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyAxilla2}
                                    alt="Бандаж подмышечной впадины - этап 2"
                                    className="w-full h-auto rounded-lg"
                                  />
                                  <img
                                    src={desmurgyAxilla3}
                                    alt="Бандаж подмышечной впадины - этап 3"
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 8 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Виды подвесных носилок</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img src={transportStretcher1} alt="Подвесные носилки тип 1" className="w-full h-auto rounded-lg" />
                                  <img src={transportStretcher2} alt="Подвесные носилки тип 2" className="w-full h-auto rounded-lg" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Использование страховочной веревки</h4>
                                <img src={transportSafetyRope} alt="Страховочная веревка" className="w-full h-auto rounded-lg" />
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Подъем раненого в сопровождении спасателя</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <img src={transportHelicopterLift1} alt="Подъем на вертолет - этап 1" className="w-full h-auto rounded-lg" />
                                  <img src={transportHelicopterLift2} alt="Подъем на вертолет - этап 2" className="w-full h-auto rounded-lg" />
                                  <img src={transportHelicopterLift3} alt="Подъем на вертолет - этап 3" className="w-full h-auto rounded-lg" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Размещение раненого в автомобилях</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img src={transportVehicle1} alt="Размещение в СТС Тигр" className="w-full h-auto rounded-lg" />
                                  <img src={transportVehicle2} alt="Размещение в Toyota Hilux" className="w-full h-auto rounded-lg" />
                                  <img src={transportVehicle3} alt="Размещение в кузове КамАЗ" className="w-full h-auto rounded-lg" />
                                  <img src={transportVehicle4} alt="Погрузка раненого" className="w-full h-auto rounded-lg" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 9 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Повреждения грудного каркаса</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Сломанные ребра</p>
                                    <img src={traumaBrokenRibs} alt="Сломанные ребра" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Наложение тугой повязки</p>
                                    <img src={traumaChestBandageTechnique} alt="Наложение тугой повязки" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Реберный клапан (флотация)</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img src={traumaFlailChest1} alt="Флотация грудной клетки - вдох" className="w-full h-auto rounded-lg" />
                                  <img src={traumaFlailChest2} alt="Флотация грудной клетки - выдох" className="w-full h-auto rounded-lg" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Виды шока</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Объем vs емкость</p>
                                    <img src={traumaShockVolume} alt="Объем циркулирующей крови" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Обструктивный шок</p>
                                    <img src={traumaObstructiveShock} alt="Обструктивный шок" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Емкость сосудов</p>
                                    <img src={traumaVesselCapacity} alt="Емкость сосудистого русла" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Критерии шока</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Отсутствие пульса</p>
                                    <img src={traumaNoPulse} alt="Отсутствие периферического пульса" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Капиллярное наполнение</p>
                                    <img src={traumaCapillaryRefill} alt="Капиллярное наполнение" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Обезболивание и введение препаратов</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Мешок АМБУ</p>
                                    <img src={traumaAmbuBag} alt="Мешок АМБУ" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Шприц-тюбик</p>
                                    <img src={traumaSyringeTube} alt="Шприц-тюбик с промедолом" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Периферические венозные катетеры</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <img src={traumaIvCatheter1} alt="Виды венозных катетеров" className="w-full h-auto rounded-lg" />
                                  <img src={traumaIvCatheter2} alt="Цветовая маркировка катетеров" className="w-full h-auto rounded-lg" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Внутрикостный доступ</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Все точки доступа</p>
                                    <img src={traumaIoAccessPoints} alt="Семь точек внутрикостного доступа" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Основные точки</p>
                                    <img src={traumaIoMainPoints} alt="Основные точки внутрикостного доступа" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 10 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Классификация гипотермии</h4>
                                <img src={hypothermiaClassification} alt="Классификация гипотермии по степени тяжести" className="w-full h-auto rounded-lg" />
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 11 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Степени ожогов</h4>
                                <img src={burnsDegrees} alt="Классификация ожогов по степени тяжести" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">I-IV степени ожогов</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Первая помощь при ожогах</h4>
                                <img src={burnsFirstAid} alt="Алгоритм оказания первой помощи при ожогах" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Алгоритм действий при термических ожогах</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Электротравма</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Знаки тока при электротравме</p>
                                    <img src={electricalInjuryMarks} alt="Знаки тока на коже" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Электрические петли</p>
                                    <img src={electricalLoops} alt="Виды электрических петель" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Прекардиальный удар</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Проверка пульса</p>
                                    <img src={precardialStrike1} alt="Проверка пульса на сонной артерии" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Подъем ног</p>
                                    <img src={precardialStrike2} alt="Подъем ног пострадавшего" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Техника удара</p>
                                    <img src={precardialStrike3} alt="Техника прекардиального удара" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">При остановке сердца - нанести короткий резкий удар в точку на грудине</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Дефибрилляция</h4>
                                <img src={defibrillation} alt="Методика проведения электрической дефибрилляции" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Правильное размещение электродов дефибриллятора</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {theme.id === 12 && (
                        <div className="mt-8 space-y-6">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Иллюстрации к теме
                          </h3>
                          
                          <div className="space-y-4">
                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Тактические зоны</h4>
                                <img src={kulakBarinTacticalZones} alt="Условные тактические зоны оказания помощи" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Красная, желтая и зеленая зоны</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Помощь в желтой зоне</h4>
                                <img src={kulakBarinYellowZone} alt="Алгоритм помощи в желтой зоне" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Алгоритм КУЛАК БАРИН</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Протокол MARCH PAWS</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Алгоритм действий</p>
                                    <img src={kulakBarinAlgorithm} alt="Алгоритм MARCH PAWS" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Медицинская помощь</p>
                                    <img src={kulakBarinMedhelp} alt="Порядок оказания медицинской помощи" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Наложение жгута</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Наложение на руку</p>
                                    <img src={kulakBarinTourniquetHand} alt="Техника наложения жгута на руку" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Наложение на ногу</p>
                                    <img src={kulakBarinTourniquetLeg} alt="Техника наложения жгута на ногу" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Накладывать максимально высоко: на руке под дельтовидную мышцу, на ноге под паховую складку</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Массивное кровотечение</h4>
                                <img src={kulakBarinMassiveBleeding} alt="Остановка массивного кровотечения" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Техника остановки кровотечения из крупных сосудов</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Эвакуация пострадавших</h4>
                                <img src={kulakBarinEvacuation} alt="Способы эвакуации раненых" className="w-full h-auto rounded-lg" />
                                <p className="text-sm text-muted-foreground mt-2">Безопасные способы перемещения пострадавших</p>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Предотвратимые потери</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <img src={kulakBarinPreventableLosses} alt="Предотвратимые потери в боевых действиях" className="w-full h-auto rounded-lg" />
                                  </div>
                                  <div>
                                    <img src={kulakBarinOrder760} alt="Приказ Минобороны №760" className="w-full h-auto rounded-lg" />
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Анализ предотвратимых потерь и нормативная база</p>
                              </CardContent>
                            </Card>
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