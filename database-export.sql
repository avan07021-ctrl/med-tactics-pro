-- Lovable Medical Training Platform - Database Schema Export
-- Generated for local migration
-- This schema includes all tables, functions, triggers, RLS policies, and storage buckets

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    email text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    role public.app_role DEFAULT 'student'::app_role,
    PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Themes table
CREATE TABLE public.themes (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text,
    content text,
    hours text,
    format text,
    level text,
    order_index integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Test questions table
CREATE TABLE public.test_questions (
    id serial PRIMARY KEY,
    theme_id integer,
    question text NOT NULL,
    option_a text NOT NULL,
    option_b text NOT NULL,
    option_c text NOT NULL,
    option_d text NOT NULL,
    correct_answer text NOT NULL,
    hint text,
    source text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

-- Test results table
CREATE TABLE public.test_results (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    theme_id integer,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    percentage numeric NOT NULL,
    time_spent integer DEFAULT 0,
    passed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- User progress table
CREATE TABLE public.user_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    theme_id integer NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    time_spent integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Theme media table
CREATE TABLE public.theme_media (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    theme_id integer NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size integer,
    media_type text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

ALTER TABLE public.theme_media ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Handle new user registration function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Check user role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Profiles: users can view own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles: users can insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: users can update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles: admins can view all"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Themes policies
CREATE POLICY "Anyone can view themes"
  ON public.themes FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert themes"
  ON public.themes FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update themes"
  ON public.themes FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete themes"
  ON public.themes FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Test questions policies
CREATE POLICY "Anyone can view questions"
  ON public.test_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON public.test_questions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update questions"
  ON public.test_questions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete questions"
  ON public.test_questions FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Test results policies
CREATE POLICY "Users can view own test results"
  ON public.test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own test results"
  ON public.test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all test results"
  ON public.test_results FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Theme media policies
CREATE POLICY "Anyone can view theme media"
  ON public.theme_media FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert theme media"
  ON public.theme_media FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update theme media"
  ON public.theme_media FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete theme media"
  ON public.theme_media FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- STORAGE
-- =====================================================

-- Create storage bucket for theme media
INSERT INTO storage.buckets (id, name, public)
VALUES ('theme-media', 'theme-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for theme-media bucket
CREATE POLICY "Anyone can view theme media files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'theme-media');

CREATE POLICY "Admins can upload theme media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'theme-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update theme media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'theme-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete theme media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'theme-media' AND has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- NOTES FOR LOCAL SETUP
-- =====================================================

-- After running this schema:
-- 1. Export data: pg_dump -h [host] -U postgres -d postgres --data-only --inserts -t public.themes -t public.test_questions > data-export.sql
-- 2. Create first admin: Call create-admin edge function or insert directly into user_roles
-- 3. Export storage files from theme-media bucket manually
-- 4. Configure auth settings (auto-confirm email, etc.)
