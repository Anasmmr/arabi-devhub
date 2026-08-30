-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT 'عضو جديد',
  avatar_url text,
  bio text,
  headline text,
  city text,
  github_url text,
  linkedin_url text,
  x_url text,
  website_url text,
  whatsapp_phone text UNIQUE,
  total_points integer NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- DEPARTMENTS
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  short_description_ar text NOT NULL,
  intro_ar text NOT NULL,
  learn_items_ar text[] NOT NULL DEFAULT '{}',
  accent text NOT NULL DEFAULT 'brand',
  icon text NOT NULL DEFAULT '🧠',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "departments_public_read" ON public.departments FOR SELECT TO anon, authenticated USING (true);

-- COURSES
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  description_ar text NOT NULL,
  satr_url text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON public.courses FOR SELECT TO anon, authenticated USING (true);

-- COURSE COMPLETIONS
CREATE TABLE public.course_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'satr',
  UNIQUE (user_id, course_id)
);
GRANT SELECT ON public.course_completions TO authenticated;
GRANT ALL ON public.course_completions TO service_role;
ALTER TABLE public.course_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "completions_read_own" ON public.course_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- CERTIFICATES
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  serial text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'issued',
  email_sent boolean NOT NULL DEFAULT false,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates_read_own" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- POINT TRANSACTIONS
CREATE TABLE public.point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  reason_ar text NOT NULL,
  kind text NOT NULL DEFAULT 'course',
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, reference)
);
GRANT SELECT ON public.point_transactions TO authenticated;
GRANT ALL ON public.point_transactions TO service_role;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "points_read_own" ON public.point_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- FOUNDERS
CREATE TABLE public.founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_ar text NOT NULL,
  bio_ar text NOT NULL,
  image_url text,
  initial text NOT NULL DEFAULT 'م',
  linkedin_url text,
  x_url text,
  github_url text,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.founders TO anon, authenticated;
GRANT ALL ON public.founders TO service_role;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founders_public_read" ON public.founders FOR SELECT TO anon, authenticated USING (true);

-- RECALC TOTAL POINTS FROM LEDGER
CREATE OR REPLACE FUNCTION public.sync_profile_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE target uuid;
BEGIN
  target := COALESCE(NEW.user_id, OLD.user_id);
  UPDATE public.profiles p
     SET total_points = COALESCE((SELECT SUM(amount) FROM public.point_transactions t WHERE t.user_id = target), 0),
         updated_at = now()
   WHERE p.id = target;
  RETURN NULL;
END;
$$;

CREATE TRIGGER point_transactions_sync
AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_points();

-- AWARD POINTS (idempotent by reference)
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id uuid,
  p_amount integer,
  p_reason_ar text,
  p_kind text,
  p_department_id uuid,
  p_reference text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE inserted integer;
BEGIN
  IF p_amount <= 0 OR p_amount > 500 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;
  INSERT INTO public.point_transactions (user_id, amount, reason_ar, kind, department_id, reference)
  VALUES (p_user_id, p_amount, p_reason_ar, p_kind, p_department_id, p_reference)
  ON CONFLICT (user_id, reference) DO NOTHING;
  GET DIAGNOSTICS inserted = ROW_COUNT;
  RETURN inserted > 0;
END;
$$;

-- COMPLETE A COURSE: verified completion -> completion row + points + certificate
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
  awarded boolean := false;
  cert record;
