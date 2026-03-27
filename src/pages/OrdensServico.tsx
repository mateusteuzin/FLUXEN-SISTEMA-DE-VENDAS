import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Gauge, Plus, ShieldAlert, TimerReset, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '@/components/erp/MetricCard';
import { PageHeader } from '@/components/erp/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/erp-formatters';
import {
  createServiceOrder,
  getErpModuleState,
  updateServiceOrderStatus,
  type ServiceOrderPayload,
  type ServiceOrderPriority,
  type ServiceOrderStatus,
} from '@/lib/erp-modules';

const orderStatusLabel: Record<ServiceOrderStatus, string> = {
  aberta: 'Aberta',
  em_execucao: 'Em execucao',
  aguardando: 'Aguardando',
  concluida: 'Concluida',
};

const orderStatusClass: Record<ServiceOrderStatus, string> = {
  aberta: 'bg-blue-500/15 text-blue-700',
  em_execucao: 'bg-amber-500/15 text-amber-700',
  aguardando: 'bg-slate-200 text-slate-700',
  concluida: 'bg-emerald-500/15 text-emerald-700',
};

const priorityClass: Record<ServiceOrderPriority, string> = {
  baixa: 'bg-slate-200 text-slate-700',
  media: 'bg-blue-500/15 text-blue-700',
  alta: 'bg-amber-500/15 text-amber-700',
  critica: 'bg-rose-500/15 text-rose-700',
};

const nextStatus: Record<ServiceOrderStatus, ServiceOrderStatus> = {
  aberta: 'em_execucao',
  em_execucao: 'aguardando',
  aguardando: 'concluida',
  concluida: 'concluida',
};

export default function OrdensServico() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moduleState, setModuleState] = useState(() => (user ? getErpModuleState(user.id) : null));
  const [orderForm, setOrderForm] = useState<ServiceOrderPayload>({
    client: '',
    service: '',
    technician: '',
    priority: 'media',
    status: 'aberta',
    scheduledFor: '',
    amount: 0,
  });

  useEffect(() => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  };

  const orders = useMemo(() => moduleState?.serviceOrders ?? [], [moduleState?.serviceOrders]);
  const delayedOrders = useMemo(
    () => orders.filter((order) => order.status !== 'concluida' && new Date(order.scheduledFor).getTime() < Date.now()),
    [orders],
  );

  const openValue = orders
    .filter((order) => order.status !== 'concluida')
    .reduce((acc, order) => acc + order.amount, 0);

  const handleCreateOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    createServiceOrder(user.id, orderForm);
    toast.success('Ordem de serviço criada.');
    setDialogOpen(false);
    setOrderForm({
      client: '',
      service: '',
      technician: '',
      priority: 'media',
      status: 'aberta',
      scheduledFor: '',
      amount: 0,
    });
    refresh();
  };

  const handleAdvanceOrder = (orderId: string, status: ServiceOrderStatus) => {
    if (!user || status === 'concluida') return;
    updateServiceOrderStatus(user.id, orderId, nextStatus[status]);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ordens de serviço"
        title="Execucao acompanhada como sistema de operacao real"
        description="Controle prioridades, tecnico responsavel, agenda e etapa de cada ordem para transformar suporte e implantacao em um processo vendavel."
        icon={ClipboardList}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nova OS
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">Fila operacional</Badge>
        <Badge className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-100 hover:bg-amber-400/15">Prioridade e SLA</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="OS em aberto"
          value={String(orders.filter((order) => order.status === 'aberta').length)}
          helper="Itens aguardando início de atendimento"
          icon={ClipboardList}
          tone="blue"
        />
        <MetricCard
          title="Em execucao"
          value={String(orders.filter((order) => order.status === 'em_execucao').length)}
          helper="Demandas sendo tratadas pelo time"
          icon={Wrench}
          tone="amber"
        />
        <MetricCard
          title="Atrasadas"
          value={String(delayedOrders.length)}
          helper="Ordens vencidas ou fora do combinado"
          icon={ShieldAlert}
          tone="rose"
        />
        <MetricCard
          title="Receita pendente"
          value={formatCurrency(openValue)}
          helper="Valor ainda atrelado a ordens não concluida"
          icon={Gauge}
          tone="slate"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Painel operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Tecnico</TableHead>
                  <TableHead>Agenda</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-slate-900">{order.code}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.service}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(order.amount)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.technician}</TableCell>
                    <TableCell>{formatDate(order.scheduledFor)}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full ${priorityClass[order.priority]}`}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full ${orderStatusClass[order.status]}`}>
                        {orderStatusLabel[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={order.status === 'concluida'}
                        onClick={() => handleAdvanceOrder(order.id, order.status)}
                      >
                        Avancar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Monitor de fila</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['aberta', 'em_execucao', 'aguardando', 'concluida'] as ServiceOrderStatus[]).map((status) => (
              <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{orderStatusLabel[status]}</p>
                    <p className="text-sm text-slate-500">OS nessa etapa</p>
                  </div>
                  <Badge className={`rounded-full ${orderStatusClass[status]}`}>
                    {orders.filter((order) => order.status === status).length}
                  </Badge>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-slate-950 px-4 py-5 text-white">
              <div className="flex items-center gap-3">
                <TimerReset className="h-5 w-5" />
                <p className="text-sm font-medium">Pronto para time de atendimento</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Use este modulo como base para implantacao, suporte premium e assistencia tecnica com histórico por cliente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Nova ordem de serviço</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateOrder} className="grid gap-4 pt-4 md:grid-cols-2">
            <Input
              placeholder="Cliente"
              value={orderForm.client}
              onChange={(event) => setOrderForm((current) => ({ ...current, client: event.target.value }))}
              required
            />
            <Input
              placeholder="Serviço"
              value={orderForm.service}
              onChange={(event) => setOrderForm((current) => ({ ...current, service: event.target.value }))}
              required
            />
            <Input
              placeholder="Tecnico"
              value={orderForm.technician}
              onChange={(event) => setOrderForm((current) => ({ ...current, technician: event.target.value }))}
              required
            />
            <Input
              type="date"
              value={orderForm.scheduledFor}
              onChange={(event) => setOrderForm((current) => ({ ...current, scheduledFor: event.target.value }))}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor"
              value={orderForm.amount}
              onChange={(event) => setOrderForm((current) => ({ ...current, amount: Number(event.target.value) || 0 }))}
              required
            />
            <Select
              value={orderForm.priority}
              onValueChange={(value) => setOrderForm((current) => ({ ...current, priority: value as ServiceOrderPriority }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Critica</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={orderForm.status}
              onValueChange={(value) => setOrderForm((current) => ({ ...current, status: value as ServiceOrderStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="em_execucao">Em execucao</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="concluida">Concluida</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="h-11 w-full rounded-xl md:col-span-2">
              Salvar ordem
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
