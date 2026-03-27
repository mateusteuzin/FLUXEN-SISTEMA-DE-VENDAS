import { useEffect, useMemo, useState } from 'react';
import { FileBadge2, FileCheck2, Plus, ReceiptText, ShieldCheck, XCircle } from 'lucide-react';
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
  createInvoice,
  getErpModuleState,
  updateInvoiceStatus,
  type InvoiceStatus,
  type InvoiceType,
} from '@/lib/erp-modules';

const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  rascunho: 'Rascunho',
  emitida: 'Emitida',
  autorizada: 'Autorizada',
  cancelada: 'Cancelada',
};

const invoiceStatusClass: Record<InvoiceStatus, string> = {
  rascunho: 'bg-slate-200 text-slate-700',
  emitida: 'bg-blue-500/15 text-blue-700',
  autorizada: 'bg-emerald-500/15 text-emerald-700',
  cancelada: 'bg-rose-500/15 text-rose-700',
};

type InvoiceFormState = {
  client: string;
  amount: string;
  status: InvoiceStatus | '';
  issuedAt: string;
  dueAt: string;
  series: string;
  type: InvoiceType | '';
};

const createEmptyInvoiceForm = (): InvoiceFormState => ({
  client: '',
  amount: '',
  status: '',
  issuedAt: '',
  dueAt: '',
  series: '',
  type: '',
});

export default function NotasFiscais() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moduleState, setModuleState] = useState(() => (user ? getErpModuleState(user.id) : null));
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormState>(createEmptyInvoiceForm);

  useEffect(() => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  }, [user]);

  const refresh = () => {
    if (!user) return;
    setModuleState(getErpModuleState(user.id));
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (open) {
      setInvoiceForm(createEmptyInvoiceForm());
    }
  };

  const invoices = useMemo(() => moduleState?.invoices ?? [], [moduleState?.invoices]);
  const approvedValue = useMemo(
    () => invoices.filter((invoice) => invoice.status === 'autorizada').reduce((acc, invoice) => acc + invoice.amount, 0),
    [invoices],
  );

  const handleCreateInvoice = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const amount = Number(invoiceForm.amount);

    if (
      !invoiceForm.client.trim()
      || !invoiceForm.issuedAt
      || !invoiceForm.dueAt
      || !invoiceForm.series.trim()
      || !invoiceForm.type
      || !invoiceForm.status
      || Number.isNaN(amount)
    ) {
      toast.error('Preencha todos os campos da nota fiscal.');
      return;
    }

    createInvoice(user.id, {
      client: invoiceForm.client.trim(),
      amount,
      status: invoiceForm.status,
      issuedAt: invoiceForm.issuedAt,
      dueAt: invoiceForm.dueAt,
      series: invoiceForm.series.trim(),
      type: invoiceForm.type,
    });
    toast.success('Nota fiscal registrada.');
    setDialogOpen(false);
    setInvoiceForm(createEmptyInvoiceForm());
    refresh();
  };

  const handleStatusChange = (invoiceId: string, status: InvoiceStatus) => {
    if (!user) return;
    updateInvoiceStatus(user.id, invoiceId, status);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notas fiscais"
        title="Area fiscal organizada para vender com mais seguranca"
        description="Concentre NF-e e NFS-e em uma tela profissional, com serie, vencimento, valor total e status da documentacao sempre visiveis."
        icon={ReceiptText}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={() => handleDialogOpenChange(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nova nota
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">NF-e e NFS-e</Badge>
        <Badge className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 hover:bg-emerald-400/15">Pronto para demonstracao fiscal</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Notas emitidas"
          value={String(invoices.filter((invoice) => invoice.status === 'emitida').length)}
          helper="Documentos enviados para o fluxo fiscal"
          icon={FileBadge2}
          tone="blue"
        />
        <MetricCard
          title="Autorizadas"
          value={String(invoices.filter((invoice) => invoice.status === 'autorizada').length)}
          helper="Notas com validacao concluida"
          icon={ShieldCheck}
          tone="emerald"
        />
        <MetricCard
          title="Valor autorizado"
          value={formatCurrency(approvedValue)}
          helper="Volume financeiro com cobertura fiscal"
          icon={FileCheck2}
          tone="amber"
        />
        <MetricCard
          title="Canceladas"
          value={String(invoices.filter((invoice) => invoice.status === 'cancelada').length)}
          helper="Documentos que exigem revisao"
          icon={XCircle}
          tone="rose"
        />
      </div>

      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Fila fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Serie</TableHead>
                <TableHead>Emissao</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-500">
                    Nenhuma nota fiscal cadastrada no momento.
                  </TableCell>
                </TableRow>
              )}
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-slate-900">{invoice.number}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="uppercase">{invoice.type}</TableCell>
                  <TableCell>{invoice.series}</TableCell>
                  <TableCell>{formatDate(invoice.issuedAt)}</TableCell>
                  <TableCell>{formatDate(invoice.dueAt)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-full ${invoiceStatusClass[invoice.status]}`}>
                      {invoiceStatusLabel[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {invoice.status !== 'emitida' && invoice.status !== 'autorizada' && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(invoice.id, 'emitida')}>
                          Emitir
                        </Button>
                      )}
                      {invoice.status !== 'autorizada' && (
                        <Button size="sm" onClick={() => handleStatusChange(invoice.id, 'autorizada')}>
                          Autorizar
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

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Nova nota fiscal</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateInvoice} className="grid gap-4 pt-4 md:grid-cols-2">
            <Input
              placeholder="Cliente"
              value={invoiceForm.client}
              onChange={(event) => setInvoiceForm((current) => ({ ...current, client: event.target.value }))}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor"
              value={invoiceForm.amount}
              onChange={(event) => setInvoiceForm((current) => ({ ...current, amount: event.target.value }))}
              required
            />
            <Input
              type="date"
              value={invoiceForm.issuedAt}
              onChange={(event) => setInvoiceForm((current) => ({ ...current, issuedAt: event.target.value }))}
              required
            />
            <Input
              type="date"
              value={invoiceForm.dueAt}
              onChange={(event) => setInvoiceForm((current) => ({ ...current, dueAt: event.target.value }))}
              required
            />
            <Select
              value={invoiceForm.type || undefined}
              onValueChange={(value) => setInvoiceForm((current) => ({ ...current, type: value as InvoiceType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nfe">NF-e</SelectItem>
                <SelectItem value="nfse">NFS-e</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Serie"
              value={invoiceForm.series}
              onChange={(event) => setInvoiceForm((current) => ({ ...current, series: event.target.value }))}
              required
            />
            <Select
              value={invoiceForm.status || undefined}
              onValueChange={(value) => setInvoiceForm((current) => ({ ...current, status: value as InvoiceStatus }))}
            >
              <SelectTrigger className="md:col-span-2">
                <SelectValue placeholder="Status inicial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="emitida">Emitida</SelectItem>
                <SelectItem value="autorizada">Autorizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="h-11 w-full rounded-xl md:col-span-2">
              Salvar nota
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
