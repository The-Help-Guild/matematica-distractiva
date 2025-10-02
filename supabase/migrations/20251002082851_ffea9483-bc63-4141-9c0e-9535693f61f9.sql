-- Fix exercise_history SELECT policy - restrict to own records only
DROP POLICY IF EXISTS "Anyone can view their own history" ON public.exercise_history;

CREATE POLICY "Users can view their own history"
ON public.exercise_history
FOR SELECT
USING (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' 
       OR user_name = current_setting('app.current_user_name', true));

-- Fix daily_scores INSERT policy - restrict to own username only
DROP POLICY IF EXISTS "Anyone can insert their own score" ON public.daily_scores;

CREATE POLICY "Users can insert their own scores"
ON public.daily_scores
FOR INSERT
WITH CHECK (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' 
            OR user_name = current_setting('app.current_user_name', true));

-- Fix daily_scores UPDATE policy - restrict to own records only
DROP POLICY IF EXISTS "Users can update their own scores" ON public.daily_scores;

CREATE POLICY "Users can update their own scores"
ON public.daily_scores
FOR UPDATE
USING (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' 
       OR user_name = current_setting('app.current_user_name', true))
WITH CHECK (user_name = current_setting('request.jwt.claims', true)::json->>'user_name' 
            OR user_name = current_setting('app.current_user_name', true));