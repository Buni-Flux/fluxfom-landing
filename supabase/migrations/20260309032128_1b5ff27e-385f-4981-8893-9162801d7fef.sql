
-- Replace the overly permissive insert policy with a more specific one
DROP POLICY "Anyone can insert submissions" ON public.cms_submissions;
CREATE POLICY "Anyone can insert submissions" ON public.cms_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (
    company_name IS NOT NULL AND email IS NOT NULL
  );
