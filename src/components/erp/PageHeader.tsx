import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94)_52%,rgba(30,64,175,0.88))] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.65)]">
      <div className="grid gap-6 px-6 py-7 md:grid-cols-[1.2fr_auto] md:px-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-100">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
          </div>

          {children ? (
            <div className="flex flex-wrap gap-3">
              {children}
            </div>
          ) : null}
        </div>

        {actions ? (
          <div className="flex items-start justify-start md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
