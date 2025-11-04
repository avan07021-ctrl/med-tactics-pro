-- Создание таблицы для отслеживания прогресса пользователей по темам
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme_id INTEGER NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- время в секундах
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, theme_id)
);

-- Создание таблицы для результатов тестов
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme_id INTEGER REFERENCES public.themes(id) ON DELETE SET NULL,
  score INTEGER NOT NULL, -- количество правильных ответов
  total_questions INTEGER NOT NULL, -- общее количество вопросов
  percentage DECIMAL(5,2) NOT NULL, -- процент правильных ответов
  passed BOOLEAN NOT NULL DEFAULT false,
  time_spent INTEGER DEFAULT 0, -- время в секундах
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включение RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Политики для user_progress
CREATE POLICY "Users can view own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" 
ON public.user_progress 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Политики для test_results
CREATE POLICY "Users can view own test results" 
ON public.test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own test results" 
ON public.test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all test results" 
ON public.test_results 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
BEFORE UPDATE ON public.test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Создание индексов для производительности
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_theme_id ON public.user_progress(theme_id);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_theme_id ON public.test_results(theme_id);