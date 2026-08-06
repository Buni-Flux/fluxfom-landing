
CREATE TABLE public.dags_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('social_statics', 'brand_docs')),
  canvas_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dags_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dags projects"
ON public.dags_projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dags projects"
ON public.dags_projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dags projects"
ON public.dags_projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dags projects"
ON public.dags_projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all dags projects"
ON public.dags_projects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_dags_projects_updated_at
BEFORE UPDATE ON public.dags_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_dags_projects_user_id ON public.dags_projects (user_id);
CREATE INDEX idx_dags_projects_type ON public.dags_projects (project_type);
