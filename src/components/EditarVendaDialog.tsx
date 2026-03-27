import { useEffect, useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  updateVenda,
  type CaixaPaymentMethod,
  type Produto,
  type Venda,
} from '@/lib/store';

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

interface EditarVendaDialogProps {
  venda: Venda | null;
  produtos: Produto[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditarVendaDialog({
  venda,
  produtos,
  open,
  onOpenChange,
  onSuccess,
}: EditarVendaDialogProps) {
  const { user } = useAuth();
  const [buscaProduto, setBuscaProduto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<CaixaPaymentMethod>('pix');
  const [taxaPercentual, setTaxaPercentual] = useState('0');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (venda && open) {
      setFormaPagamento(venda.forma_pagamento || 'pix');
      setTaxaPercentual(String(venda.taxa_percentual || 0));

      const initialCart: CartItem[] = (venda.venda_itens || []).map(item => {
        let produto = produtos.find(p => p.id === item.produto_id);
        
        // Se o produto foi deletado, criamos um mock
        if (!produto) {
          produto = {
            id: item.produto_id,
            nome: item.produto_nome,
            preco: Number(item.preco_unitario),
            quantidade: 0,
            created_at: venda.created_at,
            updated_at: venda.created_at,
          };
        }

        return {
          produto,
          qtd: Number(item.quantidade),
        };
      });

      setCart(initialCart);
      setBuscaProduto('');
    }
  }, [venda, open, produtos]);

  const taxaNumero = Math.max(0, parseFloat(taxaPercentual) || 0);
  const totalBruto = cart.reduce((acc, item) => acc + item.produto.preco * item.qtd, 0);
  const valorTaxa = Number((totalBruto * taxaNumero / 100).toFixed(2));
  const totalLiquido = Number((totalBruto - valorTaxa).toFixed(2));

  const produtosFiltrados = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();
    return produtos.filter((produto) => {
      if (produto.quantidade <= 0) return false;
      if (!termo) return true;
      return produto.nome.toLowerCase().includes(termo);
    }).slice(0, 5); // Limitar para não quebrar a UI
  }, [buscaProduto, produtos]);

  const handlePaymentMethodChange = (value: CaixaPaymentMethod) => {
    setFormaPagamento(value);
    const option = paymentOptions.find((item) => item.value === value);
    if (option) {
      setTaxaPercentual(option.defaultTax);
    }
  };

  const changeCartQuantity = (produtoId: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.produto.id !== produtoId) return [item];

      const nextQuantity = item.qtd + delta;
      if (nextQuantity <= 0) return [];
      
      // Quando estamos editando, o estoque disponível real é o estoque do produto + a quantidade que já estava na venda original
      const originalItemQuantity = venda?.venda_itens?.find(vi => vi.produto_id === produtoId)?.quantidade || 0;
      const maxAvailable = item.produto.quantidade + Number(originalItemQuantity);

      if (nextQuantity > maxAvailable) {
        toast.error(`Estoque maximo atingido (inclui peças da venda).`);
        return [item];
      }

      return [{ ...item, qtd: nextQuantity }];
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.produto.id !== id));
  };

  const addProductToCart = (produto: Produto) => {
    setCart(current => {
      const existing = current.find(item => item.produto.id === produto.id);
      
      const originalItemQuantity = venda?.venda_itens?.find(vi => vi.produto_id === produto.id)?.quantidade || 0;
      const maxAvailable = produto.quantidade + Number(originalItemQuantity);

      if (existing) {
        if (existing.qtd + 1 > maxAvailable) {
          toast.error("Estoque vazio para este produto");
          return current;
        }
        return current.map(item => item.produto.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item);
      }
      return [...current, { produto, qtd: 1 }];
    });
    setBuscaProduto('');
  };

  const handleSave = async () => {
    if (!user || !venda || cart.length === 0) return;

    setLoading(true);

    try {
      await updateVenda(user.id, venda.id, cart, {
        forma_pagamento: formaPagamento,
        taxa_percentual: taxaNumero,
      });
      toast.success('Venda atualizada com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar venda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Venda #{venda?.id.slice(0, 8)}</DialogTitle>
          <DialogDescription>
            Adicione ou remova itens, altere o pagamento, e o estoque será ajustado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-3 md:grid-cols-2">
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
          </div>

          <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
            <h4 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Itens da Venda
            </h4>
            
            {cart.map((item) => (
              <div key={item.produto.id} className="flex flex-col gap-3 rounded-lg bg-background p-3 md:flex-row md:items-center md:justify-between shadow-sm">
                <div>
                  <p className="font-medium">{item.produto.nome}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.produto.preco)} cada</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="icon" onClick={() => changeCartQuantity(item.produto.id, -1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="min-w-8 text-center font-semibold">{item.qtd}</span>
                  <Button type="button" variant="outline" size="icon" onClick={() => changeCartQuantity(item.produto.id, 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="min-w-28 text-right font-bold">
                    {formatCurrency(item.produto.preco * item.qtd)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.produto.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <p className="text-muted-foreground text-center py-4 text-sm">A venda precisa de pelo menos 1 item.</p>
            )}

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                placeholder="Buscar produto para adicionar (Ex: fone)"
                className="pl-10"
              />
            </div>

            {produtosFiltrados.length > 0 && buscaProduto.trim() !== '' && (
              <div className="mt-2 space-y-2 border rounded-md p-2 bg-background max-h-40 overflow-y-auto">
                {produtosFiltrados.map(produto => (
                  <div key={produto.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-sm">
                    <span className="text-sm font-medium">{produto.nome} - {formatCurrency(produto.preco)}</span>
                    <Button size="sm" variant="secondary" onClick={() => addProductToCart(produto)}>
                      Inserir
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
          </div>

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
              <span className="text-base font-semibold">Valor líquido final</span>
              <span className="text-lg font-bold text-emerald-700">{formatCurrency(totalLiquido)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || cart.length === 0} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
