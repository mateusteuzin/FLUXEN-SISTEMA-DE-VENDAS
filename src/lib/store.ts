import { supabase } from '@/integrations/supabase/client';
import { isLocalMode } from '@/lib/app-mode';
import {
  addLocalCaixaEntry,
  deleteLocalProduto,
  finalizeLocalVendaComPagamento,
  getLocalDashboardStats,
  getLocalEmpresaNome,
  listLocalCaixaEntries,
  listLocalProdutos,
  listLocalVendaTimeline,
  listLocalVendasComItens,
  listLocalVendas,
  listLocalVendasHoje,
  listLocalVendasPorData,
  saveLocalProduto,
  updateLocalVendaComPagamento,
  type CaixaFormaPagamento,
  type CaixaOrigem,
  type CaixaRecord,
  type ProdutoRecord,
  type VendaComItens,
  type VendaItemRecord,
} from '@/lib/local-db';

export type Produto = Pick<ProdutoRecord, 'id' | 'nome' | 'preço' | 'quantidade' | 'created_at' | 'updated_at'>;
export type CaixaEntry = Pick<
  CaixaRecord,
  | 'id'
  | 'tipo'
  | 'valor'
  | 'descrição'
  | 'created_at'
  | 'origem'
  | 'categoria'
  | 'forma_pagamento'
  | 'produto_id'
  | 'produto_nome'
  | 'quantidade'
  | 'taxa_percentual'
  | 'valor_bruto'
  | 'valor_taxa'
>;
export type VendaItem = VendaItemRecord;
export type Venda = VendaComItens;
export type CaixaPaymentMethod = CaixaFormaPagamento;
export type CaixaEntryOrigin = CaixaOrigem;

export interface DashboardStats {
  saldo: number;
  produtos: number;
  vendasHoje: number;
  totalHoje: number;
}

export interface DashboardMonthlyPoint {
  key: string;
  month: string;
  label: string;
  bruto: number;
  liquido: number;
  vendas: number;
}

export interface DashboardPaymentPoint {
  method: string;
  label: string;
  valor: number;
  vendas: number;
}

export interface DashboardAnalytics {
  monthlySales: DashboardMonthlyPoint[];
  bestMonth: DashboardMonthlyPoint | null;
  currentMonth: DashboardMonthlyPoint | null;
  previousMonth: DashboardMonthlyPoint | null;
  paymentBreakdown: DashboardPaymentPoint[];
  totalBrutoPeriod: number;
  totalLiquidoPeriod: number;
  totalSalesPeriod: number;
  growthPercent: number | null;
}

export type SalesReportPeriod = 'daily' | 'weekly';

export interface SalesReportSummary {
  period: SalesReportPeriod;
  title: string;
  rangeLabel: string;
  salesCount: number;
  totalBruto: number;
  totalLiquido: number;
  totalTaxas: number;
  averageTicket: number;
  topPaymentMethod: string | null;
  generatedAt: string;
}

export interface SalesIntelligenceHighlight {
  label: string;
  vendas: number;
  valor: number;
}

export interface SalesTopProduct {
  nome: string;
  quantidade: number;
  valor: number;
}

export interface SalesIntelligence {
  topProduct: SalesTopProduct | null;
  bestSalesDay: SalesIntelligenceHighlight | null;
  busiestHour: SalesIntelligenceHighlight | null;
}

export interface InventorySaleTimelinePoint {
  produto_id: string;
  quantidade: number;
  created_at: string;
}

export interface InventoryProductInsight extends Produto {
  lastSaleAt: string | null;
  daysWithoutSale: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isStale: boolean;
}

export interface InventoryInsights {
  products: InventoryProductInsight[];
  highlightedProducts: InventoryProductInsight[];
  lowStockProducts: InventoryProductInsight[];
  staleProducts: InventoryProductInsight[];
  totalProducts: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  staleCount: number;
  lowStockThreshold: number;
  staleDaysThreshold: number;
}

export interface ProdutoPayload {
  nome: string;
  preco: number;
  quantidade: number;
}

