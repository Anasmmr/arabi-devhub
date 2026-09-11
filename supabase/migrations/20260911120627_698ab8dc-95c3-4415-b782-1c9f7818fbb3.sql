BEGIN;

DELETE FROM public.founders;

INSERT INTO public.founders (name, role_ar, bio_ar, image_url, initial, linkedin_url, x_url, github_url, sort_order) VALUES
('جود المطيري','قائدة النادي','قائدة مجتمع Google Developer، تسعى لبناء مجتمع تقني عربي مستدام وداعم للمواهب الناشئة.','/__l5e/assets-v1/ee72309c-caae-4412-9c66-e4bbe5095acb/jood-almutairi.png','ج','https://www.linkedin.com/in/devjood','https://x.com/Devjood',NULL,1),
('عبدالله الشمري','قائد النادي','مهندس برمجيات ومهتم ببناء مجتمعات تقنية عربية مستدامة.',NULL,'ع','https://linkedin.com','https://x.com','https://github.com',2),
('سارة العتيبي','قائدة قسم الذكاء الاصطناعي','باحثة في التعلّم الآلي وتقود المسارات التعليمية للذكاء الاصطناعي.',NULL,'س','https://linkedin.com','https://x.com','https://github.com',3),
('محمد خالد','قائد قسم تطوير التطبيقات','مطوّر تطبيقات ومدرّب، شارك في تنظيم أكثر من ٤٠ ورشة تقنية.',NULL,'م','https://linkedin.com','https://x.com','https://github.com',4),
('نورة الأحمد','قائدة قسم الأمن السيبراني','مختصة أمن معلومات وتؤمن أن التوعية أول خطوط الدفاع.',NULL,'ن','https://linkedin.com','https://x.com','https://github.com',5);

COMMIT;