import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tones = {
  blue: 'bg-blue-500/10 text-blue-700',
  emerald: 'bg-emerald-500/10 text-emerald-700',
  amber: 'bg-amber-500/10 text-amber-700',
  rose: 'bg-rose-500/10 text-rose-700',
  slate: 'bg-slate-900/10 text-slate-700',
} as const;

interface MetricCardProps {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: keyof typeof tones;
}

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = 'blue',
}: MetricCardProps) {
  return (
    <Card className="border-slate-200/80 bg-white/90 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.55)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}
