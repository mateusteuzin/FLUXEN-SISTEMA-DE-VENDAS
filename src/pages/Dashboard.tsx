import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CalendarRange,
  Clock3,
  Copy,
  MessageCircle,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  FileText
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDashboardAnalytics,
  getDashboardStats,
  getEmpresaNome,
  getInventoryInsights,
  getSalesIntelligence,
  getSalesReportSummary,
  type DashboardAnalytics,
  type InventoryInsights,
  type InventoryProductInsight,
  type SalesIntelligence,
  type SalesReportPeriod,
  type SalesReportSummary,
} from '@/lib/store';
import { Link } from 'react-router-dom';

const monthlyChartConfig = {
  bruto: { label: 'Bruto', color: '#94A3B8' },
  liquido: { label: 'Liquido', color: '#10B981' },
} as const;

const paymentChartConfig = {
  dinheiro: { label: 'Dinheiro', color: '#0F766E' },
  pix: { label: 'Pix', color: '#10B981' },
  debito: { label: 'Débito', color: '#F59E0B' },
  credito: { label: 'Crédito', color: '#334155' },
  nao_informado: { label: 'Não informado', color: '#CBD5E1' },
} as const;

const WHATSAPP_PHONE_STORAGE_KEY = 'gestor-vendas-pro.whatsapp-phone';

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
);

const formatPercent = (value: number | null) => {
  if (value == null) return 'Sem base';
  const signal = value > 0 ? '+' : '';
  return `${signal}${value.toFixed(1)}%`;
};

const formatDays = (days: number) => (days === 1 ? '1 dia' : `${days} dias`);

const formatGeneratedAt = (value: string) => (
  new Date(value).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
);

const getInventoryStatusText = (produto: InventoryProductInsight, staleDaysThreshold: number) => {
  if (produto.isStale) return `Sem vendas ha ${formatDays(produto.daysWithoutSale)}`;
  if (!produto.lastSaleAt) return produto.daysWithoutSale >= staleDaysThreshold ? `Sem vendas ha ${formatDays(produto.daysWithoutSale)}` : 'Produto novo, ainda sem vendas';
  if (produto.daysWithoutSale === 0) return 'Teve venda hoje';
  return `Ultima venda ha ${formatDays(produto.daysWithoutSale)}`;
};

const buildWhatsAppMessage = (companyName: string, report: SalesReportSummary) => {
  const lucroLabel = report.period === 'daily' ? 'Lucro estimado do dia' : 'Lucro estimado da semana';
  const paymentLine = report.topPaymentMethod ? `Forma de pagamento em destaque: ${report.topPaymentMethod}` : 'Forma de pagamento em destaque: sem vendas no período';
  return [
    `${companyName} - ${report.title}`,
    `Periodo: ${report.rangeLabel}`, '',
    `Vendas: ${report.salesCount}`,
    `Faturamento bruto: ${formatCurrency(report.totalBruto)}`,
    `${lucroLabel}: ${formatCurrency(report.totalLiquido)}`,
    `Taxas: ${formatCurrency(report.totalTaxas)}`,
    `Ticket medio: ${formatCurrency(report.averageTicket)}`,
    paymentLine, '',
    `Gerado em ${formatGeneratedAt(report.generatedAt)}`,
  ].join('\n');
};

