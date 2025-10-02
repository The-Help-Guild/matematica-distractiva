-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (length(display_name) >= 2 AND length(display_name) <= 50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view all profiles (for leaderboard)
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to exercise_history
ALTER TABLE public.exercise_history 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_exercise_history_user_id ON public.exercise_history(user_id);

-- Add user_id to daily_scores
ALTER TABLE public.daily_scores 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_daily_scores_user_id ON public.daily_scores(user_id);

-- Update exercise_history RLS policies
DROP POLICY IF EXISTS "Users can view their own history" ON public.exercise_history;
DROP POLICY IF EXISTS "Anyone can insert their own history" ON public.exercise_history;

CREATE POLICY "Users can view own history"
ON public.exercise_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own history"
ON public.exercise_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Update daily_scores RLS policies
DROP POLICY IF EXISTS "Users can view their own scores" ON public.daily_scores;
DROP POLICY IF EXISTS "Users can insert their own scores" ON public.daily_scores;
DROP POLICY IF EXISTS "Users can update their own scores" ON public.daily_scores;

CREATE POLICY "Users can view own scores"
ON public.daily_scores FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scores"
ON public.daily_scores FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own scores"
ON public.daily_scores FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Update leaderboard function to use profiles
CREATE OR REPLACE FUNCTION public.get_daily_top_scores(score_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(user_name text, score integer, date date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.display_name, ds.score, ds.date
  FROM public.daily_scores ds
  JOIN public.profiles p ON ds.user_id = p.id
  WHERE ds.date = score_date
  ORDER BY ds.score DESC
  LIMIT 3;
$$;