
CREATE POLICY "Admins can update submissions"
ON public.cms_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
ON public.cms_submissions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
