CREATE OR REPLACE FUNCTION public.complete_course(p_user_id uuid, p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c record;
  d record;
  already boolean := true;
  course_awarded boolean := false;
  cert_awarded boolean := false;
  cert record;
BEGIN
  SELECT * INTO c FROM public.courses WHERE id = p_course_id;
  IF c IS NULL THEN RAISE EXCEPTION 'course not found'; END IF;
  SELECT * INTO d FROM public.departments WHERE id = c.department_id;

  INSERT INTO public.course_completions (user_id, course_id)
  VALUES (p_user_id, p_course_id)
  ON CONFLICT (user_id, course_id) DO NOTHING;
  IF FOUND THEN already := false; END IF;

  course_awarded := public.award_points(
    p_user_id, c.points,
    'إتمام دورة: ' || c.title_ar || ' — قسم ' || d.name_ar,
    'course', c.department_id, 'course:' || p_course_id::text
  );

  INSERT INTO public.certificates (user_id, course_id, department_id, serial)
  VALUES (p_user_id, p_course_id, c.department_id,
          'GD-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 8)))
  ON CONFLICT (user_id, course_id) DO NOTHING;

  cert_awarded := public.award_points(
    p_user_id, 500,
    'شهادة دورة: ' || c.title_ar || ' — قسم ' || d.name_ar,
    'certificate', c.department_id, 'certificate:' || p_course_id::text
  );

  SELECT * INTO cert FROM public.certificates WHERE user_id = p_user_id AND course_id = p_course_id;

  RETURN jsonb_build_object(
    'already_completed', already,
    'points_awarded', (CASE WHEN course_awarded THEN c.points ELSE 0 END) + (CASE WHEN cert_awarded THEN 500 ELSE 0 END),
    'course_title', c.title_ar,
    'department_name', d.name_ar,
    'certificate_serial', cert.serial,
    'total_points', (SELECT total_points FROM public.profiles WHERE id = p_user_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.complete_course(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_course(uuid, uuid) TO service_role;