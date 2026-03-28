import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { TrialStatus } from '@/lib/trial';

interface TrialBannerProps {
  trial: TrialStatus;
}

export function TrialBanner({ trial }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const label =
    trial.daysLeft === 1
      ? 'Seu teste gratuito encerra amanha!'
      : `Seu teste gratuito encerra em ${trial.daysLeft} dias`;

  return (
    <div
      className="relative flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-medium"
      style={{ background: '#fef3c7', borderBottom: '1px solid #fcd34d', color: '#92400e' }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: '#d97706' }} />
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <a
          href="https://mpago.la/2cXqs8Y"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: '#16a34a' }}
        >
          Assinar agora
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-700 hover:text-yellow-900 transition-colors"
          aria-label="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