BEGIN
  SELECT * INTO c FROM public.courses WHERE id = p_course_id;
  IF c IS NULL THEN RAISE EXCEPTION 'course not found'; END IF;
  SELECT * INTO d FROM public.departments WHERE id = c.department_id;

  INSERT INTO public.course_completions (user_id, course_id)
  VALUES (p_user_id, p_course_id)
  ON CONFLICT (user_id, course_id) DO NOTHING;
  IF FOUND THEN already := false; END IF;

  awarded := public.award_points(
    p_user_id, c.points,
    'إتمام دورة: ' || c.title_ar || ' — قسم ' || d.name_ar,
    'course', c.department_id, 'course:' || p_course_id::text
  );

  INSERT INTO public.certificates (user_id, course_id, department_id, serial)
  VALUES (p_user_id, p_course_id, c.department_id,
          'GD-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 8)))
  ON CONFLICT (user_id, course_id) DO NOTHING;

  SELECT * INTO cert FROM public.certificates WHERE user_id = p_user_id AND course_id = p_course_id;

  RETURN jsonb_build_object(
    'already_completed', already,
    'points_awarded', CASE WHEN awarded THEN c.points ELSE 0 END,
    'course_title', c.title_ar,
    'department_name', d.name_ar,
    'certificate_serial', cert.serial,
    'total_points', (SELECT total_points FROM public.profiles WHERE id = p_user_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.award_points(uuid,integer,text,text,uuid,text) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_course(uuid,uuid) FROM anon, authenticated;

-- ================= SEED =================
INSERT INTO public.departments (slug, name_ar, name_en, short_description_ar, intro_ar, learn_items_ar, accent, icon, sort_order) VALUES
('ai','ذكاء اصطناعي','Artificial Intelligence','تعلّم الأساسيات والنماذج الحديثة لبناء تطبيقات ذكية.','قسم الذكاء الاصطناعي يأخذك من مفاهيم التعلّم الآلي الأولى حتى بناء تطبيقات تعتمد على النماذج التوليدية ونشرها فعليًا.', ARRAY['أساسيات التعلّم الآلي','معالجة البيانات وتحليلها','نماذج اللغة الكبيرة LLMs','بناء تطبيق ذكي كامل'],'brand','🧠',1),
('app','تطوير التطبيقات','App Development','ابنِ تطبيقات ويب وموبايل حديثة عبر مسارات عملية.','قسم تطوير التطبيقات يعلّمك بناء واجهات وخدمات حقيقية جاهزة للإنتاج بأدوات وتقنيات حديثة.', ARRAY['أساسيات الويب الحديثة','بناء الواجهات التفاعلية','الربط مع الخدمات والـ APIs','نشر التطبيق ومتابعته'],'sky','📱',2),
('security','الأمن السيبراني','Cybersecurity','احمِ الأنظمة وتعلّم أساسيات الأمن الرقمي الحديث.','قسم الأمن السيبراني يبني عندك عقلية المدافع: فهم الثغرات، تأمين الأنظمة، والاستجابة للحوادث.', ARRAY['أساسيات أمن المعلومات','أمن تطبيقات الويب','الشبكات والتحليل','الاستجابة للحوادث'],'amber','🔒',3),
('uiux','تصميم UI/UX','UI/UX Design','صمّم تجارب مستخدم جميلة ومنطقية تتحدث بنفسها.','قسم التصميم يعلّمك التفكير في المستخدم أولًا، ثم ترجمة ذلك إلى واجهات عربية دقيقة وجميلة.', ARRAY['مبادئ تجربة المستخدم','أساسيات التصميم البصري','التصميم للعربية وRTL','بناء نظام تصميم متكامل'],'violet','🎨',4);

INSERT INTO public.courses (department_id, title_ar, description_ar, satr_url, points, sort_order)
SELECT d.id, x.title, x.descr, 'https://satr.codes/courses/' || d.slug || '-' || x.ord, x.pts, x.ord
FROM public.departments d
JOIN (VALUES
  ('ai','مقدمة في الذكاء الاصطناعي','تعرّف على المفاهيم الأساسية ومجالات تطبيق الذكاء الاصطناعي.',10,1),
  ('ai','أساسيات التعلّم الآلي','الخوارزميات الأساسية وكيفية تدريب النماذج وتقييمها.',10,2),
  ('ai','معالجة البيانات','تنظيف البيانات وتحليلها وتحضيرها للنماذج.',10,3),
  ('ai','نماذج اللغة الكبيرة','كيف تعمل نماذج LLM وكيف تبني عليها تطبيقات.',10,4),
  ('ai','مشروع تطبيقي في الذكاء الاصطناعي','ابنِ مشروعًا كاملًا واعرضه في مجتمعك.',10,5),
  ('app','أساسيات تطوير الويب','HTML وCSS وJavaScript بأسلوب عملي حديث.',10,1),
  ('app','بناء الواجهات التفاعلية','مكوّنات وحالة وتوجيه داخل تطبيق حقيقي.',10,2),
  ('app','الربط مع الـ APIs','جلب البيانات، التعامل مع الأخطاء، والتخزين المؤقت.',10,3),
  ('app','قواعد البيانات والخدمات الخلفية','تصميم البيانات والتوثيق والصلاحيات.',10,4),
  ('app','نشر التطبيق','النشر، الأداء، والمتابعة بعد الإطلاق.',10,5),
  ('security','أساسيات أمن المعلومات','المبادئ الثلاثة وأنواع التهديدات الشائعة.',10,1),
  ('security','أمن تطبيقات الويب','أشهر الثغرات وكيفية الحماية منها عمليًا.',10,2),
  ('security','أمن الشبكات','تحليل الحركة وتأمين البنية الشبكية.',10,3),
  ('security','التشفير وإدارة الهوية','التشفير، المصادقة، وإدارة الصلاحيات.',10,4),
  ('security','الاستجابة للحوادث','خطة الاستجابة والتحقيق الرقمي الأساسي.',10,5),
  ('uiux','مبادئ تجربة المستخدم','فهم المستخدم، الأبحاث، ورسم الرحلات.',10,1),
  ('uiux','أساسيات التصميم البصري','التسلسل البصري، المسافات، والألوان.',10,2),
  ('uiux','التصميم للعربية وRTL','الطباعة العربية والاتجاه من اليمين لليسار.',10,3),
  ('uiux','النماذج الأولية والاختبار','بناء نموذج قابل للاختبار وقياس النتائج.',10,4),
  ('uiux','بناء نظام تصميم','رموز التصميم والمكوّنات القابلة لإعادة الاستخدام.',10,5)
) AS x(slug, title, descr, pts, ord) ON x.slug = d.slug;

INSERT INTO public.founders (name, role_ar, bio_ar, initial, linkedin_url, x_url, github_url, sort_order) VALUES
('عبدالله الشمري','قائد النادي','مهندس برمجيات ومهتم ببناء مجتمعات تقنية عربية مستدامة.','ع','https://linkedin.com','https://x.com','https://github.com',1),
('سارة العتيبي','قائدة قسم الذكاء الاصطناعي','باحثة في التعلّم الآلي وتقود المسارات التعليمية للذكاء الاصطناعي.','س','https://linkedin.com','https://x.com','https://github.com',2),
('محمد خالد','قائد قسم تطوير التطبيقات','مطوّر تطبيقات ومدرّب، شارك في تنظيم أكثر من ٤٠ ورشة تقنية.','م','https://linkedin.com','https://x.com','https://github.com',3),
('نورة الأحمد','قائدة قسم الأمن السيبراني','مختصة أمن معلومات وتؤمن أن التوعية أول خطوط الدفاع.','ن','https://linkedin.com','https://x.com','https://github.com',4);

INSERT INTO public.profiles (id, full_name, headline, city, is_demo, bio) VALUES
('11111111-1111-4111-8111-111111111111','سارة العتيبي','مطوّرة ذكاء اصطناعي','الرياض',true,'أبني نماذج وأشارك ما أتعلمه مع المجتمع.'),
('22222222-2222-4222-8222-222222222222','محمد خالد','مطوّر تطبيقات','جدة',true,'شغوف بالواجهات السريعة والتجارب النظيفة.'),
('33333333-3333-4333-8333-333333333333','نورة الأحمد','مختصة أمن سيبراني','الدمام',true,'أحب تفكيك الأنظمة لفهم كيف تُحمى.'),
('44444444-4444-4444-8444-444444444444','عمر فهد','مصمم واجهات','الرياض',true,'التصميم الجيد يبدأ من فهم الناس.'),
('55555555-5555-4555-8555-555555555555','ليان القحطاني','مطوّرة ويب','مكة',true,'أتعلّم كل يوم شيئًا جديدًا وأشاركه.'),
('66666666-6666-4666-8666-666666666666','فهد الدوسري','مهندس بيانات','الرياض',true,'البيانات قصة تحتاج من يقرأها.');

INSERT INTO public.point_transactions (user_id, amount, reason_ar, kind, department_id, reference)
SELECT s.uid, s.amount, s.reason, 'seed', d.id, s.ref
FROM (VALUES
  ('11111111-1111-4111-8111-111111111111'::uuid, 50, 'إتمام مسار الذكاء الاصطناعي','ai','seed:1a'),
  ('11111111-1111-4111-8111-111111111111'::uuid, 50, 'إتمام مسار تصميم UI/UX','uiux','seed:1b'),
  ('11111111-1111-4111-8111-111111111111'::uuid, 50, 'مشاركة فعّالة عبر واتساب مع Googlely','ai','seed:1c'),
  ('22222222-2222-4222-8222-222222222222'::uuid, 50, 'إتمام مسار تطوير التطبيقات','app','seed:2a'),
  ('22222222-2222-4222-8222-222222222222'::uuid, 50, 'إتمام مسار الأمن السيبراني','security','seed:2b'),
  ('33333333-3333-4333-8333-333333333333'::uuid, 50, 'إتمام مسار الأمن السيبراني','security','seed:3a'),
  ('33333333-3333-4333-8333-333333333333'::uuid, 30, 'إجابات صحيحة عبر واتساب','security','seed:3b'),
  ('44444444-4444-4444-8444-444444444444'::uuid, 50, 'إتمام مسار تصميم UI/UX','uiux','seed:4a'),
  ('44444444-4444-4444-8444-444444444444'::uuid, 20, 'مشاركة في ورشة تصميم','uiux','seed:4b'),
  ('55555555-5555-4555-8555-555555555555'::uuid, 40, 'إتمام دورات من مسار تطوير التطبيقات','app','seed:5a'),
  ('66666666-6666-4666-8666-666666666666'::uuid, 30, 'إتمام دورات من مسار الذكاء الاصطناعي','ai','seed:6a')
) AS s(uid, amount, reason, slug, ref)
JOIN public.departments d ON d.slug = s.slug;