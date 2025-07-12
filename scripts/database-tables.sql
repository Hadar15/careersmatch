-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  professional_summary TEXT,
  experience_years INTEGER,
  mbti_type TEXT,
  profile_completion INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_uploads table
CREATE TABLE IF NOT EXISTS public.cv_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  analysis_status TEXT DEFAULT 'pending',
  analysis_result JSONB,
  skills_extracted TEXT[],
  experience_extracted JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mbti_results table
CREATE TABLE IF NOT EXISTS public.mbti_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  result_type TEXT NOT NULL,
  personality_traits TEXT[] NOT NULL,
  career_recommendations TEXT[] NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  job_type TEXT,
  match_percentage INTEGER,
  skills_required TEXT[],
  job_description TEXT,
  external_job_id TEXT,
  source_platform TEXT,
  job_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mbti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- CV uploads policies
CREATE POLICY "Users can view own CV uploads" ON public.cv_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV uploads" ON public.cv_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV uploads" ON public.cv_uploads
  FOR UPDATE USING (auth.uid() = user_id);

-- MBTI results policies
CREATE POLICY "Users can view own MBTI results" ON public.mbti_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MBTI results" ON public.mbti_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Job matches policies
CREATE POLICY "Users can view own job matches" ON public.job_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job matches" ON public.job_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
