export function Backdrop() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-mist via-glass to-primary/5" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] animate-[floaty_12s_ease-in-out_infinite] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-48 h-[460px] w-[460px] animate-[floaty2_14s_ease-in-out_infinite] rounded-full bg-dept-app/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-[420px] w-[420px] animate-[floaty3_16s_ease-in-out_infinite] rounded-full bg-dept-uiux/15 blur-3xl" />
      </div>
    </>
  );
}
