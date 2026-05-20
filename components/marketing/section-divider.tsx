export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-12 flex items-center gap-3 md:my-14">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-emerald-300/60" />
      <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-cyan-300/60" />
    </div>
  );
}
