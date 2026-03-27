import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Boxes, Package2, ShieldAlert, Warehouse } from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '@/components/erp/MetricCard';
import { PageHeader } from '@/components/erp/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/erp-formatters';
import { getErpModuleState } from '@/lib/erp-modules';
import { getInventoryInsights, type InventoryInsights } from '@/lib/store';

const formatDays = (days: number) => (days === 1 ? '1 dia' : `${days} dias`);

export default function Estoque() {
  const { user } = useAuth();
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null);
  const [warehouseName, setWarehouseName] = useState('CD Principal');

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [inventory, modules] = await Promise.all([
          getInventoryInsights(user.id),
          Promise.resolve(getErpModuleState(user.id)),
        ]);

        setInventoryInsights(inventory);
        setWarehouseName(modules.settings.primaryWarehouse);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Nao foi possivel carregar o estoque.';
        toast.error(message);
      }
    };

    void load();
  }, [user]);

  const totalInventoryValue = useMemo(
    () => inventoryInsights?.products.reduce((acc, product) => acc + (product.preco * product.quantidade), 0) ?? 0,
    [inventoryInsights],
  );

  const priorityRestock = inventoryInsights?.highlightedProducts.slice(0, 6) ?? [];
  const staleProducts = inventoryInsights?.staleProducts.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estoque"
        title="Central de abastecimento e risco operacional"
        description="Transforme o estoque em uma mesa de controle com prioridade de reposicao, monitoramento de produtos parados e visao clara do valor armazenado."
        icon={Warehouse}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">{warehouseName}</Badge>
        <Badge className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-100 hover:bg-amber-400/15">Reposicao inteligente</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Produtos monitorados"
          value={String(inventoryInsights?.totalProducts ?? 0)}
          helper="Itens com leitura de giro e abastecimento"
          icon={Package2}
          tone="blue"
        />
        <MetricCard
          title="Unidades em estoque"
          value={String(inventoryInsights?.totalUnits ?? 0)}
          helper="Volume disponivel para venda imediata"
          icon={Boxes}
          tone="emerald"
        />
        <MetricCard
          title="Valor armazenado"
          value={formatCurrency(totalInventoryValue)}
          helper="Capital parado em estoque no momento"
          icon={Warehouse}
          tone="amber"
        />
        <MetricCard
          title="Ruptura e risco"
          value={String((inventoryInsights?.outOfStockCount ?? 0) + (inventoryInsights?.lowStockCount ?? 0))}
          helper="Itens sem estoque ou abaixo do minimo"
          icon={ShieldAlert}
          tone="rose"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Reposicao prioritaria</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ultima venda</TableHead>
                  <TableHead>Preco</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityRestock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                      Nenhuma urgencia de reposicao no momento.
                    </TableCell>
                  </TableRow>
                ) : (
                  priorityRestock.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-slate-900">{product.nome}</TableCell>
                      <TableCell>{product.quantidade}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {product.isOutOfStock && (
                            <Badge className="rounded-full bg-rose-500/15 text-rose-700 hover:bg-rose-500/15">Sem estoque</Badge>
                          )}
                          {product.isLowStock && (
                            <Badge className="rounded-full bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Baixo giro</Badge>
                          )}
                          {product.isStale && (
                            <Badge className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-200">Parado</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDays(product.daysWithoutSale)}</TableCell>
                      <TableCell>{formatCurrency(product.preco)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Pontos de atencao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                  <div>
                    <p className="font-medium text-amber-900">Estoque baixo</p>
                    <p className="text-sm text-amber-800">
                      {inventoryInsights?.lowStockCount ?? 0} item(ns) abaixo do limite configurado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-rose-700" />
                  <div>
                    <p className="font-medium text-rose-900">Ruptura</p>
                    <p className="text-sm text-rose-800">
                      {inventoryInsights?.outOfStockCount ?? 0} item(ns) sem disponibilidade imediata.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Produtos parados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staleProducts.length === 0 ? (
                <p className="text-sm text-slate-500">Sem produtos sem giro recente.</p>
              ) : (
                staleProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{product.nome}</p>
                        <p className="text-sm text-slate-500">Sem venda ha {formatDays(product.daysWithoutSale)}</p>
                      </div>
                      <span className="font-semibold text-slate-900">{formatCurrency(product.preco)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
