-- Create runs table for storing user running data
CREATE TABLE public.runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  distance DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own runs" 
ON public.runs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own runs" 
ON public.runs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own runs" 
ON public.runs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own runs" 
ON public.runs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create goals table for storing user goals
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_distance DECIMAL(5,2),
  target_time INTEGER, -- in seconds
  target_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN NOT NULL DEFAULT false,
  folder_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for goals access
CREATE POLICY "Users can view their own goals" 
ON public.goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create folders table for organizing goals
CREATE TABLE public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Create policies for folders access
CREATE POLICY "Users can view their own folders" 
ON public.folders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" 
ON public.folders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
ON public.folders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
ON public.folders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add foreign key constraint for folder_id in goals table
ALTER TABLE public.goals 
ADD CONSTRAINT fk_goals_folder 
FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE SET NULL;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_runs_updated_at
BEFORE UPDATE ON public.runs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
BEFORE UPDATE ON public.folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();