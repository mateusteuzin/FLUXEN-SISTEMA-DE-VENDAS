import { useEffect, useState } from 'react';
import { Building2, Cog, MessagesSquare, Save, ShieldCheck, Store } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/erp/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { getErpModuleState, saveSystemSettings, type SystemSettingsRecord } from '@/lib/erp-modules';

export default function Configuracoes() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettingsRecord | null>(null);

  useEffect(() => {
    if (!user) return;
    setSettings(getErpModuleState(user.id).settings);
  }, [user]);

  const handleSave = () => {
    if (!user || !settings) return;
    saveSystemSettings(user.id, settings);
    toast.success('Configuracoes salvas com sucesso.');
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuracoes"
        title="Ajustes para deixar o sistema pronto para venda"
        description="Centralize identidade da empresa, automacoes e parametros operacionais em um unico painel com aparencia de software pago, focado no MVP atual."
        icon={Cog}
        actions={(
          <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-100" onClick={handleSave}>
            <Save className="mr-2 h-5 w-5" />
            Salvar configuracoes
          </Button>
        )}
      >
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">Pronto para onboarding</Badge>
        <Badge className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 hover:bg-emerald-400/15">Base comercial ajustavel</Badge>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-700" />
                Dados da empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Nome da empresa"
                value={settings.companyName}
                onChange={(event) => setSettings((current) => current ? { ...current, companyName: event.target.value } : current)}
              />
              <Input
                placeholder="CNPJ"
                value={settings.companyDocument}
                onChange={(event) => setSettings((current) => current ? { ...current, companyDocument: event.target.value } : current)}
              />
              <Input
                placeholder="E-mail de suporte"
                value={settings.supportEmail}
                onChange={(event) => setSettings((current) => current ? { ...current, supportEmail: event.target.value } : current)}
              />
              <Input
                placeholder="Telefone"
                value={settings.supportPhone}
                onChange={(event) => setSettings((current) => current ? { ...current, supportPhone: event.target.value } : current)}
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-slate-700" />
                Parametros operacionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input
                type="number"
                min="1"
                placeholder="Alerta de estoque"
                value={settings.lowStockAlert}
                onChange={(event) => setSettings((current) => current ? { ...current, lowStockAlert: Number(event.target.value) || 1 } : current)}
              />
              <Input
                type="number"
                min="1"
                placeholder="Prazo padrao"
                value={settings.defaultPaymentTermDays}
                onChange={(event) => setSettings((current) => current ? { ...current, defaultPaymentTermDays: Number(event.target.value) || 1 } : current)}
              />
              <Input
                placeholder="Serie fiscal"
                value={settings.fiscalSeries}
                onChange={(event) => setSettings((current) => current ? { ...current, fiscalSeries: event.target.value } : current)}
              />
              <Input
                placeholder="Centro de distribuicao"
                value={settings.primaryWarehouse}
                onChange={(event) => setSettings((current) => current ? { ...current, primaryWarehouse: event.target.value } : current)}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-slate-700" />
                Posicionamento comercial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.commercialNotes}
                onChange={(event) => setSettings((current) => current ? { ...current, commercialNotes: event.target.value } : current)}
                className="min-h-[140px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
                Automacoes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">Emissao automatica</p>
                  <p className="text-sm text-slate-500">Acelera fechamento e impressao comercial.</p>
                </div>
                <Switch
                  checked={settings.autoInvoice}
                  onCheckedChange={(checked) => setSettings((current) => current ? { ...current, autoInvoice: checked } : current)}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">Relatorios por WhatsApp</p>
                  <p className="text-sm text-slate-500">Entrega de indicadores para gestores e clientes.</p>
                </div>
                <Switch
                  checked={settings.sendWhatsAppReports}
                  onCheckedChange={(checked) => setSettings((current) => current ? { ...current, sendWhatsAppReports: checked } : current)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Checklist de produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Layout com navegacao lateral estilo ERP',
                'Modulos de venda, financeiro e estoque ativos',
                'Base fiscal e relatorios pronta para demonstracao',
                'Configuracoes persistidas por usuario',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
