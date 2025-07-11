-- Create users profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  professional_summary TEXT,
  experience_years INTEGER,
  mbti_type TEXT,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create CV uploads table
CREATE TABLE IF NOT EXISTS cv_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  analysis_status TEXT DEFAULT 'pending',
  analysis_result JSONB,
  skills_extracted TEXT[],
  experience_extracted JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create MBTI test results table
CREATE TABLE IF NOT EXISTS mbti_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  result_type TEXT NOT NULL,
  personality_traits TEXT[],
  career_recommendations TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create job matches table
CREATE TABLE IF NOT EXISTS job_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_match_id UUID REFERENCES job_matches(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, job_match_id)
);

-- Create course recommendations table
CREATE TABLE IF NOT EXISTS course_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  provider TEXT NOT NULL,
  duration TEXT,
  price TEXT,
  rating DECIMAL(2,1),
  relevance_score INTEGER,
  skills_covered TEXT[],
  course_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create skill gaps table
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  current_level INTEGER,
  target_level INTEGER,
  priority TEXT,
  improvement_suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create learning roadmaps table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  roadmap_title TEXT NOT NULL,
  target_role TEXT,
  phases JSONB NOT NULL,
  estimated_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own CV uploads" ON cv_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CV uploads" ON cv_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CV uploads" ON cv_uploads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own MBTI results" ON mbti_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own MBTI results" ON mbti_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own job matches" ON job_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job matches" ON job_matches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own course recommendations" ON course_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own course recommendations" ON course_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own skill gaps" ON skill_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill gaps" ON skill_gaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skill gaps" ON skill_gaps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning roadmaps" ON learning_roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning roadmaps" ON learning_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning roadmaps" ON learning_roadmaps FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
