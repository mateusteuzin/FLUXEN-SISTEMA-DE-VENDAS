import { Calendar, Crown, Clock } from 'lucide-react';
import type { TrialStatus } from '@/lib/trial';
import { cn } from '@/lib/utils';

interface SubscriptionStatusProps {
  trial: TrialStatus;
  className?: string;
}

export function SubscriptionStatus({ trial, className }: SubscriptionStatusProps) {
  const isTrial = !trial.isPaid;

  return (
    <div className={cn("mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-all hover:bg-white/[0.07]", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Status do Plano
        </p>
        
        {trial.isPaid ? (
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <Crown className="h-3 w-3" />
            PRO
          </div>
        ) : (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ring-inset",
            trial.isWarning 
              ? "bg-amber-500/10 text-amber-400 ring-amber-500/20 animate-pulse" 
              : "bg-blue-500/10 text-blue-400 ring-blue-500/20"
          )}>
            <Clock className="h-3 w-3" />
            TRIAL
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <p className="text-[11px] font-medium leading-none">
            Expira em: <span className="text-white ml-0.5 font-bold tracking-tight">{trial.expirationDate}</span>
          </p>
        </div>
        
        {isTrial && (
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                trial.isWarning ? "bg-amber-500" : "bg-blue-500"
              )}
              style={{ width: `${Math.min(100, (trial.daysUsed / 30) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {isTrial && trial.isWarning && (
        <a
          href="https://mpago.la/2cXqs8Y"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98]"
        >
          <Crown className="h-3.5 w-3.5" />
          Fazer Upgrade
        </a>
      )}
    </div>
  );
}
