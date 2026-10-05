import type { ReactNode } from "react";

export function Section({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-section">
      <div className="flex flex-wrap items-center gap-section">
        <h2 className="text-title font-semibold text-heading">
          {title}
          {count !== undefined ? (
            <span className="ml-stack text-copy font-normal text-muted">{count}</span>
          ) : null}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ResultList({ children }: { children: ReactNode }) {
  return <ul className="grid grid-cols-1 gap-section md:grid-cols-2">{children}</ul>;
}
