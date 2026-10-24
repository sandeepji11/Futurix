export function PageHeader({ eyebrow, title, intro, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            {intro}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