const openWhatsApp = (phone: string, message: string) => {
  if (typeof window === 'undefined') return;
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ saldo: 0, produtos: 0, vendasHoje: 0, totalHoje: 0 });
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null);
  const [salesIntelligence, setSalesIntelligence] = useState<SalesIntelligence | null>(null);
  const [empresaNome, setEmpresaNome] = useState('Minha Empresa');
  const [dailyReport, setDailyReport] = useState<SalesReportSummary | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<SalesReportSummary | null>(null);
  const [selectedReportPeriod, setSelectedReportPeriod] = useState<SalesReportPeriod>('daily');
  const [whatsAppPhone, setWhatsAppPhone] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(WHATSAPP_PHONE_STORAGE_KEY) ?? '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (whatsAppPhone.trim()) {
      window.localStorage.setItem(WHATSAPP_PHONE_STORAGE_KEY, whatsAppPhone);
      return;
    }
    window.localStorage.removeItem(WHATSAPP_PHONE_STORAGE_KEY);
  }, [whatsAppPhone]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const fetchDashboard = async () => {
      try {
        const [
          nextStats, nextAnalytics, nextInventory, nextSalesIntelligence, nextEmpresaNome, nextDailyReport, nextWeeklyReport,
        ] = await Promise.all([
          getDashboardStats(user.id), getDashboardAnalytics(user.id), getInventoryInsights(user.id),
          getSalesIntelligence(user.id), getEmpresaNome(user.id), getSalesReportSummary(user.id, 'daily'), getSalesReportSummary(user.id, 'weekly'),
        ]);
        if (!active) return;
        setStats(nextStats); setAnalytics(nextAnalytics); setInventoryInsights(nextInventory);
        setSalesIntelligence(nextSalesIntelligence); setEmpresaNome(nextEmpresaNome);
        setDailyReport(nextDailyReport); setWeeklyReport(nextWeeklyReport);
      } catch (error: any) {
        toast.error(error.message || 'Não foi possivel carregar o dashboard.');
      }
    };
    fetchDashboard();
    return () => { active = false; };
  }, [user]);

  const cards = [
    { title: 'Saldo do Caixa', value: formatCurrency(stats.saldo), icon: Wallet, color: 'text-primary' },
    { title: 'Produtos Cadastrados', value: stats.produtos.toString(), icon: Package, color: 'text-accent' },
    { title: 'Vendas Hoje', value: stats.vendasHoje.toString(), icon: ShoppingCart, color: 'text-success' },
    { title: 'Faturamento Hoje', value: formatCurrency(stats.totalHoje), icon: TrendingUp, color: 'text-warning' },
  ];

  const inventoryCards = [
    { title: 'Unidades Em Estoque', value: (inventoryInsights?.totalUnits ?? 0).toString(), helper: 'Total disponivel para venda', icon: Package, color: 'text-emerald-600' },
    { title: 'Produto Acabando', value: (inventoryInsights?.lowStockCount ?? 0).toString(), helper: `Até ${inventoryInsights?.lowStockThreshold ?? 5} unidades`, icon: AlertTriangle, color: 'text-amber-600' },
    { title: 'Sem Estoque', value: (inventoryInsights?.outOfStockCount ?? 0).toString(), helper: 'Itens zerados no estoque', icon: TrendingDown, color: 'text-rose-600' },
    { title: 'Produto Parado', value: (inventoryInsights?.staleCount ?? 0).toString(), helper: `Sem vendas ha ${inventoryInsights?.staleDaysThreshold ?? 15} dias`, icon: Clock3, color: 'text-slate-700' },
  ] as const;

  const paymentData = analytics?.paymentBreakdown ?? [];
  const monthlyData = analytics?.monthlySales ?? [];
  const growthPositive = (analytics?.growthPercent ?? 0) >= 0;
  const highlightedProducts = inventoryInsights?.highlightedProducts ?? [];
  const staleDaysThreshold = inventoryInsights?.staleDaysThreshold ?? 15;
  const activeReport = selectedReportPeriod === 'daily' ? dailyReport : weeklyReport;
  const reportMessage = activeReport ? buildWhatsAppMessage(empresaNome, activeReport) : '';
  
  const reportCards = activeReport ? [
    { title: 'Vendas', value: activeReport.salesCount.toString(), helper: activeReport.rangeLabel, icon: ShoppingCart, color: 'text-primary' },
    { title: 'Faturamento', value: formatCurrency(activeReport.totalBruto), helper: 'Valor bruto do período', icon: TrendingUp, color: 'text-emerald-600' },
    { title: 'Lucro Estimado', value: formatCurrency(activeReport.totalLiquido), helper: 'Baseado no valor liquido apos taxas', icon: Wallet, color: 'text-slate-800' },
    { title: 'Taxas', value: formatCurrency(activeReport.totalTaxas), helper: activeReport.topPaymentMethod ? `Destaque: ${activeReport.topPaymentMethod}` : 'Sem vendas no período', icon: BarChart3, color: 'text-amber-600' },
  ] : [];
  
  const intelligenceCards = [
    { title: 'Produto Mais Vendido', value: salesIntelligence?.topProduct?.nome ?? 'Sem vendas', helper: salesIntelligence?.topProduct ? `${salesIntelligence.topProduct.quantidade} unidade(s) | ${formatCurrency(salesIntelligence.topProduct.valor)}` : 'Cadastre vendas para gerar o ranking', icon: Package, color: 'text-primary' },
    { title: 'Melhor Dia De Vendas', value: salesIntelligence?.bestSalesDay?.label ?? 'Sem dados', helper: salesIntelligence?.bestSalesDay ? `${salesIntelligence.bestSalesDay.vendas} venda(s) | ${formatCurrency(salesIntelligence.bestSalesDay.valor)}` : 'Histórico insuficiente ainda', icon: CalendarDays, color: 'text-emerald-600' },
    { title: 'Horario Com Mais Movimento', value: salesIntelligence?.busiestHour?.label ?? 'Sem dados', helper: salesIntelligence?.busiestHour ? `${salesIntelligence.busiestHour.vendas} venda(s) | ${formatCurrency(salesIntelligence.busiestHour.valor)}` : 'Histórico insuficiente ainda', icon: Clock3, color: 'text-amber-600' },
  ] as const;

  const handleCopyReport = async () => {
    if (!reportMessage) return;
    try {
      await navigator.clipboard.writeText(reportMessage);
      toast.success('Relatório copiado para envio.');
    } catch {
      toast.error('Não foi possivel copiar o relatório.');
    }
  };

  const handleSendReport = () => {
    if (!reportMessage) return;
    openWhatsApp(whatsAppPhone, reportMessage);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Acompanhe faturamento mensal, melhor período e desempenho de vendas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QUICK ACTIONS added here as a useful addition! */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/vendas">
          <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1 border-primary/20 hover:border-primary hover:bg-primary/5">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium mt-1">Nova Venda</span>
          </Button>
        </Link>
        <Link to="/produtos">
          <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1 border-accent/20 hover:border-accent hover:bg-accent/5">
            <Package className="w-5 h-5 text-accent" />
            <span className="text-xs font-medium mt-1">Produtos</span>
          </Button>
        </Link>
        <Link to="/relatórios">
          <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1 border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-medium mt-1">Relatórios</span>
          </Button>
        </Link>
        <Link to="/caixa">
          <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1 border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/5">
            <Wallet className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-medium mt-1">Caixa</span>
          </Button>
        </Link>
      </div>

      {/* Analytics Moved UP */}
      {analytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Melhor Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.bestMonth ? formatCurrency(analytics.bestMonth.liquido) : formatCurrency(0)}</p>
                <p className="text-sm text-muted-foreground mt-1">{analytics.bestMonth ? `${analytics.bestMonth.month} (${analytics.bestMonth.label})` : 'Sem vendas no período'}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Últimos 6 Meses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalLiquidoPeriod)}</p>
                <p className="text-sm text-muted-foreground mt-1">{analytics.totalSalesPeriod} venda(s) somadas no período</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  {growthPositive ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />} Crescimento Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${growthPositive ? 'text-emerald-600' : 'text-rose-600'}`}>{formatPercent(analytics.growthPercent)}</p>
                <p className="text-sm text-muted-foreground mt-1">Atual: {formatCurrency(analytics.currentMonth?.liquido ?? 0)} | Anterior: {formatCurrency(analytics.previousMonth?.liquido ?? 0)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
            <Card className="shadow-md flex flex-col h-full">
              <CardHeader>
                <CardTitle>Vendido Por Mês</CardTitle>
                <p className="text-sm text-muted-foreground">Comparativo entre faturamento bruto e liquido nos últimos 6 meses</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-[380px] w-full pb-4">
                <ChartContainer config={monthlyChartConfig} className="h-full w-full flex-1">
                  <BarChart data={monthlyData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                    <YAxis 
                      hide={false} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(val) => {
                        if (val >= 1000) return `R$${(val / 1000).toFixed(1)}k`;
                        return `R$${val}`;
                      }}
                      fontSize={11}
                      width={55}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip cursor={{ fill: 'hsl(var(--muted)/0.3)' }} content={(
                      <ChartTooltipContent formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">{name === 'bruto' ? 'Bruto' : 'Liquido'}</span>
                          <span className="font-mono font-medium text-foreground">{formatCurrency(Number(value))}</span>
                        </div>
                      )} />
                    )} />
                    <ChartLegend content={<ChartLegendContent />} className="pt-4" />
                    <Bar dataKey="bruto" fill="var(--color-bruto)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    <Bar dataKey="liquido" fill="var(--color-liquido)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md flex flex-col h-full">
              <CardHeader>
                <CardTitle>Formas De Pagamento</CardTitle>
                <p className="text-sm text-muted-foreground">Distribuicao das vendas liquidas no mesmo período</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                {paymentData.length === 0 ? (
                  <div className="min-h-[300px] flex items-center justify-center text-sm text-muted-foreground">Nenhuma venda registrada ainda para gerar o gráfico.</div>
                ) : (
                  <div className="space-y-6">
                    <ChartContainer config={paymentChartConfig} className="mx-auto h-[260px] w-full">
                      <PieChart>
                        <ChartTooltip content={(
                          <ChartTooltipContent nameKey="method" formatter={(value, _name, item) => (
                            <div className="flex w-full items-center justify-between gap-4">
                              <span className="text-muted-foreground">{paymentChartConfig[item.payload.method as keyof typeof paymentChartConfig]?.label ?? item.payload.label}</span>
                              <span className="font-mono font-medium">{formatCurrency(Number(value))}</span>
                            </div>
                          )} />
                        )} />
                        <Pie data={paymentData} dataKey="valor" nameKey="method" innerRadius={48} outerRadius={82} paddingAngle={3}>
                          {paymentData.map((entry) => (
                            <Cell key={entry.method} fill={paymentChartConfig[entry.method as keyof typeof paymentChartConfig]?.color ?? '#CBD5E1'} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="space-y-2">
                      {paymentData.map((item) => (
                        <div key={item.method} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: paymentChartConfig[item.method as keyof typeof paymentChartConfig]?.color ?? '#CBD5E1' }} />
                            <div><p className="font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.vendas} venda(s)</p></div>
                          </div>
                          <span className="font-semibold">{formatCurrency(item.valor)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Inteligencia Simples Moved UP */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Inteligencia Simples</h2>
          <p className="text-sm text-muted-foreground mt-1">Insights automaticos para mostrar o que mais gira, quando vende melhor e qual horario performa mais.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {intelligenceCards.map((card) => (
            <Card key={card.title} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold leading-snug">{card.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {inventoryInsights && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Estoque Inteligente</h2>
            <p className="text-sm text-muted-foreground mt-1">Veja o que esta acabando e quais produtos estao sem venda recente.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {inventoryCards.map((card) => (
              <Card key={card.title} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Alertas De Estoque</CardTitle>
              <p className="text-sm text-muted-foreground">Produtos com estoque baixo ou sem vendas ha {staleDaysThreshold} dias</p>
            </CardHeader>
            <CardContent>
              {highlightedProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum alerta no momento. Seu estoque esta bem distribuido.</div>
              ) : (
                <div className="space-y-3">
                  {highlightedProducts.slice(0, 6).map((produto) => (
                    <div key={produto.id} className="rounded-xl border bg-muted/30 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{produto.nome}</p>
                            <Badge variant="secondary">Estoque: {produto.quantidade}</Badge>
                            {produto.isOutOfStock && <Badge className="bg-rose-600 hover:bg-rose-600">Sem estoque</Badge>}
                            {produto.isLowStock && <Badge className="bg-amber-500 hover:bg-amber-500">Produto acabando</Badge>}
                            {produto.isStale && <Badge variant="outline" className="border-rose-300 text-rose-700">Sem vendas ha {formatDays(produto.daysWithoutSale)}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{getInventoryStatusText(produto, staleDaysThreshold)}</p>
                        </div>
                        <span className="font-semibold">{formatCurrency(Number(produto.preco))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Relatório Automático - Moved DOWN to the bottom */}
      <div className="space-y-4 pt-8 border-t border-border/40">
        <div>
          <h2 className="text-xl font-semibold">Relatório Automatico & WhatsApp</h2>
          <p className="text-sm text-muted-foreground mt-1">Gera resumo diario e semanal automaticamente e manda no WhatsApp com um clique.</p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-50 shadow-md">
          <CardContent className="p-6">
            <Tabs value={selectedReportPeriod} onValueChange={(value) => setSelectedReportPeriod(value as SalesReportPeriod)} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:w-[280px]">
                <TabsTrigger value="daily" className="gap-2"><CalendarDays className="h-4 w-4" /> Diario</TabsTrigger>
                <TabsTrigger value="weekly" className="gap-2"><CalendarRange className="h-4 w-4" /> Semanal</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-4">
                {activeReport && selectedReportPeriod === 'daily' && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {reportCards.map((card) => (
                        <Card key={card.title} className="border-border/60 shadow-sm">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                      <div className="space-y-4 rounded-2xl border bg-background/80 p-4">
                        <div>
                          <p className="font-semibold">{activeReport.title}</p>
                          <p className="text-sm text-muted-foreground">{activeReport.rangeLabel}</p>
                        </div>
                        <Textarea value={reportMessage} readOnly className="min-h-[220px] resize-none bg-muted/20" />
                        <p className="text-xs text-muted-foreground">Lucro estimado considera o valor liquido apos as taxas de pagamento.</p>
                      </div>
                      <div className="space-y-4 rounded-2xl border bg-background/80 p-4">
                        <div>
                          <p className="font-semibold">Envio No WhatsApp</p>
                          <p className="text-sm text-muted-foreground">Digite o número com DDD.</p>
                        </div>
                        <Input value={whatsAppPhone} onChange={(e) => setWhatsAppPhone(e.target.value)} placeholder="5511999999999" className="h-12" />
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button type="button" variant="outline" className="flex-1" onClick={handleCopyReport}><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                          <Button type="button" className="flex-1" onClick={handleSendReport}><MessageCircle className="mr-2 h-4 w-4" /> Enviar</Button>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                          Ultima geracao: {formatGeneratedAt(activeReport.generatedAt)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4">
                {activeReport && selectedReportPeriod === 'weekly' && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {reportCards.map((card) => (
                        <Card key={card.title} className="border-border/60 shadow-sm">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                      <div className="space-y-4 rounded-2xl border bg-background/80 p-4">
                        <div>
                          <p className="font-semibold">{activeReport.title}</p>
                          <p className="text-sm text-muted-foreground">{activeReport.rangeLabel}</p>
                        </div>
                        <Textarea value={reportMessage} readOnly className="min-h-[220px] resize-none bg-muted/20" />
                        <p className="text-xs text-muted-foreground">Lucro estimado considera o valor liquido apos as taxas de pagamento.</p>
                      </div>
                      <div className="space-y-4 rounded-2xl border bg-background/80 p-4">
                        <div>
                          <p className="font-semibold">Envio No WhatsApp</p>
                          <p className="text-sm text-muted-foreground">Digite o número com DDD.</p>
                        </div>
                        <Input value={whatsAppPhone} onChange={(e) => setWhatsAppPhone(e.target.value)} placeholder="5511999999999" className="h-12" />
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button type="button" variant="outline" className="flex-1" onClick={handleCopyReport}><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                          <Button type="button" className="flex-1" onClick={handleSendReport}><MessageCircle className="mr-2 h-4 w-4" /> Enviar</Button>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                          Ultima geracao: {formatGeneratedAt(activeReport.generatedAt)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