export interface CaixaPayload {
  tipo: CaixaRecord['tipo'];
  valor: number;
  descricao: string | null;
  origem?: CaixaOrigem | null;
  categoria?: string | null;
  forma_pagamento?: CaixaFormaPagamento | null;
  produto_id?: string | null;
  produto_nome?: string | null;
  quantidade?: number | null;
  taxa_percentual?: number | null;
  valor_bruto?: number | null;
  valor_taxa?: number | null;
}

export interface SaleCartItem {
  produto: Produto;
  qtd: number;
}

export interface SalePaymentPayload {
  forma_pagamento: CaixaFormaPagamento;
  taxa_percentual: number;
}

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase não configurado. Use o modo local ou preencha o arquivo .env.');
  }

  return supabase;
};

const paymentLabels: Record<string, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  debito: 'Débito',
  credito: 'Crédito',
  nao_informado: 'Não informado',
};

const LOW_STOCK_THRESHOLD = 5;
const STALE_PRODUCT_DAYS = 15;
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});
const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const weekdayLabels = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

const createMonthBuckets = (months = 6): DashboardMonthlyPoint[] => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const shortMonth = formatter.format(date).replace('.', '');
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = `${shortMonth}/${String(date.getFullYear()).slice(-2)}`;
    const month = shortMonth.charAt(0).toUpperCase() + shortMonth.slice(1);

    return {
      key,
      month,
      label,
      bruto: 0,
      liquido: 0,
      vendas: 0,
    };
  });
};

const getMonthKey = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const startOfCurrentDay = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

const endOfCurrentDay = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
};

const startOfCurrentWeek = () => {
  const now = new Date();
  const diffToMonday = now.getDay() === 0 ? -6 : 1 - now.getDay();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
};

const endOfCurrentWeek = () => {
  const start = startOfCurrentWeek();
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
};

const getSalesReportRange = (period: SalesReportPeriod) => {
  if (period === 'daily') {
    const start = startOfCurrentDay();
    const end = endOfCurrentDay();
    return {
      start,
      end,
      title: 'Resumo Diario',
      rangeLabel: `Hoje, ${fullDateFormatter.format(start)}`,
    };
  }

  const start = startOfCurrentWeek();
  const end = endOfCurrentWeek();
  return {
    start,
    end,
    title: 'Resumo Semanal',
    rangeLabel: `${shortDateFormatter.format(start)} a ${fullDateFormatter.format(end)}`,
  };
};

const getDaysSince = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  return Math.max(0, Math.floor(diff / DAY_IN_MS));
};

const compareDatesDesc = (left: string | null, right: string | null) => {
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  return new Date(right).getTime() - new Date(left).getTime();
};

const buildInventoryInsights = (
  produtos: Produto[],
  salesTimeline: InventorySaleTimelinePoint[],
): InventoryInsights => {
  const lastSaleByProduct = new Map<string, string>();

  for (const sale of salesTimeline) {
    const current = lastSaleByProduct.get(sale.produto_id);
    if (!current || new Date(sale.created_at).getTime() > new Date(current).getTime()) {
      lastSaleByProduct.set(sale.produto_id, sale.created_at);
    }
  }

  const products = produtos.map<InventoryProductInsight>((produto) => {
    const lastSaleAt = lastSaleByProduct.get(produto.id) ?? null;
    const daysWithoutSale = getDaysSince(lastSaleAt ?? produto.created_at);
    const isOutOfStock = produto.quantidade <= 0;
    const isLowStock = produto.quantidade > 0 && produto.quantidade <= LOW_STOCK_THRESHOLD;
    const isStale = daysWithoutSale >= STALE_PRODUCT_DAYS;

    return {
      ...produto,
      lastSaleAt,
      daysWithoutSale,
      isLowStock,
      isOutOfStock,
      isStale,
    };
  });

  const highlightedProducts = [...products]
    .filter((item) => item.isOutOfStock || item.isLowStock || item.isStale)
    .sort((a, b) => {
      if (a.isOutOfStock !== b.isOutOfStock) return a.isOutOfStock ? -1 : 1;
      if (a.isLowStock !== b.isLowStock) return a.isLowStock ? -1 : 1;
      if (a.isStale !== b.isStale) return a.isStale ? -1 : 1;
      if (a.daysWithoutSale !== b.daysWithoutSale) return b.daysWithoutSale - a.daysWithoutSale;
      if (a.quantidade !== b.quantidade) return a.quantidade - b.quantidade;
      return compareDatesDesc(a.lastSaleAt, b.lastSaleAt);
    });

  return {
    products,
    highlightedProducts,
    lowStockProducts: products.filter((item) => item.isLowStock),
    staleProducts: products.filter((item) => item.isStale),
    totalProducts: products.length,
    totalUnits: products.reduce((acc, item) => acc + item.quantidade, 0),
    lowStockCount: products.filter((item) => item.isLowStock).length,
    outOfStockCount: products.filter((item) => item.isOutOfStock).length,
    staleCount: products.filter((item) => item.isStale).length,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    staleDaysThreshold: STALE_PRODUCT_DAYS,
  };
};

