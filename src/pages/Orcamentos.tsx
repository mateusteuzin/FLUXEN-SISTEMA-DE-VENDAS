import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, FileSpreadsheet, Plus, Send, Wallet } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/erp-formatters';
import {
  createQuote,
  getErpModuleState,
  updateQuoteStatus,
  type QuotePayload,
  type QuoteStatus,
} from '@/lib/erp-modules';

const quoteStatusLabel: Record<QuoteStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  negociacao: 'Negociacao',
  aprovado: 'Aprovado',
  expirado: 'Expirado',
};

const quoteStatusClass: Record<QuoteStatus, string> = {
  rascunho: 'bg-slate-200 text-slate-700',
  enviado: 'bg-blue-500/15 text-blue-700',
  negociacao: 'bg-amber-500/15 text-amber-700',
  aprovado: 'bg-emerald-500/15 text-emerald-700',
  expirado: 'bg-rose-500/15 text-rose-700',
};

type QuoteFilter = 'todos' | QuoteStatus;

export default function Orcamentos() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<QuoteFilter>('todos');
  const [moduleState, setModuleState] = useState(() => (user ? getErpModuleState(user.id) : null));
  const [quoteForm, setQuoteForm] = useState<QuotePayload>({
    client: '',
    amount: 0,
    seller: '',
    channel: '',
    validUntil: '',
    status: 'rascunho',
  });

  useEffect(() => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  };

  const quotes = useMemo(() => moduleState?.quotes ?? [], [moduleState?.quotes]);
  const filteredQuotes = filter === 'todos' ? quotes : quotes.filter((quote) => quote.status === filter);

  const pipelineValue = quotes.reduce((acc, quote) => acc + quote.amount, 0);
  const approvedValue = quotes
    .filter((quote) => quote.status === 'aprovado')
    .reduce((acc, quote) => acc + quote.amount, 0);
  const approvalRate = quotes.length === 0 ? 0 : (quotes.filter((quote) => quote.status === 'aprovado').length / quotes.length) * 100;
  const expiringSoon = useMemo(
    () => quotes.filter((quote) => quote.status !== 'aprovado' && getDaysUntil(quote.validUntil) <= 5).length,
    [quotes],
  );

  const handleCreateQuote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    createQuote(user.id, quoteForm);
    toast.success('Orçamento adicionado ao pipeline.');
    setDialogOpen(false);
    setQuoteForm({
      client: '',
      amount: 0,
      seller: '',
      channel: '',
      validUntil: '',
      status: 'rascunho',
    });
    refresh();
  };

  const changeStatus = (quoteId: string, status: QuoteStatus) => {
    if (!user) return;
    updateQuoteStatus(user.id, quoteId, status);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Orçamentos"
        title="Pipeline comercial com cara de CRM pago"
        description="Acompanhe propostas, negocie com mais controle e deixe a area comercial pronta para demonstrar valor em reunioes de venda."
        icon={FileSpreadsheet}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Novo orçamento
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">Propostas e follow-up</Badge>
        <Badge className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 hover:bg-emerald-400/15">Taxa de aprovacao visivel</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pipeline total"
          value={formatCurrency(pipelineValue)}
          helper="Soma de todas as oportunidades registradas"
          icon={Wallet}
          tone="blue"
        />
        <MetricCard
          title="Aprovado"
          value={formatCurrency(approvedValue)}
          helper="Valor já convertido em proposta aceita"
          icon={CheckCircle2}
          tone="emerald"
        />
        <MetricCard
          title="Conversao"
          value={`${approvalRate.toFixed(1)}%`}
          helper="Percentual de orçamentos aprovados"
          icon={Send}
          tone="amber"
        />
        <MetricCard
          title="Vencendo em breve"
          value={String(expiringSoon)}
          helper="Propostas que pedem follow-up imediato"
          icon={Clock3}
          tone="rose"
        />
      </div>

      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Painel de propostas</CardTitle>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as QuoteFilter)}>
            <TabsList className="rounded-2xl bg-slate-100">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
              <TabsTrigger value="enviado">Enviado</TabsTrigger>
              <TabsTrigger value="negociacao">Negociacao</TabsTrigger>
              <TabsTrigger value="aprovado">Aprovado</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Consultor</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium text-slate-900">{quote.code}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell>{quote.seller}</TableCell>
                  <TableCell>{quote.channel}</TableCell>
                  <TableCell>
                    <div>
                      <p>{formatDate(quote.validUntil)}</p>
                      <p className="text-xs text-slate-500">{getDaysUntil(quote.validUntil)} dias</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(quote.amount)}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-full ${quoteStatusClass[quote.status]}`}>
                      {quoteStatusLabel[quote.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {quote.status !== 'enviado' && quote.status !== 'aprovado' && (
                        <Button variant="outline" size="sm" onClick={() => changeStatus(quote.id, 'enviado')}>
                          Enviar
                        </Button>
                      )}
                      {quote.status !== 'aprovado' && (
                        <Button size="sm" onClick={() => changeStatus(quote.id, 'aprovado')}>
                          Aprovar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Novo orçamento</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateQuote} className="grid gap-4 pt-4 md:grid-cols-2">
            <Input
              placeholder="Cliente"
              value={quoteForm.client}
              onChange={(event) => setQuoteForm((current) => ({ ...current, client: event.target.value }))}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor"
              value={quoteForm.amount}
              onChange={(event) => setQuoteForm((current) => ({ ...current, amount: Number(event.target.value) || 0 }))}
              required
            />
            <Input
              placeholder="Consultor"
              value={quoteForm.seller}
              onChange={(event) => setQuoteForm((current) => ({ ...current, seller: event.target.value }))}
              required
            />
            <Input
              placeholder="Canal"
              value={quoteForm.channel}
              onChange={(event) => setQuoteForm((current) => ({ ...current, channel: event.target.value }))}
              required
            />
            <Input
              type="date"
              value={quoteForm.validUntil}
              onChange={(event) => setQuoteForm((current) => ({ ...current, validUntil: event.target.value }))}
              required
            />
            <Select
              value={quoteForm.status}
              onValueChange={(value) => setQuoteForm((current) => ({ ...current, status: value as QuoteStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="negociacao">Negociacao</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="h-11 w-full rounded-xl md:col-span-2">
              Salvar orçamento
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
