export default function PageHeader({ icon: Icon, title, content, children }) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            {Icon && (
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="text-3xl" />
              </span>
            )}
            {title}
          </h1>

          {content && (
            <p className="mt-2 text-base-content/70 max-w-lg">{content}</p>
          )}
        </div>

        {/* Right (Actions) */}
        <div>{children}</div>
      </div>
      <div className="pointer-events-none absolute right-20 top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
    </div>
  );
}
