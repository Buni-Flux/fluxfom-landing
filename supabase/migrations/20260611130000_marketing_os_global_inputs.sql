-- One global workflow_inputs row per section+module when brand_id is null
CREATE UNIQUE INDEX IF NOT EXISTS workflow_inputs_global_unique
  ON public.workflow_inputs (section, module)
  WHERE brand_id IS NULL;
