import { ShieldAlert, LogOut, MessageCircle, Crown, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLogo } from '@/components/BrandLogo';

const BENEFITS = [
  'Dashboard completo em tempo real',
  'Controle de estoque ilimitado',
  'Relatórios e gráficos avançados',
  'Emissão de notas fiscais',
  'Suporte prioritário 7 dias por semana',
];

export function TrialPaywall() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-12">
          <BrandLogo className="h-40 w-auto" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 border border-slate-100 text-center">
          <div className="mx-auto w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-rose-50/50">
            <Lock className="h-10 w-10 text-rose-500" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Teste Gratuito Encerrado
          </h1>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Seus <span className="font-bold text-slate-700">30 dias gratuitos</span> expiraram. Assine agora para continuar gerenciando suas vendas e estoque com o FLUXEN profissionalmente.
          </p>

          {/* Card de Benefícios */}
          <div className="bg-blue-50/50 rounded-2xl p-5 mb-8 text-left border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Plano Pro</span>
              <p className="text-xl font-black text-slate-900">R$ 29,90<span className="text-xs font-normal text-slate-500 ml-1">/mês</span></p>
            </div>
            <div className="space-y-2">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-slate-600 text-xs font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="https://mpago.la/2cXqs8Y"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Crown className="h-4 w-4" />
              Ativar Assinatura Agora
            </a>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="rounded-xl h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>

              <a
                href="https://wa.me/5588999592580"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Suporte
              </a>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs">
          Hardware ou software? Dúvidas? Fale com nosso time comercial.
        </p>
      </div>
    </div>
  );
}
