import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, Plus, ShieldCheck, Tags, TrendingUp, Truck, Users } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate, formatPercent } from '@/lib/erp-formatters';
import {
  createCategory,
  createCustomer,
  createSupplier,
  getErpModuleState,
  type CategoryPayload,
  type CategoryStatus,
  type CustomerPayload,
  type CustomerStatus,
  type SupplierPayload,
  type SupplierStatus,
} from '@/lib/erp-modules';

type CadastroTab = 'clientes' | 'fornecedores' | 'categorias';

const customerStatusLabel: Record<CustomerStatus, string> = {
  vip: 'VIP',
  ativo: 'Ativo',
  em_risco: 'Em risco',
};

const supplierStatusLabel: Record<SupplierStatus, string> = {
  homologado: 'Homologado',
  negociacao: 'Negociacao',
  critico: 'Critico',
};

const categoryStatusLabel: Record<CategoryStatus, string> = {
  ativa: 'Ativa',
  sazonal: 'Sazonal',
  nova: 'Nova',
};

const badgeTone: Record<string, string> = {
  VIP: 'bg-emerald-500/15 text-emerald-700',
  Ativo: 'bg-blue-500/15 text-blue-700',
  'Em risco': 'bg-rose-500/15 text-rose-700',
  Homologado: 'bg-emerald-500/15 text-emerald-700',
  Negociacao: 'bg-amber-500/15 text-amber-700',
  Critico: 'bg-rose-500/15 text-rose-700',
  Ativa: 'bg-blue-500/15 text-blue-700',
  Sazonal: 'bg-amber-500/15 text-amber-700',
  Nova: 'bg-emerald-500/15 text-emerald-700',
};

const getTabFromPath = (pathname: string): CadastroTab => {
  if (pathname.includes('/fornecedores')) return 'fornecedores';
  if (pathname.includes('/categorias')) return 'categorias';
  return 'clientes';
};

const statusBadgeClass = (label: string) => badgeTone[label] ?? 'bg-slate-200 text-slate-700';

