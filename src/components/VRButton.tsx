import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export const VRButton = () => {
  const { toast } = useToast();
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);

  useEffect(() => {
    // Check if WebXR is supported
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      }).catch(() => {
        setIsVRSupported(false);
      });
    }
  }, []);

  const toggleVR = async () => {
    if (!navigator.xr) {
      toast({
        variant: "destructive",
        title: "VR не поддерживается",
        description: "Ваш браузер не поддерживает WebXR. Попробуйте использовать Chrome или Edge на VR-устройстве.",
      });
      return;
    }

    try {
      if (!isVRActive) {
        // Enter VR mode
        const session = await navigator.xr.requestSession('immersive-vr', {
          optionalFeatures: ['local-floor', 'bounded-floor']
        });
        
        setIsVRActive(true);
        
        // Apply VR-optimized styles
        document.body.classList.add('vr-mode');
        
        session.addEventListener('end', () => {
          setIsVRActive(false);
          document.body.classList.remove('vr-mode');
          
          toast({
            title: "VR режим завершен",
            description: "Вы вышли из VR режима",
          });
        });

        toast({
          title: "VR режим активирован",
          description: "Используйте контроллеры для навигации",
        });
      }
    } catch (error) {
      console.error('Error entering VR:', error);
      toast({
        variant: "destructive",
        title: "Ошибка VR",
        description: error instanceof Error ? error.message : "Не удалось войти в VR режим",
      });
    }
  };

  if (!isVRSupported) {
    return null;
  }

  return (
    <Button
      variant={isVRActive ? "default" : "outline"}
      size="sm"
      onClick={toggleVR}
      className="gap-2 animate-pulse-glow"
    >
      {isVRActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {isVRActive ? "Выход из VR" : "VR режим"}
    </Button>
  );
};