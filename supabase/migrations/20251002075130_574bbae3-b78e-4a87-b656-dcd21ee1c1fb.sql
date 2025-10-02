-- Create table for daily scores
CREATE TABLE public.daily_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for daily scores (public read, authenticated insert/update)
CREATE POLICY "Anyone can view daily scores" 
ON public.daily_scores 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert their own score" 
ON public.daily_scores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own scores" 
ON public.daily_scores 
FOR UPDATE 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_daily_scores_date ON public.daily_scores(date DESC, score DESC);

-- Create table for exercise history
CREATE TABLE public.exercise_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('subtraction', 'addition')),
  num1 INTEGER NOT NULL,
  num2 INTEGER NOT NULL,
  user_answer INTEGER NOT NULL,
  correct_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exercise_history ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise history
CREATE POLICY "Anyone can view their own history" 
ON public.exercise_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert their own history" 
ON public.exercise_history 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_exercise_history_user ON public.exercise_history(user_name, created_at DESC);