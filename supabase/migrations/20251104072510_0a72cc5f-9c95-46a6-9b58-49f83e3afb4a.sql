-- Create user_roles table if it does not exist and set up RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles'
  ) THEN
    CREATE TABLE public.user_roles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      role public.app_role NOT NULL,
      UNIQUE (user_id, role)
    );

    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

    -- Users can view their own roles
    CREATE POLICY "Users can view own roles" ON public.user_roles
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);

    -- Admins can manage roles
    CREATE POLICY "Admins can manage roles" ON public.user_roles
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Ensure has_role uses user_roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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

-- Fix profiles policies to avoid recursive lookups
DROP POLICY IF EXISTS "Profiles: admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: admins can view all " ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can view own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can view own " ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can update own " ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can insert own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users can insert own " ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Recreate clear, non-recursive policies
CREATE POLICY "Profiles: users can view own"
ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Profiles: admins can view all"
ON public.profiles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Profiles: users can insert own"
ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: users can update own"
ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Ensure signup trigger inserts required email to satisfy NOT NULL constraint
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

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
END;
$$;

-- Seed admin roles based on existing profiles.role values
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles
WHERE role = 'admin'::public.app_role
ON CONFLICT DO NOTHING;