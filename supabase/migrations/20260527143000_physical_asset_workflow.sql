-- Physical asset workflow table for Flux Brander category-grid operations

CREATE TABLE IF NOT EXISTS public.physical_asset_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  asset_category text NOT NULL CHECK (
    asset_category IN (
      'tshirt',
      'banner',
      'tent',
      'mug',
      'stationery',
      'packaging',
      'signage',
      'uniform'
    )
  ),
  asset_name text NOT NULL,
  design_preview_url text,
  design_reference_url text,
  production_status text NOT NULL DEFAULT 'new' CHECK (
    production_status IN (
      'new',
      'design_review',
      'approved',
      'in_production',
      'quality_check',
      'ready_for_delivery',
      'delivered',
      'blocked'
    )
  ),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date timestamptz,
  delivery_eta_days integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.physical_asset_workflows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mbuni_flux_view_select_physical_asset_workflows" ON public.physical_asset_workflows;
CREATE POLICY "mbuni_flux_view_select_physical_asset_workflows"
  ON public.physical_asset_workflows
  FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_edit_insert_physical_asset_workflows" ON public.physical_asset_workflows;
CREATE POLICY "mbuni_flux_edit_insert_physical_asset_workflows"
  ON public.physical_asset_workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_edit_update_physical_asset_workflows" ON public.physical_asset_workflows;
CREATE POLICY "mbuni_flux_edit_update_physical_asset_workflows"
  ON public.physical_asset_workflows
  FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_edit_delete_physical_asset_workflows" ON public.physical_asset_workflows;
CREATE POLICY "mbuni_flux_edit_delete_physical_asset_workflows"
  ON public.physical_asset_workflows
  FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'));
