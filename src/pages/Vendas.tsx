import { useEffect, useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, ShoppingCart, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import {
  finalizeVenda,
  listProdutos,
  listVendasPorData,
  type CaixaPaymentMethod,
  type Produto,
  type Venda,
} from '@/lib/store';
import { EditarVendaDialog } from '@/components/EditarVendaDialog';
interface CartItem {
  produto: Produto;
  qtd: number;
}

const paymentOptions: Array<{
  value: CaixaPaymentMethod;
  label: string;
  defaultTax: string;
}> = [
  { value: 'dinheiro', label: 'Dinheiro', defaultTax: '0' },
  { value: 'pix', label: 'Pix', defaultTax: '0' },
  { value: 'débito', label: 'Débito', defaultTax: '1.99' },
  { value: 'crédito', label: 'Crédito', defaultTax: '3.99' },
];

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
);

const formatPaymentMethod = (value: CaixaPaymentMethod | null) => {
  if (!value) return 'Não informado';

  const option = paymentOptions.find((item) => item.value === value);
  return option?.label ?? value;
};

export default function Vendas() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({});
  const [formaPagamento, setFormaPagamento] = useState<CaixaPaymentMethod>('pix');
  const [taxaPercentual, setTaxaPercentual] = useState('0');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [dataFiltro, setDataFiltro] = useState(() => new Date().toISOString().split('T')[0]);
  const [vendaParaEditar, setVendaParaEditar] = useState<Venda | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const taxaNumero = Math.max(0, Number.parseFloat(taxaPercentual) || 0);
  const totalBruto = cart.reduce((acc, item) => acc + item.produto.preco * item.qtd, 0);
  const valorTaxa = Number((totalBruto * taxaNumero / 100).toFixed(2));
  const totalLiquido = Number((totalBruto - valorTaxa).toFixed(2));
  const produtosFiltrados = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();

    return produtos.filter((produto) => {
      if (produto.quantidade <= 0) return false;
      if (!termo) return true;
      return produto.nome.toLowerCase().includes(termo);
    });
  }, [buscaProduto, produtos]);

  const selectedCount = Object.keys(selectedProducts).length;

  const fetchProdutos = async () => {
    if (!user) return;

    try {
      const data = await listProdutos(user.id);
      setProdutos(data);
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel carregar os produtos.');
    }
  };

  const fetchVendas = async () => {
    if (!user) return;

    try {
      const data = await listVendasPorData(user.id, dataFiltro);
      setVendas(data);
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel carregar as vendas.');
    }
  };

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      await Promise.all([fetchProdutos(), fetchVendas()]);
    };

    load();
  }, [user, dataFiltro]);

  const handlePaymentMethodChange = (value: CaixaPaymentMethod) => {
    setFormaPagamento(value);
    const option = paymentOptions.find((item) => item.value === value);
    if (option) {
      setTaxaPercentual(option.defaultTax);
    }
  };

  const toggleProductSelection = (produto: Produto) => {
    setSelectedProducts((current) => {
      if (current[produto.id]) {
        const next = { ...current };
        delete next[produto.id];
        return next;
      }

      return { ...current, [produto.id]: '1' };
    });
  };

  const updateSelectedQuantity = (produto: Produto, value: string) => {
    const parsed = Math.max(1, Math.min(produto.quantidade, Number.parseInt(value, 10) || 1));
    setSelectedProducts((current) => ({
      ...current,
      [produto.id]: String(parsed),
    }));
  };

  const changeSelectedQuantity = (produto: Produto, delta: number) => {
    const currentValue = Number.parseInt(selectedProducts[produto.id] || '1', 10) || 1;
    const nextValue = Math.max(1, Math.min(produto.quantidade, currentValue + delta));

    setSelectedProducts((current) => ({
      ...current,
      [produto.id]: String(nextValue),
    }));
  };

  const addSelectedToCart = () => {
    const selectedEntries = Object.entries(selectedProducts);
    if (selectedEntries.length === 0) {
      toast.error('Selecione pelo menos um produto.');
      return;
    }

    let nextCart = [...cart];

    for (const [produtoId, quantityValue] of selectedEntries) {
      const produto = produtos.find((item) => item.id === produtoId);
      if (!produto) continue;

      const quantity = Math.max(1, Number.parseInt(quantityValue, 10) || 1);
      const quantityAlreadyInCart = nextCart
        .filter((item) => item.produto.id === produto.id)
        .reduce((acc, item) => acc + item.qtd, 0);

      if (quantity + quantityAlreadyInCart > produto.quantidade) {
        toast.error(`Estoque insuficiente para ${produto.nome}.`);
        return;
      }

      const existing = nextCart.find((item) => item.produto.id === produto.id);
      if (existing) {
        nextCart = nextCart.map((item) => (
          item.produto.id === produto.id
            ? { ...item, qtd: item.qtd + quantity }
            : item
        ));
      } else {
        nextCart.push({ produto, qtd: quantity });
      }
    }

    setCart(nextCart);
    setSelectedProducts({});
    setBuscaProduto('');
    toast.success('Produtos adicionados ao carrinho!');
  };

  const changeCartQuantity = (produtoId: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.produto.id !== produtoId) return [item];

      const nextQuantity = item.qtd + delta;
      if (nextQuantity <= 0) return [];
      if (nextQuantity > item.produto.quantidade) {
        toast.error(`Estoque maximo para ${item.produto.nome}: ${item.produto.quantidade}`);
        return [item];
      }

      return [{ ...item, qtd: nextQuantity }];
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.produto.id !== id));
  };

  const finalizeSale = async () => {
    if (!user || cart.length === 0) return;

    setLoading(true);

    try {
      await finalizeVenda(user.id, cart, {
        forma_pagamento: formaPagamento,
        taxa_percentual: taxaNumero,
      });
      toast.success('Venda registrada com sucesso!');
      setCart([]);
      setSelectedProducts({});
      setBuscaProduto('');
      setFormaPagamento('pix');
      setTaxaPercentual('0');
      await Promise.all([fetchVendas(), fetchProdutos()]);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar venda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendas</h1>
        <p className="text-muted-foreground mt-1">Monte a venda escolhendo varios produtos de uma vez</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-accent" /> Nova Venda
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-xl border border-border p-4 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">Selecione os produtos da venda</p>
                <p className="text-sm text-muted-foreground">
                  Marque varios itens e depois adicione tudo ao carrinho de uma vez.
                </p>
              </div>
              {selectedCount > 0 && (
                <Badge variant="secondary">{selectedCount} produto(s) selecionado(s)</Badge>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                placeholder="Digite para achar: fone, carregador, capinha..."
                className="h-12 pl-10"
              />
            </div>

            {produtosFiltrados.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Nenhum produto encontrado nessa busca.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {produtosFiltrados.map((produto) => {
                  const isSelected = produto.id in selectedProducts;
                  const selectedQuantity = selectedProducts[produto.id] ?? '1';

                  return (
                    <div
                      key={produto.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(Number(produto.preco))} - Estoque: {produto.quantidade}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleProductSelection(produto)}
                        >
                          {isSelected ? 'Selecionado' : 'Selecionar'}
                        </Button>
                      </div>

                      {isSelected && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => changeSelectedQuantity(produto, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={produto.quantidade}
                              value={selectedQuantity}
                              onChange={(e) => updateSelectedQuantity(produto, e.target.value)}
                              className="h-10 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => changeSelectedQuantity(produto, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Subtotal: {formatCurrency(Number(produto.preco) * (Number.parseInt(selectedQuantity, 10) || 1))}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Dica: selecione fone, carregador, capinha e mande tudo junto para o carrinho.
              </p>
              <Button type="button" onClick={addSelectedToCart} disabled={selectedCount === 0}>
                <Plus className="w-5 h-5 mr-2" /> Adicionar selecionados
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select value={formaPagamento} onValueChange={(value) => handlePaymentMethodChange(value as CaixaPaymentMethod)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {paymentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Taxa (%)"
              value={taxaPercentual}
              onChange={(e) => setTaxaPercentual(e.target.value)}
              className="h-12"
            />

            <div className="h-12 rounded-lg border bg-muted/30 px-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taxa</span>
              <span className="font-semibold">{formatCurrency(valorTaxa)}</span>
            </div>

            <div className="h-12 rounded-lg border bg-emerald-50 px-4 flex items-center justify-between">
              <span className="text-sm text-emerald-700">Liquido</span>
              <span className="font-semibold text-emerald-700">{formatCurrency(totalLiquido)}</span>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.produto.id} className="flex flex-col gap-3 rounded-xl bg-muted/50 p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(Number(item.produto.preco))} cada
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => changeCartQuantity(item.produto.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="min-w-8 text-center font-semibold">{item.qtd}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => changeCartQuantity(item.produto.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="min-w-28 text-right font-bold">
                      {formatCurrency(item.produto.preco * item.qtd)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.produto.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total bruto</span>
                  <span className="font-semibold">{formatCurrency(totalBruto)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa</span>
                  <span className="font-semibold">{formatCurrency(valorTaxa)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Valor liquido no caixa</span>
                  <span className="text-lg font-bold text-emerald-700">{formatCurrency(totalLiquido)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 border-t border-border md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Pagamento: {formatPaymentMethod(formaPagamento)}</Badge>
                  <Badge variant="outline">Taxa: {taxaNumero.toFixed(2)}%</Badge>
                </div>
                <Button
                  onClick={finalizeSale}
                  className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={loading}
                >
                  <Check className="w-5 h-5 mr-2" /> Finalizar Venda
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Registro de Vendas</CardTitle>
          <Input 
            type="date" 
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="w-auto h-9"
          />
        </CardHeader>

        <CardContent>
          {vendas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma venda encontrada nesta data</p>
          ) : (
            <div className="space-y-2">
              {vendas.map((venda) => (
                <div key={venda.id} className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">Venda #{venda.id.slice(0, 8)}</p>
                        <Badge variant="secondary">
                          {formatPaymentMethod(venda.forma_pagamento)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(venda.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span className="font-bold text-success">{formatCurrency(Number(venda.total))}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {(venda.venda_itens || [])
                      .map((item) => `${item.produto_nome} (${item.quantidade}x)`)
                      .join(', ')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Taxa: {formatCurrency(Number(venda.valor_taxa ?? 0))} | Liquido: {formatCurrency(Number(venda.valor_liquido ?? venda.total))}
                    {venda.taxa_percentual != null ? ` | Percentual: ${Number(venda.taxa_percentual).toFixed(2)}%` : ''}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button variant="secondary" size="sm" onClick={() => { setVendaParaEditar(venda); setDialogOpen(true); }}>
                      <Edit className="w-4 h-4 mr-2" /> Editar Venda
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditarVendaDialog
        venda={vendaParaEditar}
        produtos={produtos}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          fetchVendas();
          fetchProdutos();
        }}
      />
    </div>
  );
}
