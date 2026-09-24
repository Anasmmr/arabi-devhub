-- Profiles: public (anon) may read non-sensitive columns only; signed-in users read their own row, admins read all.
DROP POLICY IF EXISTS profiles_public_read ON public.profiles;

CREATE POLICY profiles_anon_read ON public.profiles
  FOR SELECT TO anon USING (true);

CREATE POLICY profiles_read_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, full_name, avatar_url, bio, headline, city, github_url, linkedin_url, x_url, website_url, total_points, created_at, member_no)
  ON public.profiles TO anon;

-- User roles: only own rows, or admins see all.
DROP POLICY IF EXISTS user_roles_public_read ON public.user_roles;
CREATE POLICY user_roles_read_own_or_admin ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
REVOKE SELECT ON public.user_roles FROM anon;