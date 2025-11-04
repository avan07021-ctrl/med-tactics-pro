import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, FileImage, FileText, Video, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MediaUploadProps {
  themes: any[];
}

export function MediaUpload({ themes }: MediaUploadProps) {
  const { toast } = useToast();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedThemeId) {
      fetchMedia();
    }
  }, [selectedThemeId]);

  const fetchMedia = async () => {
    if (!selectedThemeId) return;

    const { data, error } = await supabase
      .from("theme_media")
      .select("*")
      .eq("theme_id", selectedThemeId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      setMediaFiles(data || []);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedThemeId) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Выберите тему",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Determine media type
      let mediaType = "document";
      if (file.type.startsWith("image/")) {
        mediaType = "image";
      } else if (file.type.startsWith("video/")) {
        mediaType = "video";
      }

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedThemeId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("theme-media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("theme-media")
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from("theme_media")
        .insert({
          theme_id: selectedThemeId,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
          media_type: mediaType,
        });

      if (dbError) throw dbError;

      toast({
        title: "Успешно",
        description: "Файл загружен",
      });

      fetchMedia();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const deleteMedia = async (media: any) => {
    if (!confirm("Удалить этот файл?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("theme-media")
        .remove([media.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("theme_media")
        .delete()
        .eq("id", media.id);

      if (dbError) throw dbError;

      toast({
        title: "Успешно",
        description: "Файл удален",
      });

      fetchMedia();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getPublicUrl = (filePath: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from("theme-media")
      .getPublicUrl(filePath);
    return publicUrl;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Загрузка медиаматериалов</CardTitle>
          <CardDescription>
            Добавьте картинки, документы и видео к темам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Выберите тему</Label>
            <Select
              value={selectedThemeId?.toString() || ""}
              onValueChange={(value) => setSelectedThemeId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id.toString()}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedThemeId && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Загрузить файл</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button disabled={uploading}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Поддерживаются: изображения, видео, PDF, Word, PowerPoint
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedThemeId && mediaFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Загруженные файлы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mediaFiles.map((media) => (
                <div
                  key={media.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getMediaIcon(media.media_type)}
                    <div>
                      <p className="font-medium text-sm">{media.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(media.file_size / 1024).toFixed(0)} KB • {media.media_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getPublicUrl(media.file_path), "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMedia(media)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
