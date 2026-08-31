ALTER FUNCTION public.complete_course(uuid, uuid) SECURITY INVOKER;
ALTER FUNCTION public.award_points(uuid, integer, text, text, uuid, text) SECURITY INVOKER;

REVOKE ALL ON FUNCTION public.complete_course(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.award_points(uuid, integer, text, text, uuid, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.complete_course(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.award_points(uuid, integer, text, text, uuid, text) TO service_role;