const buildSalesReportSummary = (
  vendas: Array<{
    created_at: string;
    total: number | null;
    valor_liquido?: number | null;
    valor_taxa?: number | null;
    forma_pagamento?: string | null;
  }>,
  period: SalesReportPeriod,
): SalesReportSummary => {
  const range = getSalesReportRange(period);
  const paymentMap = new Map<string, number>();

  let totalBruto = 0;
  let totalLiquido = 0;
  let totalTaxas = 0;

  for (const venda of vendas) {
    const bruto = Number(venda.total ?? 0);
    const liquido = Number(venda.valor_liquido ?? venda.total ?? 0);
    const taxas = Number(venda.valor_taxa ?? bruto - liquido);
    const paymentMethod = venda.forma_pagamento ?? 'nao_informado';

    totalBruto += bruto;
    totalLiquido += liquido;
    totalTaxas += taxas;
    paymentMap.set(paymentMethod, (paymentMap.get(paymentMethod) ?? 0) + liquido);
  }

  const topPaymentMethod = [...paymentMap.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    period,
    title: range.title,
    rangeLabel: range.rangeLabel,
    salesCount: vendas.length,
    totalBruto: Number(totalBruto.toFixed(2)),
    totalLiquido: Number(totalLiquido.toFixed(2)),
    totalTaxas: Number(totalTaxas.toFixed(2)),
    averageTicket: vendas.length > 0 ? Number((totalBruto / vendas.length).toFixed(2)) : 0,
    topPaymentMethod: topPaymentMethod ? paymentLabels[topPaymentMethod] ?? topPaymentMethod : null,
    generatedAt: new Date().toISOString(),
  };
};

const buildSalesIntelligence = (
  vendas: Array<{
    created_at: string;
    total: number | null;
    valor_liquido?: number | null;
    venda_itens?: Array<{
      produto_id: string;
      produto_nome: string;
      quantidade: number;
      subtotal: number;
    }>;
  }>,
): SalesIntelligence => {
  const productMap = new Map<string, SalesTopProduct>();
  const weekdayMap = new Map<number, SalesIntelligenceHighlight>();
  const hourMap = new Map<number, SalesIntelligenceHighlight>();

  for (const venda of vendas) {
    const saleValue = Number(venda.valor_liquido ?? venda.total ?? 0);
    const createdAt = new Date(venda.created_at);
    const weekday = createdAt.getDay();
    const hour = createdAt.getHours();

    const weekdayEntry = weekdayMap.get(weekday) ?? {
      label: weekdayLabels[weekday] ?? 'Dia',
      vendas: 0,
      valor: 0,
    };
    weekdayEntry.vendas += 1;
    weekdayEntry.valor += saleValue;
    weekdayMap.set(weekday, weekdayEntry);

    const hourEntry = hourMap.get(hour) ?? {
      label: `${String(hour).padStart(2, '0')}h`,
      vendas: 0,
      valor: 0,
    };
    hourEntry.vendas += 1;
    hourEntry.valor += saleValue;
    hourMap.set(hour, hourEntry);

    for (const item of venda.venda_itens || []) {
      const existingProduct = productMap.get(item.produto_id) ?? {
        nome: item.produto_nome,
        quantidade: 0,
        valor: 0,
      };

      existingProduct.quantidade += Number(item.quantidade ?? 0);
      existingProduct.valor += Number(item.subtotal ?? 0);
      productMap.set(item.produto_id, existingProduct);
    }
  }

  const topProduct = [...productMap.values()]
    .sort((a, b) => {
      if (a.quantidade !== b.quantidade) return b.quantidade - a.quantidade;
      return b.valor - a.valor;
    })[0] ?? null;

  const bestSalesDay = [...weekdayMap.values()]
    .sort((a, b) => {
      if (a.valor !== b.valor) return b.valor - a.valor;
      return b.vendas - a.vendas;
    })[0] ?? null;

  const busiestHour = [...hourMap.values()]
    .sort((a, b) => {
      if (a.vendas !== b.vendas) return b.vendas - a.vendas;
      return b.valor - a.valor;
    })[0] ?? null;

  return {
    topProduct: topProduct
      ? {
        ...topProduct,
        valor: Number(topProduct.valor.toFixed(2)),
      }
      : null,
    bestSalesDay: bestSalesDay
      ? {
        ...bestSalesDay,
        valor: Number(bestSalesDay.valor.toFixed(2)),
      }
      : null,
    busiestHour: busiestHour
      ? {
        ...busiestHour,
        valor: Number(busiestHour.valor.toFixed(2)),
      }
      : null,
  };
};

