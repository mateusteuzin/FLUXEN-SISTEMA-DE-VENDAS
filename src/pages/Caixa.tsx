import { useEffect, useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Plus, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { addCaixaEntry, listCaixaEntries, type CaixaEntry } from '@/lib/store';

const categoryOptions: Record<string, Array<{ value: string; label: string }>> = {
  entrada: [
    { value: 'suprimento', label: 'Suprimento' },
    { value: 'ajuste', label: 'Ajuste positivo' },
    { value: 'outro', label: 'Outro' },
  ],
  saida: [
    { value: 'despesa', label: 'Despesa' },
    { value: 'retirada', label: 'Retirada' },
    { value: 'ajuste', label: 'Ajuste negativo' },
    { value: 'outro', label: 'Outro' },
  ],
  sangria: [
    { value: 'sangria', label: 'Sangria' },
  ],
};

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
);

const formatPaymentMethod = (value: CaixaEntry['forma_pagamento']) => {
  if (!value) return null;

  if (value === 'crédito') return 'Crédito';
  if (value === 'débito') return 'Débito';
  if (value === 'pix') return 'Pix';
  return 'Dinheiro';
};

export default function Caixa() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CaixaEntry[]>([]);
  const [tipo, setTipo] = useState('entrada');
  const [categoria, setCategoria] = useState('suprimento');
  const [valor, setValor] = useState('');
  const [descrição, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const currentCategories = useMemo(
    () => categoryOptions[tipo] ?? categoryOptions.entrada,
    [tipo],
  );

  useEffect(() => {
    setCategoria(currentCategories[0]?.value ?? 'outro');
  }, [currentCategories]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      const data = await listCaixaEntries(user.id);
      setEntries(data);
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel carregar o financeiro.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const saldo = entries.reduce((acc, entry) => (
    entry.tipo === 'entrada' ? acc + Number(entry.valor) : acc - Number(entry.valor)
  ), 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const valorNumero = Number.parseFloat(valor) || 0;
    if (valorNumero <= 0) {
      toast.error('Informe um valor válido.');
      return;
    }

    setLoading(true);

    try {
      await addCaixaEntry(user.id, {
        tipo: tipo as CaixaEntry['tipo'],
        valor: valorNumero,
        descricao: descrição.trim() || null,
        origem: 'manual',
        categoria,
        valor_bruto: valorNumero,
        valor_taxa: 0,
        taxa_percentual: 0,
      });

      toast.success('Movimentacao registrada com sucesso!');
      setValor('');
      setDescricao('');
      setCategoria((categoryOptions[tipo] ?? categoryOptions.entrada)[0]?.value ?? 'outro');
      await fetchEntries();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  const tipoIcon = (value: string) => {
    if (value === 'entrada') return <ArrowUpCircle className="w-5 h-5 text-success" />;
    if (value === 'saída') return <ArrowDownCircle className="w-5 h-5 text-destructive" />;
    return <Scissors className="w-5 h-5 text-warning" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground mt-1">Use aqui somente ajustes manuais, despesas e sangrias</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Saldo Atual:{' '}
            <span className={saldo >= 0 ? 'text-success' : 'text-destructive'}>
              {formatCurrency(saldo)}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada manual</SelectItem>
                  <SelectItem value="saída">Saída manual</SelectItem>
                  <SelectItem value="sangria">Sangria</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Valor (R$)"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="h-12"
                required
              />

              <Input
                placeholder="Descrição"
                value={descrição}
                onChange={(e) => setDescricao(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Vendas com produto, forma de pagamento e taxa ficam na tela <span className="font-semibold text-foreground">Vendas</span>.
                Aqui no Financeiro entram somente movimentacoes manuais.
              </p>
            </div>

            <Button type="submit" className="h-12 px-6" disabled={loading}>
              <Plus className="w-5 h-5 mr-2" /> Registrar movimentacao
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Histórico Financeiro</CardTitle>
        </CardHeader>

        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum registro ainda</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50">
                  <div className="flex items-start gap-3 min-w-0">
                    {tipoIcon(entry.tipo)}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium capitalize">{entry.tipo}</p>
                        <Badge variant={entry.origem === 'venda' ? 'secondary' : 'outline'}>
                          {entry.origem === 'venda' ? 'Venda automatica' : 'Movimentacao manual'}
                        </Badge>
                        {entry.categoria && entry.categoria !== 'venda' && (
                          <Badge variant="outline">{entry.categoria}</Badge>
                        )}
                        {entry.forma_pagamento && (
                          <Badge variant="secondary">{formatPaymentMethod(entry.forma_pagamento)}</Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.descricao || 'Sem descrição'} - {new Date(entry.created_at).toLocaleString('pt-BR')}
                      </p>

                      {entry.origem === 'venda' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Bruto: {formatCurrency(Number(entry.valor_bruto ?? entry.valor))} | Taxa: {formatCurrency(Number(entry.valor_taxa ?? 0))}
                          {entry.taxa_percentual != null ? ` | Percentual: ${Number(entry.taxa_percentual).toFixed(2)}%` : ''}
                          {' '}| Liquido: {formatCurrency(Number(entry.valor))}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`shrink-0 font-bold ${entry.tipo === 'entrada' ? 'text-success' : 'text-destructive'}`}>
                    {entry.tipo === 'entrada' ? '+' : '-'} {formatCurrency(Number(entry.valor))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
