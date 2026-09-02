export function Backdrop() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-mist via-glass to-primary/5" />
      {/* هالات خفيفة: ثابتة على الجوال ومتحركة فقط على الشاشات الكبيرة لتحسين الأداء */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[380px] w-[380px] rounded-full bg-primary/10 blur-2xl will-change-transform lg:h-[520px] lg:w-[520px] lg:animate-[floaty_12s_ease-in-out_infinite] lg:blur-3xl" />
        <div className="absolute top-1/3 -left-48 hidden h-[460px] w-[460px] rounded-full bg-dept-app/15 blur-3xl will-change-transform lg:block lg:animate-[floaty2_14s_ease-in-out_infinite]" />
      </div>
    </>
  );
}