const buildDashboardAnalytics = (
  vendas: Array<{
    created_at: string;
    total: number | null;
    valor_liquido?: number | null;
    forma_pagamento?: string | null;
  }>,
): DashboardAnalytics => {
  const monthlySales = createMonthBuckets(6);
  const monthMap = new Map(monthlySales.map((item) => [item.key, item]));
  const periodKeys = new Set(monthlySales.map((item) => item.key));
  const paymentMap = new Map<string, DashboardPaymentPoint>();

  for (const venda of vendas) {
    const monthKey = getMonthKey(venda.created_at);
    if (!periodKeys.has(monthKey)) continue;

    const bucket = monthMap.get(monthKey);
    if (!bucket) continue;

    const bruto = Number(venda.total ?? 0);
    const liquido = Number(venda.valor_liquido ?? venda.total ?? 0);
    const paymentMethod = venda.forma_pagamento ?? 'nao_informado';

    bucket.bruto += bruto;
    bucket.liquido += liquido;
    bucket.vendas += 1;

    const existingPayment = paymentMap.get(paymentMethod) ?? {
      method: paymentMethod,
      label: paymentLabels[paymentMethod] ?? paymentMethod,
      valor: 0,
      vendas: 0,
    };

    existingPayment.valor += liquido;
    existingPayment.vendas += 1;
    paymentMap.set(paymentMethod, existingPayment);
  }

  const normalizedMonthly = monthlySales.map((item) => ({
    ...item,
    bruto: Number(item.bruto.toFixed(2)),
    liquido: Number(item.liquido.toFixed(2)),
  }));

  const bestMonth = normalizedMonthly.reduce<DashboardMonthlyPoint | null>((best, current) => {
    if (!best || current.liquido > best.liquido) return current;
    return best;
  }, null);

  const currentMonth = normalizedMonthly[normalizedMonthly.length - 1] ?? null;
  const previousMonth = normalizedMonthly[normalizedMonthly.length - 2] ?? null;
  const growthPercent = previousMonth && previousMonth.liquido > 0
    ? Number((((currentMonth?.liquido ?? 0) - previousMonth.liquido) / previousMonth.liquido * 100).toFixed(1))
    : currentMonth && currentMonth.liquido > 0
      ? 100
      : null;

  const paymentBreakdown = [...paymentMap.values()]
    .sort((a, b) => b.valor - a.valor)
    .map((item) => ({
      ...item,
      valor: Number(item.valor.toFixed(2)),
    }));

  const totalBrutoPeriod = Number(normalizedMonthly.reduce((acc, item) => acc + item.bruto, 0).toFixed(2));
  const totalLiquidoPeriod = Number(normalizedMonthly.reduce((acc, item) => acc + item.liquido, 0).toFixed(2));
  const totalSalesPeriod = normalizedMonthly.reduce((acc, item) => acc + item.vendas, 0);

  return {
    monthlySales: normalizedMonthly,
    bestMonth,
    currentMonth,
    previousMonth,
    paymentBreakdown,
    totalBrutoPeriod,
    totalLiquidoPeriod,
    totalSalesPeriod,
    growthPercent,
  };
};

