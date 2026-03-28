import { Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';

const BENEFITS = [
  'Dashboard completo em tempo real',
  'Controle de estoque ilimitado',
  'Relatorios e graficos avancados',
  'Emissao de notas fiscais',
  'Suporte prioritario 7 dias por semana',
];

export function TrialPaywall() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <BrandLogo className="h-14 w-auto" />
        </div>

        {/* Lock icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
        >
          <Lock className="h-7 w-7" style={{ color: '#dc2626' }} />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Seu teste gratuito encerrou
        </h1>
        <p className="text-gray-500 text-sm mb-7 leading-relaxed">
          Seus 7 dias de teste gratis chegaram ao fim.
          Assine o plano para continuar usando o FLUXEN sem interrupcoes.
        </p>

        {/* Plan card */}
        <div
          className="rounded-2xl p-5 mb-6 text-left"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-0.5">
                Plano Pro
              </p>
              <p className="text-3xl font-extrabold text-gray-900">
                R$ 29,90
                <span className="text-sm font-normal text-gray-500 ml-1">/mes</span>
              </p>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: '#16a34a' }}
            >
              RECOMENDADO
            </span>
          </div>

          <div className="space-y-2">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#16a34a' }} />
                <span className="text-gray-700 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://mpago.la/2cXqs8Y"
          target="_blank"
          rel="noreferrer"
          className="block w-full py-3.5 rounded-xl font-extrabold text-base text-white text-center transition-opacity hover:opacity-90 mb-3"
          style={{ background: '#16a34a' }}
        >
          Assinar Plano - R$ 29,90/mes
        </a>

        <Button
          variant="ghost"
          className="w-full text-gray-400 hover:text-gray-600 text-sm"
          onClick={() => signOut()}
        >
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
