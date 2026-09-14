CREATE TABLE public.department_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount >= -1000 AND amount <= 1000 AND amount <> 0),
  reason_ar text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.department_points TO anon;
GRANT SELECT, INSERT ON public.department_points TO authenticated;
GRANT ALL ON public.department_points TO service_role;

ALTER TABLE public.department_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY dept_points_public_read ON public.department_points
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY dept_points_staff_insert ON public.department_points
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY dept_points_admin_delete ON public.department_points
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX department_points_dept_idx ON public.department_points (department_id);