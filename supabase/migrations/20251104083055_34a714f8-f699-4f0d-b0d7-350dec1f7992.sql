-- Create storage bucket for theme media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('theme-media', 'theme-media', true);

-- Create table for theme media files
CREATE TABLE public.theme_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id integer NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  media_type text NOT NULL CHECK (media_type IN ('image', 'document', 'video')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.theme_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for theme_media
CREATE POLICY "Anyone can view theme media"
ON public.theme_media
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert theme media"
ON public.theme_media
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update theme media"
ON public.theme_media
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete theme media"
ON public.theme_media
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for theme-media bucket
CREATE POLICY "Anyone can view theme media files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'theme-media');

CREATE POLICY "Admins can upload theme media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'theme-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update theme media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'theme-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete theme media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'theme-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_theme_media_updated_at
BEFORE UPDATE ON public.theme_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();