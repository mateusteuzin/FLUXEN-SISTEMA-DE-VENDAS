import { useEffect, useState } from 'react';
import { AlertTriangle, Clock3, Package2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  getInventoryInsights,
  removeProduto,
  saveProduto,
  type InventoryInsights,
  type InventoryProductInsight,
} from '@/lib/store';

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
);

const formatDays = (days: number) => (
  days === 1 ? '1 dia' : `${days} dias`
);

const getSalesStatusText = (produto: InventoryProductInsight, staleDaysThreshold: number) => {
  if (produto.isStale) {
    return `Sem vendas ha ${formatDays(produto.daysWithoutSale)}`;
  }

  if (!produto.lastSaleAt) {
    return produto.daysWithoutSale >= staleDaysThreshold
      ? `Sem vendas ha ${formatDays(produto.daysWithoutSale)}`
      : 'Produto novo, ainda sem vendas';
  }

  if (produto.daysWithoutSale === 0) {
    return 'Teve venda hoje';
  }

  return `Ultima venda ha ${formatDays(produto.daysWithoutSale)}`;
};

export default function Produtos() {
  const { user } = useAuth();
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null);
  const [nome, setNome] = useState('');
  const [preço, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const produtos = inventoryInsights?.products ?? [];
  const highlightedProducts = inventoryInsights?.highlightedProducts ?? [];
  const staleDaysThreshold = inventoryInsights?.staleDaysThreshold ?? 15;

  const fetchProdutos = async () => {
    if (!user) return;

    try {
      const data = await getInventoryInsights(user.id);
      setInventoryInsights(data);
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel carregar os produtos.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProdutos();
    }
  }, [user]);

  const resetForm = () => {
    setNome('');
    setPreco('');
    setQuantidade('');
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      await saveProduto(
        user.id,
        {
          nome,
          preco: parseFloat(preço),
          quantidade: parseInt(quantidade, 10),
        },
        editId || undefined,
      );

      toast.success(editId ? 'Produto atualizado!' : 'Produto cadastrado!');
      resetForm();
      setDialogOpen(false);
      await fetchProdutos();
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel salvar o produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produto: InventoryProductInsight) => {
    setEditId(produto.id);
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    if (!user) return;

    try {
      await removeProduto(user.id, id);
      toast.success('Produto excluído!');
      await fetchProdutos();
    } catch (error: any) {
      toast.error(error.message || 'Não foi possivel excluir o produto.');
    }
  };

  const summaryCards = [
    {
      title: 'Produtos',
      value: (inventoryInsights?.totalProducts ?? 0).toString(),
      helper: 'Itens cadastrados',
      icon: Package2,
      tone: 'text-primary',
    },
    {
      title: 'Unidades Em Estoque',
      value: (inventoryInsights?.totalUnits ?? 0).toString(),
      helper: 'Total disponivel para venda',
      icon: Package2,
      tone: 'text-emerald-600',
    },
    {
      title: 'Produto Acabando',
      value: (inventoryInsights?.lowStockCount ?? 0).toString(),
      helper: `Até ${inventoryInsights?.lowStockThreshold ?? 5} unidades`,
      icon: AlertTriangle,
      tone: 'text-amber-600',
    },
    {
      title: 'Produto Parado',
      value: (inventoryInsights?.staleCount ?? 0).toString(),
      helper: `Sem vendas ha ${staleDaysThreshold} dias`,
      icon: Clock3,
      tone: 'text-rose-600',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu estoque com alertas automaticos</p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-12 px-6">
              <Plus className="w-5 h-5 mr-2" /> Novo Produto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <Input
                placeholder="Nome do produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-12"
                required
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Preço (R$)"
                value={preço}
                onChange={(e) => setPreco(e.target.value)}
                className="h-12"
                required
              />
              <Input
                type="number"
                min="0"
                placeholder="Quantidade em estoque"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="h-12"
                required
              />
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {editId ? 'Salvar alterações' : 'Cadastrar produto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.tone}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {highlightedProducts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Estoque Inteligente
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {highlightedProducts.length} produto(s) precisam de atenção agora.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {highlightedProducts.slice(0, 6).map((produto) => (
              <Badge key={produto.id} variant="outline" className="bg-background">
                {produto.nome}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">{produtos.length} produto(s) cadastrado(s)</CardTitle>
        </CardHeader>

        <CardContent>
          {produtos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum produto cadastrado</p>
          ) : (
            <div className="space-y-3">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className={`rounded-xl border p-4 ${
                    produto.isOutOfStock
                      ? 'border-rose-200 bg-rose-50/50'
                      : produto.isLowStock || produto.isStale
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-border bg-muted/40'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">{produto.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(Number(produto.preco))} cada
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Estoque: {produto.quantidade}</Badge>
                        {produto.isOutOfStock && (
                          <Badge className="bg-rose-600 hover:bg-rose-600">Sem estoque</Badge>
                        )}
                        {produto.isLowStock && (
                          <Badge className="bg-amber-500 hover:bg-amber-500">Produto acabando</Badge>
                        )}
                        {produto.isStale && (
                          <Badge variant="outline" className="border-rose-300 text-rose-700">
                            Sem vendas ha {formatDays(produto.daysWithoutSale)}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Quantidade atual: {produto.quantidade} unidade(s)</p>
                        <p>{getSalesStatusText(produto, staleDaysThreshold)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end lg:self-start">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(produto)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(produto.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
