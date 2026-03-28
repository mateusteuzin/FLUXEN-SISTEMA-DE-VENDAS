import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Caixa from "@/pages/Caixa";
import Produtos from "@/pages/Produtos";
import Vendas from "@/pages/Vendas";
import Estoque from "@/pages/Estoque";
import NotasFiscais from "@/pages/NotasFiscais";
import Relatorios from "@/pages/Relatorios";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/financeiro" element={<ProtectedRoute><Caixa /></ProtectedRoute>} />
    <Route path="/caixa" element={<ProtectedRoute><Caixa /></ProtectedRoute>} />
    <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
    <Route path="/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
    <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
    <Route path="/notas-fiscais" element={<ProtectedRoute><NotasFiscais /></ProtectedRoute>} />
    <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
    <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
    <Route path="/cadastros/*" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
    <Route path="/servicos" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
    <Route path="/orcamentos" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
    <Route path="/ordens-servico" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
