import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  type LucideIcon,
  Wallet,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  activePaths?: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Gestão',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      { label: 'Vendas', to: '/vendas', icon: ShoppingCart },
      { label: 'Produtos', to: '/produtos', icon: Package },
      { label: 'Estoque', to: '/estoque', icon: Boxes },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Financeiro', to: '/financeiro', icon: Wallet, activePaths: ['/financeiro', '/caixa'] },
      { label: 'Notas fiscais', to: '/notas-fiscais', icon: Receipt },
      { label: 'Relatórios', to: '/relatorios', icon: BarChart3 },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Configurações', to: '/configuracoes', icon: Settings },
    ],
  },
];

const matchesPath = (pathname: string, candidate: string) => {
  if (candidate === '/') return pathname === '/';
  return pathname === candidate || pathname.startsWith(`${candidate}/`);
};

const isItemActive = (pathname: string, item: NavItem) => {
  if (item.activePaths?.some((path) => matchesPath(pathname, path))) {
    return true;
  }
  return item.to ? matchesPath(pathname, item.to) : false;
};

function SidebarNav({
  pathname,
  userEmail,
  onNavigate,
  onSignOut,
}: {
  pathname: string;
  userEmail: string;
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-white/10 px-4 py-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full justify-center rounded-[28px] transition-transform duration-200 hover:scale-[1.01]"
        >
          <BrandLogo className="h-[118px] w-full max-w-[222px]" />
        </Link>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Usuário logado
          </p>
          <p className="mt-1 truncate text-sm text-slate-300">{userEmail}</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <div className="mb-3 flex items-center gap-3 px-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                {group.label}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = isItemActive(pathname, item);
                if (!item.to) return null;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-white ring-1 ring-inset ring-blue-400/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200',
                        active
                          ? 'border-blue-400/30 bg-blue-500/15 text-blue-300'
                          : 'border-white/5 bg-white/5 text-slate-400 group-hover:border-white/10 group-hover:bg-white/10 group-hover:text-white',
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-3 py-4">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="h-12 w-full justify-start gap-3 rounded-2xl px-4 text-slate-300 hover:bg-rose-500/10 hover:text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400">
            <LogOut className="h-5 w-5" />
          </span>
          Sair do sistema
        </Button>
      </div>
    </div>
  );
}

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userEmail = user?.email ?? 'conta@empresa.com';

  const handleNavigate = () => setMobileOpen(false);
  const handleSignOut = () => {
    setMobileOpen(false);
    void signOut();
  };

  return (
    <>
      <aside className="no-scrollbar fixed inset-y-0 left-0 z-30 hidden h-screen w-[250px] overflow-y-auto overflow-x-hidden border-r border-white/10 bg-slate-950 md:block">
        <SidebarNav
          pathname={location.pathname}
          userEmail={userEmail}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
        />
      </aside>

      <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" onClick={handleNavigate}>
            <BrandLogo className="h-[68px] w-[192px]" />
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border-slate-200 bg-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[250px] bg-slate-950 p-0">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SidebarNav
            pathname={location.pathname}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}