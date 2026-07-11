import { type PropsWithChildren, type ReactNode } from "react";

type PageShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}>;

export const PageShell = ({ actions, children, description, eyebrow, title }: PageShellProps) => (
  <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8 flex flex-col gap-4 border-b border-[#eadcc6] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a642f]">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#17201b] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[#53645b]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
    {children}
  </section>
);
