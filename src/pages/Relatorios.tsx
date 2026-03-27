import { useEffect, useMemo, useState } from 'react';
import { BarChart3, DollarSign, PackageSearch, PieChart, TrendingUp, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '@/components/erp/MetricCard';
import { PageHeader } from '@/components/erp/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/erp-formatters';
import {
  getDashboardAnalytics,
  getInventoryInsights,
  getSalesIntelligence,
  getSalesReportSummary,
  type DashboardAnalytics,
  type InventoryInsights,
  type SalesIntelligence,
  type SalesReportSummary,
} from '@/lib/store';

interface ReportState {
  analytics: DashboardAnalytics;
  weeklyReport: SalesReportSummary;
  salesIntelligence: SalesIntelligence;
  inventoryInsights: InventoryInsights;
}

export default function Relatorios() {
  const { user } = useAuth();
  const [reportState, setReportState] = useState<ReportState | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [analytics, weeklyReport, salesIntelligence, inventoryInsights] = await Promise.all([
          getDashboardAnalytics(user.id),
          getSalesReportSummary(user.id, 'weekly'),
          getSalesIntelligence(user.id),
          getInventoryInsights(user.id),
        ]);

        setReportState({
          analytics,
          weeklyReport,
          salesIntelligence,
          inventoryInsights,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Nao foi possivel carregar os relatorios.';
        toast.error(message);
      }
    };

    void load();
  }, [user]);

  const inventoryIndicators = useMemo(() => {
    if (!reportState) return [];

    return [
      { label: 'Estoque baixo', value: reportState.inventoryInsights.lowStockCount },
      { label: 'Sem estoque', value: reportState.inventoryInsights.outOfStockCount },
      { label: 'Parados', value: reportState.inventoryInsights.staleCount },
      { label: 'Produtos ativos', value: reportState.inventoryInsights.totalProducts },
    ];
  }, [reportState]);

  const maxInventoryIndicator = useMemo(
    () => Math.max(...inventoryIndicators.map((item) => item.value), 1),
    [inventoryIndicators],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Relatorios"
        title="Painel gerencial para decisao e demonstracao comercial"
        description="Cruze vendas, financeiro e estoque em uma leitura clara para apresentar o sistema como produto profissional, sem carregar modulos que ainda nao entraram no MVP."
        icon={BarChart3}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">Visao executiva</Badge>
        <Badge className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 hover:bg-emerald-400/15">Vendas e operacao</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Faturamento semanal"
          value={formatCurrency(reportState?.weeklyReport.totalBruto ?? 0)}
          helper="Volume bruto da semana corrente"
          icon={DollarSign}
          tone="blue"
        />
        <MetricCard
          title="Liquido semanal"
          value={formatCurrency(reportState?.weeklyReport.totalLiquido ?? 0)}
          helper="Receita apos taxas e descontos"
          icon={PieChart}
          tone="emerald"
        />
        <MetricCard
          title="Crescimento mensal"
          value={`${reportState?.analytics.growthPercent?.toFixed(1) ?? 0}%`}
          helper="Comparativo do mes atual contra o anterior"
          icon={TrendingUp}
          tone="amber"
        />
        <MetricCard
          title="Alertas de estoque"
          value={String((reportState?.inventoryInsights.lowStockCount ?? 0) + (reportState?.inventoryInsights.outOfStockCount ?? 0))}
          helper="Itens com risco comercial imediato"
          icon={PackageSearch}
          tone="rose"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Destaques de performance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Trophy className="h-5 w-5 text-amber-500" />
                <p className="font-medium">Produto lider</p>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {reportState?.salesIntelligence.topProduct?.nome ?? 'Sem dados'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {reportState?.salesIntelligence.topProduct
                  ? `${reportState.salesIntelligence.topProduct.quantidade} unidades | ${formatCurrency(reportState.salesIntelligence.topProduct.valor)}`
                  : 'Venda ainda nao registrada.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <p className="font-medium">Melhor dia</p>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {reportState?.salesIntelligence.bestSalesDay?.label ?? 'Sem dados'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {reportState?.salesIntelligence.bestSalesDay
                  ? `${reportState.salesIntelligence.bestSalesDay.vendas} venda(s) | ${formatCurrency(reportState.salesIntelligence.bestSalesDay.valor)}`
                  : 'Aguardando historico.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <PieChart className="h-5 w-5 text-emerald-600" />
                <p className="font-medium">Horario de pico</p>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {reportState?.salesIntelligence.busiestHour?.label ?? 'Sem dados'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {reportState?.salesIntelligence.busiestHour
                  ? `${reportState.salesIntelligence.busiestHour.vendas} atendimento(s)`
                  : 'Aguardando historico.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Formas de pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reportState?.analytics.paymentBreakdown ?? []).map((item) => (
              <div key={item.method} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.vendas} venda(s)</p>
                  </div>
                  <span className="font-semibold text-slate-900">{formatCurrency(item.valor)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Saude do estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inventoryIndicators.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <Progress value={(item.value / maxInventoryIndicator) * 100} className="h-2.5 bg-slate-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Vendido por mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(reportState?.analytics.monthlySales ?? []).map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{formatCurrency(item.liquido)}</span>
                </div>
                <Progress
                  value={
                    reportState?.analytics.bestMonth?.liquido
                      ? (item.liquido / reportState.analytics.bestMonth.liquido) * 100
                      : 0
                  }
                  className="h-2.5 bg-slate-100"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