export const getEmpresaNome = async (userId?: string | null) => {
  if (!userId) return 'Minha Empresa';

  if (isLocalMode) {
    return getLocalEmpresaNome(userId);
  }

  const client = ensureSupabase();
  const { data } = await client.from('empresa').select('nome').single();
  return data?.nome ?? 'Minha Empresa';
};

export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  if (isLocalMode) {
    return getLocalDashboardStats(userId);
  }

  const client = ensureSupabase();

  const { data: caixaData, error: caixaError } = await client.from('caixa').select('tipo, valor');
  if (caixaError) throw caixaError;

  const saldo = (caixaData || []).reduce((acc, item) => (
    item.tipo === 'entrada' ? acc + Number(item.valor) : acc - Number(item.valor)
  ), 0);

  const { count: prodCount, error: produtosError } = await client
    .from('produtos')
    .select('*', { count: 'exact', head: true });
  if (produtosError) throw produtosError;

  const today = new Date().toISOString().split('T')[0];
  const { data: vendasHoje, error: vendasError } = await client
    .from('vendas')
    .select('total')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`);
  if (vendasError) throw vendasError;

  const totalHoje = (vendasHoje || []).reduce((acc, item) => acc + Number(item.total), 0);

  return {
    saldo,
    produtos: prodCount || 0,
    vendasHoje: vendasHoje?.length || 0,
    totalHoje,
  };
};

export const getDashboardAnalytics = async (userId: string): Promise<DashboardAnalytics> => {
  if (isLocalMode) {
    const vendas = listLocalVendas(userId);
    return buildDashboardAnalytics(vendas);
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from('vendas')
    .select('created_at,total,valor_liquido,forma_pagamento')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return buildDashboardAnalytics(data || []);
};

export const getSalesReportSummary = async (
  userId: string,
  period: SalesReportPeriod,
): Promise<SalesReportSummary> => {
  const range = getSalesReportRange(period);

  if (isLocalMode) {
    const vendas = listLocalVendas(userId).filter((item) => {
      const createdAt = new Date(item.created_at).getTime();
      return createdAt >= range.start.getTime() && createdAt <= range.end.getTime();
    });

    return buildSalesReportSummary(vendas, period);
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from('vendas')
    .select('created_at,total,valor_liquido,valor_taxa,forma_pagamento')
    .gte('created_at', range.start.toISOString())
    .lte('created_at', range.end.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return buildSalesReportSummary(data || [], period);
};

export const getSalesIntelligence = async (userId: string): Promise<SalesIntelligence> => {
  if (isLocalMode) {
    const vendas = listLocalVendasComItens(userId);
    return buildSalesIntelligence(vendas);
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from('vendas')
    .select('created_at,total,valor_liquido,venda_itens(produto_id,produto_nome,quantidade,subtotal)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return buildSalesIntelligence((data as Array<{
    created_at: string;
    total: number | null;
    valor_liquido?: number | null;
    venda_itens?: Array<{
      produto_id: string;
      produto_nome: string;
      quantidade: number;
      subtotal: number;
    }>;
  }>) || []);
};

export const getInventoryInsights = async (userId: string): Promise<InventoryInsights> => {
  if (isLocalMode) {
    const produtos = listLocalProdutos(userId);
    const salesTimeline = listLocalVendaTimeline(userId);
    return buildInventoryInsights(produtos, salesTimeline);
  }

  const client = ensureSupabase();

  const [
    { data: produtosData, error: produtosError },
    { data: vendasData, error: vendasError },
  ] = await Promise.all([
    client
      .from('produtos')
      .select('id,nome,preço,quantidade,created_at,updated_at')
      .order('nome'),
    client
      .from('vendas')
      .select('created_at,venda_itens(produto_id,quantidade)')
      .order('created_at', { ascending: false }),
  ]);

  if (produtosError) throw produtosError;
  if (vendasError) throw vendasError;

  const salesTimeline = (vendasData || []).flatMap((venda: any) => (
    (venda.venda_itens || []).map((item: any) => ({
      produto_id: item.produto_id,
      quantidade: Number(item.quantidade ?? 0),
      created_at: venda.created_at,
    }))
  )) as InventorySaleTimelinePoint[];

  return buildInventoryInsights((produtosData as Produto[]) || [], salesTimeline);
};

export const listProdutos = async (userId: string): Promise<Produto[]> => {
  if (isLocalMode) {
    return listLocalProdutos(userId);
  }

  const client = ensureSupabase();
  const { data, error } = await client.from('produtos').select('*').order('nome');
  if (error) throw error;
  return (data as Produto[]) || [];
};

export const saveProduto = async (
  userId: string,
  payload: ProdutoPayload,
  editId?: string,
) => {
  if (isLocalMode) {
    saveLocalProduto(userId, payload, editId);
    return;
  }

  const client = ensureSupabase();

  if (editId) {
    const { error } = await client
      .from('produtos')
      .update(payload)
      .eq('id', editId);
    if (error) throw error;
    return;
  }

  const { error } = await client.from('produtos').insert({
    user_id: userId,
    ...payload,
  });
  if (error) throw error;
};

export const removeProduto = async (userId: string, id: string) => {
  if (isLocalMode) {
    deleteLocalProduto(userId, id);
    return;
  }

  const client = ensureSupabase();
  const { error } = await client.from('produtos').delete().eq('id', id);
  if (error) throw error;
};

export const listCaixaEntries = async (userId: string): Promise<CaixaEntry[]> => {
  if (isLocalMode) {
    return listLocalCaixaEntries(userId);
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from('caixa')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data as CaixaEntry[]) || [];
};

export const addCaixaEntry = async (userId: string, payload: CaixaPayload) => {
  if (isLocalMode) {
    addLocalCaixaEntry(userId, payload);
    return;
  }

  const client = ensureSupabase();
  const { error } = await client.from('caixa').insert({
    user_id: userId,
    ...payload,
  });
  if (error) throw error;
};

export const listVendasHoje = async (userId: string): Promise<Venda[]> => {
  if (isLocalMode) {
    return listLocalVendasHoje(userId);
  }

  const client = ensureSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await client
    .from('vendas')
    .select('*, venda_itens(*)')
    .gte('created_at', `${today}T00:00:00`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Venda[]) || [];
};

export const listVendasPorData = async (userId: string, dataISO: string): Promise<Venda[]> => {
  if (isLocalMode) {
    return listLocalVendasPorData(userId, dataISO);
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from('vendas')
    .select('*, venda_itens(*)')
    .gte('created_at', `${dataISO}T00:00:00`)
    .lte('created_at', `${dataISO}T23:59:59.999Z`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Venda[]) || [];
};

export const finalizeVenda = async (
  userId: string,
  cart: SaleCartItem[],
  payment: SalePaymentPayload,
) => {
  if (isLocalMode) {
    finalizeLocalVendaComPagamento(userId, cart, payment);
    return;
  }

  const client = ensureSupabase();
  const total = cart.reduce((acc, item) => acc + item.produto.preco * item.qtd, 0);
  const valorTaxa = Number((total * payment.taxa_percentual / 100).toFixed(2));
  const valorLiquido = Number((total - valorTaxa).toFixed(2));

  const { data: venda, error: vendaError } = await client
    .from('vendas')
    .insert({
      user_id: userId,
      total,
      forma_pagamento: payment.forma_pagamento,
      taxa_percentual: payment.taxa_percentual,
      valor_taxa: valorTaxa,
      valor_liquido: valorLiquido,
    })
    .select()
    .single();

  if (vendaError || !venda) {
    throw vendaError ?? new Error('Erro ao registrar venda.');
  }

  const itens = cart.map((item) => ({
    venda_id: venda.id,
    produto_id: item.produto.id,
    produto_nome: item.produto.nome,
    quantidade: item.qtd,
    preco_unitario: item.produto.preco,
    subtotal: item.produto.preco * item.qtd,
  }));

  const { error: itensError } = await client.from('venda_itens').insert(itens);
  if (itensError) throw itensError;

  for (const item of cart) {
    const { error: estoqueError } = await client
      .from('produtos')
      .update({ quantidade: item.produto.quantidade - item.qtd })
      .eq('id', item.produto.id);

    if (estoqueError) throw estoqueError;
  }

  const { error: caixaError } = await client.from('caixa').insert({
    user_id: userId,
    tipo: 'entrada',
    valor: valorLiquido,
    descricao: `Venda #${venda.id.slice(0, 8)}`,
    origem: 'venda',
    categoria: 'venda',
    forma_pagamento: payment.forma_pagamento,
    taxa_percentual: payment.taxa_percentual,
    valor_bruto: total,
    valor_taxa: valorTaxa,
  });

  if (caixaError) throw caixaError;
};

