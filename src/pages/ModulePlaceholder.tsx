import { ArrowRight, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">Modulo SaaS</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
              Estrutura pronta
            </Badge>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Area preparada para evolucao do modulo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A navegacao ja esta integrada na sidebar com destaque de item ativo, hierarquia visual e comportamento responsivo.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
              Proximo passo recomendado
              <ArrowRight className="h-4 w-4" />
              implementar a tela operacional de {title.toLowerCase()}
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6">
            <div className="flex items-center gap-3 text-slate-900">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Painel reservado</p>
                <p className="text-sm text-slate-500">Pronto para receber filtros, cards e tabelas.</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
