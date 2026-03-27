import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Clock3, LifeBuoy, Plus, Repeat2, Wrench } from 'lucide-react';
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
import { formatCurrency } from '@/lib/erp-formatters';
import {
  createService,
  getErpModuleState,
  type ServicePayload,
  type ServiceStatus,
} from '@/lib/erp-modules';

const serviceStatusLabel: Record<ServiceStatus, string> = {
  ativo: 'Ativo',
  implantacao: 'Implantacao',
  pausado: 'Pausado',
};

const serviceStatusClass: Record<ServiceStatus, string> = {
  ativo: 'bg-emerald-500/15 text-emerald-700',
  implantacao: 'bg-blue-500/15 text-blue-700',
  pausado: 'bg-amber-500/15 text-amber-700',
};

export default function Servicos() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moduleState, setModuleState] = useState(() => (user ? getErpModuleState(user.id) : null));
  const [serviceForm, setServiceForm] = useState<ServicePayload>({
    name: '',
    category: '',
    price: 0,
    durationHours: 1,
    slaHours: 24,
    assignee: '',
    status: 'ativo',
    recurring: false,
  });

  useEffect(() => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  };

  const avgTicket = useMemo(() => {
    const services = moduleState?.services ?? [];
    if (services.length === 0) return 0;
    return services.reduce((acc, service) => acc + service.price, 0) / services.length;
  }, [moduleState]);

  const avgSla = useMemo(() => {
    const services = moduleState?.services ?? [];
    if (services.length === 0) return 0;
    return services.reduce((acc, service) => acc + service.slaHours, 0) / services.length;
  }, [moduleState]);

  const handleCreateService = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    createService(user.id, serviceForm);
    toast.success('Servico adicionado ao catalogo.');
    setDialogOpen(false);
    setServiceForm({
      name: '',
      category: '',
      price: 0,
      durationHours: 1,
      slaHours: 24,
      assignee: '',
      status: 'ativo',
      recurring: false,
    });
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Servicos"
        title="Catalogo de servicos pronto para venda"
        description="Organize ofertas, pacotes recorrentes, SLA e responsaveis em uma vitrine profissional para operacao e demonstracao comercial."
        icon={Wrench}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Novo servico
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">Pacotes recorrentes</Badge>
        <Badge className="rounded-full bg-blue-400/15 px-3 py-1 text-blue-100 hover:bg-blue-400/15">SLA monitorado</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Servicos ativos"
          value={String(moduleState?.services.filter((item) => item.status === 'ativo').length ?? 0)}
          helper="Itens comerciais liberados para venda"
          icon={BriefcaseBusiness}
          tone="blue"
        />
        <MetricCard
          title="Recorrentes"
          value={String(moduleState?.services.filter((item) => item.recurring).length ?? 0)}
          helper="Receita previsivel em contratos e suporte"
          icon={Repeat2}
          tone="emerald"
        />
        <MetricCard
          title="Ticket medio"
          value={formatCurrency(avgTicket)}
          helper="Preco medio do portfolio de servicos"
          icon={LifeBuoy}
          tone="amber"
        />
        <MetricCard
          title="SLA medio"
          value={`${avgSla.toFixed(0)}h`}
          helper="Prazo operacional prometido ao cliente"
          icon={Clock3}
          tone="slate"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Catalogo comercial</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servico</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Responsavel</TableHead>
                  <TableHead>Duracao</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(moduleState?.services ?? []).map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{service.name}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {service.recurring ? (
                            <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">Recorrente</Badge>
                          ) : (
                            <Badge className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-200">Pontual</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.assignee}</TableCell>
                    <TableCell>{service.durationHours}h</TableCell>
                    <TableCell>{service.slaHours}h</TableCell>
                    <TableCell>{formatCurrency(service.price)}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full ${serviceStatusClass[service.status]}`}>
                        {serviceStatusLabel[service.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Blocos mais vendaveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(moduleState?.services ?? []).slice(0, 3).map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{service.category}</p>
                  </div>
                  <Badge className={`rounded-full ${serviceStatusClass[service.status]}`}>
                    {serviceStatusLabel[service.status]}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">SLA {service.slaHours}h</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(service.price)}</span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-slate-950 px-4 py-5 text-white">
              <p className="text-sm font-medium">Pronto para oferecer em proposta</p>
              <p className="mt-2 text-sm text-slate-300">
                Combine servicos de implantacao, suporte e treinamento para criar pacotes com mais margem e previsibilidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Novo servico</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateService} className="grid gap-4 pt-4 md:grid-cols-2">
            <Input
              placeholder="Nome do servico"
              value={serviceForm.name}
              onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <Input
              placeholder="Categoria"
              value={serviceForm.category}
              onChange={(event) => setServiceForm((current) => ({ ...current, category: event.target.value }))}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Preco"
              value={serviceForm.price}
              onChange={(event) => setServiceForm((current) => ({ ...current, price: Number(event.target.value) || 0 }))}
              required
            />
            <Input
              type="number"
              min="1"
              placeholder="Duracao (h)"
              value={serviceForm.durationHours}
              onChange={(event) => setServiceForm((current) => ({ ...current, durationHours: Number(event.target.value) || 1 }))}
              required
            />
            <Input
              type="number"
              min="1"
              placeholder="SLA (h)"
              value={serviceForm.slaHours}
              onChange={(event) => setServiceForm((current) => ({ ...current, slaHours: Number(event.target.value) || 1 }))}
              required
            />
            <Input
              placeholder="Responsavel"
              value={serviceForm.assignee}
              onChange={(event) => setServiceForm((current) => ({ ...current, assignee: event.target.value }))}
              required
            />
            <Select
              value={serviceForm.status}
              onValueChange={(value) => setServiceForm((current) => ({ ...current, status: value as ServiceStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="implantacao">Implantacao</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={serviceForm.recurring ? 'sim' : 'nao'}
              onValueChange={(value) => setServiceForm((current) => ({ ...current, recurring: value === 'sim' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Recorrencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Recorrente</SelectItem>
                <SelectItem value="nao">Pontual</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="h-11 w-full rounded-xl md:col-span-2">
              Salvar servico
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
