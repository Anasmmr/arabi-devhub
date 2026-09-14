DELETE FROM public.point_transactions WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.certificates WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.course_completions WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp_phone)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.raw_user_meta_data->>'name', ''), 'عضو جديد'),
    NULLIF(NEW.raw_user_meta_data->>'whatsapp_phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();