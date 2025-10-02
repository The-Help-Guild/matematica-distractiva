-- Șterge politica veche care permite tuturor să vadă toate scorurile
DROP POLICY IF EXISTS "Anyone can view daily scores" ON public.daily_scores;

-- Adaugă politică nouă: utilizatorii pot vedea doar propriile scoruri
CREATE POLICY "Users can view their own scores"
ON public.daily_scores
FOR SELECT
USING (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' 
       OR user_name = current_setting('app.current_user_name', true));

-- Creează o funcție publică care returnează doar Top 3 scoruri zilnice
CREATE OR REPLACE FUNCTION public.get_daily_top_scores(score_date date DEFAULT CURRENT_DATE)
RETURNS TABLE (
  user_name text,
  score integer,
  date date
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_name, score, date
  FROM public.daily_scores
  WHERE date = score_date
  ORDER BY score DESC
  LIMIT 3;
$$;

-- Permite tuturor să execute funcția pentru leaderboard
GRANT EXECUTE ON FUNCTION public.get_daily_top_scores TO anon, authenticated;

-- Comentariu: Funcția de mai sus permite afișarea Top 3 pentru leaderboard
-- fără a expune toate datele utilizatorilor