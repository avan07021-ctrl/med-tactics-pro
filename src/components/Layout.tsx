import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Cross, LogOut, BookOpen, ClipboardList, Settings, BarChart3 } from "lucide-react";
import { VRButton } from "@/components/VRButton";
import avangardLogo from "@/assets/avangard-logo.jpg";

interface LayoutProps {
  children: ReactNode;
  user?: any;
  isAdmin?: boolean;
}

export const Layout = ({ children, user, isAdmin }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из системы",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={user ? "/themes" : "/"} className="flex items-center gap-3 hover-scale">
              <img src={avangardLogo} alt="Авангард" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Тактическая Медицина</h1>
                <p className="text-xs text-muted-foreground">ОСЛ «Авангард»</p>
              </div>
            </Link>
            
            {user && (
              <nav className="flex items-center gap-4">
                <VRButton />
                <Link to="/themes">
                  <Button variant="ghost" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Темы
                  </Button>
                </Link>
                <Link to="/tests">
                  <Button variant="ghost" size="sm">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Тесты
                  </Button>
                </Link>
                <Link to="/statistics">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Статистика
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Админ
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выход
                </Button>
              </nav>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="mt-16 border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Платформа тактической медицины. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};