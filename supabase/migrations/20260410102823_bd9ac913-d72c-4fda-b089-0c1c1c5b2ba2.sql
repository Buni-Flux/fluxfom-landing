-- Brand profiles table
CREATE TABLE public.brand_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.cms_submissions(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  is_current BOOLEAN NOT NULL DEFAULT false,
  strategy JSONB NOT NULL DEFAULT '{}'::jsonb,
  voice JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_response TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: only one current profile per submission
CREATE UNIQUE INDEX idx_brand_profiles_current 
  ON public.brand_profiles (submission_id) 
  WHERE is_current = true;

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_brand_profiles"
  ON public.brand_profiles FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to ensure only one is_current per submission
CREATE OR REPLACE FUNCTION public.set_brand_profile_current()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE public.brand_profiles 
    SET is_current = false 
    WHERE submission_id = NEW.submission_id 
      AND id != NEW.id 
      AND is_current = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_single_current_profile
  BEFORE INSERT OR UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_brand_profile_current();

-- Brand documents table
CREATE TABLE public.brand_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_profile_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_brand_documents"
  ON public.brand_documents FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_brand_documents_updated_at
  BEFORE UPDATE ON public.brand_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();