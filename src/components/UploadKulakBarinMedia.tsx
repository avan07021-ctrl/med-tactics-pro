import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

// Import images
import kulakBarinAlgorithm from '@/assets/kulak-barin-algorithm.jpg';
import kulakBarinTourniquetHand from '@/assets/kulak-barin-tourniquet-hand.jpg';
import kulakBarinTourniquetLeg from '@/assets/kulak-barin-tourniquet-leg.jpg';
import kulakBarinZhgutHand from '@/assets/kulak-barin-zhgut-hand.jpg';
import kulakBarinMassiveBleeding from '@/assets/kulak-barin-massive-bleeding.jpg';
import kulakBarinMedhelp from '@/assets/kulak-barin-medhelp.jpg';

const mediaFiles = [
  {
    name: 'Алгоритм КУЛАК-БАРИН',
    path: kulakBarinAlgorithm,
    fileName: 'kulak-barin-algorithm.jpg'
  },
  {
    name: 'Установка турникета на руке',
    path: kulakBarinTourniquetHand,
    fileName: 'kulak-barin-tourniquet-hand.jpg'
  },
  {
    name: 'Установка турникета на ноге',
    path: kulakBarinTourniquetLeg,
    fileName: 'kulak-barin-tourniquet-leg.jpg'
  },
  {
    name: 'Наложение жгута на руке',
    path: kulakBarinZhgutHand,
    fileName: 'kulak-barin-zhgut-hand.jpg'
  },
  {
    name: 'Массивное кровотечение',
    path: kulakBarinMassiveBleeding,
    fileName: 'kulak-barin-massive-bleeding.jpg'
  },
  {
    name: 'Медицинская помощь',
    path: kulakBarinMedhelp,
    fileName: 'kulak-barin-medhelp.jpg'
  }
];

export const UploadKulakBarinMedia = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const themeId = 2; // ID темы "Универсальный алгоритм ПП и КУЛАК-БАРИН"

  const uploadMedia = async () => {
    setUploading(true);
    try {
      for (const media of mediaFiles) {
        // Fetch the image as blob
        const response = await fetch(media.path);
        const blob = await response.blob();
        
        const filePath = `${themeId}/${Date.now()}-${media.fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('theme-media')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading ${media.name}:`, uploadError);
          continue;
        }

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('theme_media')
          .insert({
            theme_id: themeId,
            file_name: media.name,
            file_path: filePath,
            file_type: 'image/jpeg',
            media_type: 'image',
            file_size: blob.size
          });

        if (dbError) {
          console.error(`Error saving ${media.name} to database:`, dbError);
        }
      }

      toast({
        title: 'Успешно',
        description: 'Все медиаматериалы загружены',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить медиаматериалы',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Загрузить материалы КУЛАК-БАРИН
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Нажмите кнопку для автоматической загрузки {mediaFiles.length} изображений к теме 3
      </p>
      <Button 
        onClick={uploadMedia} 
        disabled={uploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Загрузка...' : 'Загрузить медиаматериалы'}
      </Button>
    </div>
  );
};