export default function Cadastros() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = getTabFromPath(location.pathname);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientes, setClientes] = useState<CustomerPayload>({
    name: '',
    segment: '',
    city: '',
    email: '',
    phone: '',
    status: 'ativo',
  });
  const [fornecedores, setFornecedores] = useState<SupplierPayload>({
    name: '',
    category: '',
    contact: '',
    phone: '',
    leadTimeDays: 5,
    rating: 4.5,
    status: 'homologado',
  });
  const [categorias, setCategorias] = useState<CategoryPayload>({
    name: '',
    code: '',
    itemsCount: 0,
    marginTarget: 20,
    status: 'ativa',
  });
  const [moduleState, setModuleState] = useState(() => (user ? getErpModuleState(user.id) : null));

  useEffect(() => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  };

  const totalWallet = useMemo(
    () => moduleState?.customers.reduce((acc, customer) => acc + customer.totalSpent, 0) ?? 0,
    [moduleState],
  );

  const avgLeadTime = useMemo(() => {
    const suppliers = moduleState?.suppliers ?? [];
    if (suppliers.length === 0) return 0;
    return suppliers.reduce((acc, supplier) => acc + supplier.leadTimeDays, 0) / suppliers.length;
  }, [moduleState]);

  const avgMarginTarget = useMemo(() => {
    const categoriesState = moduleState?.categories ?? [];
    if (categoriesState.length === 0) return 0;
    return categoriesState.reduce((acc, category) => acc + category.marginTarget, 0) / categoriesState.length;
  }, [moduleState]);

  const resetForms = () => {
    setClientes({
      name: '',
      segment: '',
      city: '',
      email: '',
      phone: '',
      status: 'ativo',
    });
    setFornecedores({
      name: '',
      category: '',
      contact: '',
      phone: '',
      leadTimeDays: 5,
      rating: 4.5,
      status: 'homologado',
    });
    setCategorias({
      name: '',
      code: '',
      itemsCount: 0,
      marginTarget: 20,
      status: 'ativa',
    });
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForms();
  };

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (activeTab === 'clientes') {
      createCustomer(user.id, clientes);
      toast.success('Cliente cadastrado com sucesso.');
    }

    if (activeTab === 'fornecedores') {
      createSupplier(user.id, fornecedores);
      toast.success('Fornecedor cadastrado com sucesso.');
    }

    if (activeTab === 'categorias') {
      createCategory(user.id, categorias);
      toast.success('Categoria cadastrada com sucesso.');
    }

    refresh();
    handleDialogClose(false);
  };

  const currentTitle = {
    clientes: 'Clientes e relacionamento',
    fornecedores: 'Fornecedores homologados',
    categorias: 'Categorias comerciais',
  }[activeTab];

  const currentDescription = {
    clientes: 'Centralize carteira, oportunidade aberta e histórico de faturamento para facilitar follow-up comercial.',
    fornecedores: 'Organize contatos de abastecimento, lead time e nivel de risco para comprar melhor e com menos ruptura.',
    categorias: 'Estruture margens, linhas e mix de produtos para operar com mais previsibilidade e uma leitura profissional do portifolio.',
  }[activeTab];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cadastros"
        title={currentTitle}
        description={currentDescription}
        icon={Users}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Novo cadastro
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">CRM e base mestra</Badge>
        <Badge className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 hover:bg-emerald-400/15">Pronto para onboarding</Badge>
      </PageHeader>

      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(`/cadastros/${value}`)}
        className="space-y-5"
      >
        <TabsList className="h-12 rounded-2xl bg-white/90 p-1 shadow-sm">
          <TabsTrigger value="clientes" className="rounded-xl px-4">Clientes</TabsTrigger>
          <TabsTrigger value="fornecedores" className="rounded-xl px-4">Fornecedores</TabsTrigger>
          <TabsTrigger value="categorias" className="rounded-xl px-4">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Clientes ativos"
              value={String(moduleState?.customers.length ?? 0)}
              helper="Base comercial pronta para relacionamento"
              icon={Users}
              tone="blue"
            />
            <MetricCard
              title="Clientes VIP"
              value={String(moduleState?.customers.filter((item) => item.status === 'vip').length ?? 0)}
              helper="Contas com maior potencial de recorrencia"
              icon={ShieldCheck}
              tone="emerald"
            />
            <MetricCard
              title="Carteira acumulada"
              value={formatCurrency(totalWallet)}
              helper="Volume histórico registrado nos cadastros"
              icon={TrendingUp}
              tone="amber"
            />
            <MetricCard
              title="Orçamentos em aberto"
              value={String(moduleState?.customers.reduce((acc, customer) => acc + customer.openQuotes, 0) ?? 0)}
              helper="Oportunidades conectadas ao comercial"
              icon={Building2}
              tone="slate"
            />
          </div>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Carteira de clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último pedido</TableHead>
                    <TableHead>Carteira</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(moduleState?.customers ?? []).map((customer) => {
                    const label = customerStatusLabel[customer.status];
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{customer.name}</p>
                            <p className="text-xs text-slate-500">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.segment}</TableCell>
                        <TableCell>{customer.city}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full ${statusBadgeClass(label)}`}>{label}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(customer.lastOrderAt)}</TableCell>
                        <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Fornecedores"
              value={String(moduleState?.suppliers.length ?? 0)}
              helper="Parceiros monitorados pelo time de compras"
              icon={Truck}
              tone="blue"
            />
            <MetricCard
              title="Homologados"
              value={String(moduleState?.suppliers.filter((item) => item.status === 'homologado').length ?? 0)}
              helper="Base segura para reposicao recorrente"
              icon={ShieldCheck}
              tone="emerald"
            />
            <MetricCard
              title="Lead time medio"
              value={`${avgLeadTime.toFixed(1)} dias`}
              helper="Tempo medio de entrega acordado"
              icon={Building2}
              tone="amber"
            />
            <MetricCard
              title="Fornecedores criticos"
              value={String(moduleState?.suppliers.filter((item) => item.status === 'critico').length ?? 0)}
              helper="Exigem renegociacao ou plano alternativo"
              icon={TrendingUp}
              tone="rose"
            />
          </div>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Mapa de fornecedores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Lead time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(moduleState?.suppliers ?? []).map((supplier) => {
                    const label = supplierStatusLabel[supplier.status];
                    return (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{supplier.name}</p>
                            <p className="text-xs text-slate-500">{supplier.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.leadTimeDays} dias</TableCell>
                        <TableCell>{supplier.rating.toFixed(1)}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full ${statusBadgeClass(label)}`}>{label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Categorias"
              value={String(moduleState?.categories.length ?? 0)}
              helper="Estrutura do mix comercial"
              icon={Tags}
              tone="blue"
            />
            <MetricCard
              title="Ativas"
              value={String(moduleState?.categories.filter((item) => item.status === 'ativa').length ?? 0)}
              helper="Linhas principais em operacao"
              icon={ShieldCheck}
              tone="emerald"
            />
            <MetricCard
              title="Itens mapeados"
              value={String(moduleState?.categories.reduce((acc, category) => acc + category.itemsCount, 0) ?? 0)}
              helper="Portifolio organizado por familia"
              icon={Building2}
              tone="amber"
            />
            <MetricCard
              title="Margem alvo"
              value={formatPercent(avgMarginTarget)}
              helper="Media planejada entre as categorias"
              icon={TrendingUp}
              tone="slate"
            />
          </div>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Governanca de categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Margem alvo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(moduleState?.categories ?? []).map((category) => {
                    const label = categoryStatusLabel[category.status];
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium text-slate-900">{category.name}</TableCell>
                        <TableCell>{category.code}</TableCell>
                        <TableCell>{category.itemsCount}</TableCell>
                        <TableCell>{formatPercent(category.marginTarget)}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full ${statusBadgeClass(label)}`}>{label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'clientes' && 'Novo cliente'}
              {activeTab === 'fornecedores' && 'Novo fornecedor'}
              {activeTab === 'categorias' && 'Nova categoria'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            {activeTab === 'clientes' && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Nome do cliente"
                  value={clientes.name}
                  onChange={(event) => setClientes((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Segmento"
                  value={clientes.segment}
                  onChange={(event) => setClientes((current) => ({ ...current, segment: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Cidade"
                  value={clientes.city}
                  onChange={(event) => setClientes((current) => ({ ...current, city: event.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={clientes.email}
                  onChange={(event) => setClientes((current) => ({ ...current, email: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Telefone"
                  value={clientes.phone}
                  onChange={(event) => setClientes((current) => ({ ...current, phone: event.target.value }))}
                  required
                />
                <Select
                  value={clientes.status}
                  onValueChange={(value) => setClientes((current) => ({ ...current, status: value as CustomerStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="em_risco">Em risco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === 'fornecedores' && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Nome do fornecedor"
                  value={fornecedores.name}
                  onChange={(event) => setFornecedores((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Categoria de atendimento"
                  value={fornecedores.category}
                  onChange={(event) => setFornecedores((current) => ({ ...current, category: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Contato principal"
                  value={fornecedores.contact}
                  onChange={(event) => setFornecedores((current) => ({ ...current, contact: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Telefone"
                  value={fornecedores.phone}
                  onChange={(event) => setFornecedores((current) => ({ ...current, phone: event.target.value }))}
                  required
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Lead time"
                  value={fornecedores.leadTimeDays}
                  onChange={(event) => setFornecedores((current) => ({ ...current, leadTimeDays: Number(event.target.value) || 1 }))}
                  required
                />
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="Rating"
                  value={fornecedores.rating}
                  onChange={(event) => setFornecedores((current) => ({ ...current, rating: Number(event.target.value) || 1 }))}
                  required
                />
                <Select
                  value={fornecedores.status}
                  onValueChange={(value) => setFornecedores((current) => ({ ...current, status: value as SupplierStatus }))}
                >
                  <SelectTrigger className="md:col-span-2">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homologado">Homologado</SelectItem>
                    <SelectItem value="negociacao">Negociacao</SelectItem>
                    <SelectItem value="critico">Critico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === 'categorias' && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Nome da categoria"
                  value={categorias.name}
                  onChange={(event) => setCategorias((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Código"
                  value={categorias.code}
                  onChange={(event) => setCategorias((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                  required
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Itens"
                  value={categorias.itemsCount}
                  onChange={(event) => setCategorias((current) => ({ ...current, itemsCount: Number(event.target.value) || 0 }))}
                  required
                />
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Margem alvo"
                  value={categorias.marginTarget}
                  onChange={(event) => setCategorias((current) => ({ ...current, marginTarget: Number(event.target.value) || 0 }))}
                  required
                />
                <Select
                  value={categorias.status}
                  onValueChange={(value) => setCategorias((current) => ({ ...current, status: value as CategoryStatus }))}
                >
                  <SelectTrigger className="md:col-span-2">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="sazonal">Sazonal</SelectItem>
                    <SelectItem value="nova">Nova</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="h-11 w-full rounded-xl">
              Salvar cadastro
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
