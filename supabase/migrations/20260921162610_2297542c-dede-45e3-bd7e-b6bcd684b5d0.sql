CREATE SEQUENCE IF NOT EXISTS public.profiles_member_no_seq AS integer START WITH 1;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS member_no integer;

-- backfill existing members in join order
WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at, id) AS rn
  FROM public.profiles
  WHERE member_no IS NULL
)
UPDATE public.profiles p
SET member_no = o.rn
FROM ordered o
WHERE p.id = o.id;

SELECT setval('public.profiles_member_no_seq', COALESCE((SELECT MAX(member_no) FROM public.profiles), 0) + 1, false);

ALTER TABLE public.profiles
  ALTER COLUMN member_no SET DEFAULT nextval('public.profiles_member_no_seq');

ALTER SEQUENCE public.profiles_member_no_seq OWNED BY public.profiles.member_no;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_member_no_key ON public.profiles (member_no);

GRANT USAGE, SELECT ON SEQUENCE public.profiles_member_no_seq TO authenticated, service_role;