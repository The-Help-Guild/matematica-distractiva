-- Clean up orphaned data
DELETE FROM public.exercise_history WHERE user_id IS NULL;
DELETE FROM public.daily_scores WHERE user_id IS NULL;

-- Phase 1: Fix Profile Visibility
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Phase 2: Database Schema Hardening
ALTER TABLE public.daily_scores
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.exercise_history
ALTER COLUMN user_id SET NOT NULL;