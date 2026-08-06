-- RLS policies call user_can_*_section(); those lookups must not fail when
-- evaluating INSERT/UPDATE WITH CHECK. SECURITY INVOKER can block the inner
-- SELECT on user_permissions in some setups. SECURITY DEFINER + search_path
-- matches Supabase guidance; auth.uid() is still the signed-in user.

CREATE OR REPLACE FUNCTION public.user_can_view_section(p_section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions up
    WHERE up.user_id = auth.uid()
      AND up.section = p_section
      AND up.can_view
  );
$$;

CREATE OR REPLACE FUNCTION public.user_can_edit_section(p_section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions up
    WHERE up.user_id = auth.uid()
      AND up.section = p_section
      AND up.can_edit
  );
$$;

REVOKE ALL ON FUNCTION public.user_can_view_section(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_can_edit_section(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_can_view_section(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_edit_section(text) TO authenticated;
