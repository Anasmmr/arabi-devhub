REVOKE ALL ON FUNCTION public.grant_owner_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_profile_points() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_points(uuid, integer, text, text, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_course(uuid, uuid) FROM PUBLIC, anon;