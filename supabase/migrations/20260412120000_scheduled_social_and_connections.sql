
-- Saved static posts (dags_projects social_statics) can be assigned a publish time per platform.
CREATE TABLE public.scheduled_social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  dags_project_id uuid NOT NULL REFERENCES public.dags_projects (id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  caption text NOT NULL DEFAULT '',
  platform text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_social_posts_platform_check CHECK (
    platform IN ('instagram', 'facebook', 'x', 'linkedin', 'pinterest', 'tiktok')
  )
);

ALTER TABLE public.scheduled_social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scheduled_social_posts_select_own"
  ON public.scheduled_social_posts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "scheduled_social_posts_insert_own"
  ON public.scheduled_social_posts FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.dags_projects dp
      WHERE dp.id = dags_project_id
        AND dp.user_id = auth.uid()
        AND dp.project_type = 'social_statics'
    )
  );

CREATE POLICY "scheduled_social_posts_update_own"
  ON public.scheduled_social_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "scheduled_social_posts_delete_own"
  ON public.scheduled_social_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "scheduled_social_posts_admin_all"
  ON public.scheduled_social_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_scheduled_social_posts_updated_at
  BEFORE UPDATE ON public.scheduled_social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_scheduled_social_posts_user_scheduled
  ON public.scheduled_social_posts (user_id, scheduled_at);

CREATE INDEX idx_scheduled_social_posts_project
  ON public.scheduled_social_posts (dags_project_id);

-- Per-user linked channels (OAuth tokens would be stored server-side later; this tracks intent + label).
CREATE TABLE public.social_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  platform text NOT NULL,
  connected boolean NOT NULL DEFAULT false,
  account_label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform),
  CONSTRAINT social_connections_platform_check CHECK (
    platform IN ('instagram', 'facebook', 'x', 'linkedin', 'pinterest', 'tiktok')
  )
);

ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_connections_select_own"
  ON public.social_connections FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_insert_own"
  ON public.social_connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_connections_update_own"
  ON public.social_connections FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_connections_delete_own"
  ON public.social_connections FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_connections_admin_all"
  ON public.social_connections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_social_connections_updated_at
  BEFORE UPDATE ON public.social_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_social_connections_user_id ON public.social_connections (user_id);
