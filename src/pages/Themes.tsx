import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, FileImage, FileText, Video } from "lucide-react";
import bgThemes from "@/assets/bg-themes.jpg";

export default function Themes() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [themeMedia, setThemeMedia] = useState<Record<number, any[]>>({});
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

    const fetchThemes = async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data) {
        setThemes(data);
        
        // Fetch media for all themes
        const { data: mediaData } = await supabase
          .from("theme_media")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (mediaData) {
          const mediaByTheme = mediaData.reduce((acc: Record<number, any[]>, media) => {
            if (!acc[media.theme_id]) {
              acc[media.theme_id] = [];
            }
            acc[media.theme_id].push(media);
            return acc;
          }, {});
          setThemeMedia(mediaByTheme);
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

    fetchThemes();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Layout user={user} isAdmin={profile?.role === "admin"}>
      <div 
        className="max-w-6xl mx-auto bg-cover bg-center rounded-lg p-8 relative"
        style={{ backgroundImage: `url(${bgThemes})` }}
      >
        <div className="absolute inset-0 bg-background/80 rounded-lg" />
        <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Перечень тем</h1>
          <p className="text-muted-foreground">
            Изучите основы тактической медицины и первой помощи
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : themes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                Темы пока не добавлены
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme, index) => (
              <Card 
                key={theme.id} 
                className="card-hover cursor-pointer animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/themes/${theme.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">
                      Тема {index + 1}
                    </Badge>
                    {theme.hours && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {theme.hours}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  {theme.level && (
                    <CardDescription>{theme.level}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {theme.description || theme.content}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    {theme.format && (
                      <Badge variant="secondary">
                        {theme.format}
                      </Badge>
                    )}
                    {themeMedia[theme.id] && themeMedia[theme.id].length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {themeMedia[theme.id].some(m => m.media_type === 'image') && (
                          <div className="flex items-center gap-1">
                            <FileImage className="h-3 w-3" />
                            <span>{themeMedia[theme.id].filter(m => m.media_type === 'image').length}</span>
                          </div>
                        )}
                        {themeMedia[theme.id].some(m => m.media_type === 'video') && (
                          <div className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>{themeMedia[theme.id].filter(m => m.media_type === 'video').length}</span>
                          </div>
                        )}
                        {themeMedia[theme.id].some(m => m.media_type === 'document') && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{themeMedia[theme.id].filter(m => m.media_type === 'document').length}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}