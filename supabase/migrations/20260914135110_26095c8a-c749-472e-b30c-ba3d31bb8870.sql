REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.bootstrap_user_role() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_profile_points() FROM anon, authenticated;