export const updateVenda = async (
  userId: string,
  vendaId: string,
  newCart: SaleCartItem[],
  payment: SalePaymentPayload,
) => {
  if (isLocalMode) {
    updateLocalVendaComPagamento(userId, vendaId, newCart, payment);
    return;
  }

  const client = ensureSupabase();
  
  const total = newCart.reduce((acc, item) => acc + item.produto.preco * item.qtd, 0);
  const valorTaxa = Number((total * payment.taxa_percentual / 100).toFixed(2));
  const valorLiquido = Number((total - valorTaxa).toFixed(2));

  // 1. Fetch old items
  const { data: oldItens, error: fetchError } = await client.from('venda_itens').select('*').eq('venda_id', vendaId);
  if (fetchError) throw fetchError;

  // 2. Restore stock for old items
  for (const oldItem of oldItens || []) {
    const { data: prod } = await client.from('produtos').select('quantidade').eq('id', oldItem.produto_id).single();
    if (prod) {
      await client.from('produtos').update({ quantidade: Number(prod.quantidade) + Number(oldItem.quantidade) }).eq('id', oldItem.produto_id);
    }
  }

  // 3. Deduct stock for new items
  for (const item of newCart) {
    const { data: prod } = await client.from('produtos').select('quantidade').eq('id', item.produto.id).single();
    if (!prod) throw new Error(`Produto não encontrado: ${item.produto.nome}`);
    const newQtd = Number(prod.quantidade) - Number(item.qtd);
    if (newQtd < 0) throw new Error(`Estoque insuficiente para ${item.produto.nome}.`);
    
    await client.from('produtos').update({ quantidade: newQtd }).eq('id', item.produto.id);
  }

  // 4. Update venda record
  const { error: vendaError } = await client.from('vendas').update({
    total,
    forma_pagamento: payment.forma_pagamento,
    taxa_percentual: payment.taxa_percentual,
    valor_taxa: valorTaxa,
    valor_liquido: valorLiquido,
  }).eq('id', vendaId).eq('user_id', userId);
  if (vendaError) throw vendaError;

  // 5. Replace items
  await client.from('venda_itens').delete().eq('venda_id', vendaId);

  const itensToInsert = newCart.map((item) => ({
    venda_id: vendaId,
    produto_id: item.produto.id,
    produto_nome: item.produto.nome,
    quantidade: item.qtd,
    preco_unitario: item.produto.preco,
    subtotal: item.produto.preco * item.qtd,
  }));
  const { error: insertError } = await client.from('venda_itens').insert(itensToInsert);
  if (insertError) throw insertError;

  // 6. Update caixa
  const { data: caixaEntry } = await client.from('caixa').select('id').eq('user_id', userId).eq('descrição', `Venda #${vendaId.slice(0, 8)}`).maybeSingle();
  
  if (caixaEntry) {
    const { error: caixaError } = await client.from('caixa').update({
      valor: valorLiquido,
      forma_pagamento: payment.forma_pagamento,
      taxa_percentual: payment.taxa_percentual,
      valor_bruto: total,
      valor_taxa: valorTaxa,
    }).eq('id', caixaEntry.id);
    if (caixaError) throw caixaError;
  }
};
