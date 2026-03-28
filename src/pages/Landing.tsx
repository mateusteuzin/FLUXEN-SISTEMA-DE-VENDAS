import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Boxes, CheckCircle2, ChevronRight,
  FileText, LayoutDashboard, Package, Receipt,
  Settings, ShoppingCart, Wallet, TrendingUp,
  ShieldCheck, Zap, Users, X, Phone, MessageCircle,
  Calendar, Lock, UserCheck, ArrowUpRight, ArrowDownRight,
  PieChart, DollarSign, Tag, Search, Menu, Star, Quote,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

import type { Variants, Easing } from 'framer-motion';

/* ─── helpers ─────────────────────────────────────────────── */
const easeOut: Easing = [0.25, 0.46, 0.45, 0.94];
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};
const stagger = (s = 0.1, d = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: s, delayChildren: d } },
});

function FadeIn({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── dados ─────────────────────────────────────────────── */
const FEATURES_GRID = [
  { icon: ShoppingCart, color: '#3b82f6', bg: '#eff6ff', label: 'Vendas', desc: 'Registre e gerencie vendas em segundos com multiplas formas de pagamento.' },
  { icon: Boxes,        color: '#10b981', bg: '#f0fdf4', label: 'Estoque', desc: 'Baixa automatica a cada venda. Nunca mais fique sem controle dos produtos.' },
  { icon: Wallet,       color: '#8b5cf6', bg: '#f5f3ff', label: 'Financeiro', desc: 'Fluxo de caixa completo com entradas, saidas e relatorios automaticos.' },
  { icon: BarChart3,    color: '#f59e0b', bg: '#fffbeb', label: 'Relatorios', desc: 'Graficos e metricas em tempo real para tomar melhores decisoes.' },
  { icon: Receipt,      color: '#ef4444', bg: '#fef2f2', label: 'Notas Fiscais', desc: 'Emita notas fiscais com agilidade diretamente pelo sistema.' },
  { icon: LayoutDashboard, color: '#2563eb', bg: '#eff6ff', label: 'Dashboard', desc: 'Visao completa do seu negocio em um unico painel intuitivo.' },
];

const STEPS = [
  { n: '01', title: 'Crie sua conta gratis', desc: 'Cadastre-se em segundos, sem precisar de cartao de credito. 7 dias para testar tudo.' },
  { n: '02', title: 'Cadastre seus produtos', desc: 'Adicione seu catalogo de produtos com preco e estoque inicial de forma simples.' },
  { n: '03', title: 'Comece a vender', desc: 'Registre vendas, acompanhe o caixa e veja seu negocio crescer em tempo real.' },
];

const STATS = [
  { value: '7 dias', label: 'Teste completamente gratis' },
  { value: 'R$29,90', label: 'Por mes sem fidelidade' },
  { value: '100%', label: 'No navegador, sem instalar' },
  { value: '24/7', label: 'Dados sempre disponiveis' },
];

const FAQS = [
  { q: 'O que e o FLUXEN?', a: 'O FLUXEN e um sistema comercial completo para pequenos e medios negocios. Permite gerenciar vendas, estoque, financeiro e muito mais em um so lugar.' },
  { q: 'Como funciona o teste gratis?', a: 'Voce tem 7 dias para testar todas as funcionalidades sem precisar de cartao de credito. Apos o periodo, assine o plano para continuar.' },
  { q: 'Preciso instalar alguma coisa?', a: 'Nao. O FLUXEN funciona 100% no navegador. Acesse de qualquer dispositivo, em qualquer lugar, a qualquer hora.' },
  { q: 'Meus dados ficam seguros?', a: 'Sim. Todos os dados sao armazenados com criptografia. Voce tem total controle sobre suas informacoes.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim. Nao ha fidelidade. Assine mensalmente e cancele a qualquer momento sem multa.' },
];

const PLAN_BENEFITS = [
  'Dashboard completo em tempo real',
  'Controle de estoque ilimitado',
  'Relatorios e graficos avancados',
  'Emissao de notas fiscais',
  'Suporte prioritario 7 dias',
  'Atualizacoes sempre gratuitas',
];

/* ─── Navbar ─────────────────────────────────────────────── */
const NAV_LINKS: [string, string][] = [
  ['#funcionalidades', 'Funcionalidades'],
  ['#showcase', 'Preview'],
  ['#planos', 'Planos'],
  ['#depoimentos', 'Depoimentos'],
  ['#faq', 'Dúvidas'],
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <motion.header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <Link to="/" onClick={() => setMobileOpen(false)}><BrandLogo className="h-20 w-auto" /></Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <motion.a key={href} href={href} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" whileHover={{ y: -1 }}>
                {label}
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
              <Link to="/login" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Entrar</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>Teste grátis</Link>
            </motion.div>
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="md:hidden fixed top-[68px] left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-xl px-6 py-5"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2.5 border-b border-gray-50 last:border-0 transition-colors">
                  {label}
                </a>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="mt-3 block text-center py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                Entrar no sistema
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center" style={{ background: '#050d1f' }}>

      {/* ── fundo: grade sutil ── */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(37,99,235,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.07) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── orbs animados ── */}
      <motion.div className="pointer-events-none absolute top-[-120px] left-[-80px] h-[520px] w-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.28),transparent 68%)', filter: 'blur(1px)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="pointer-events-none absolute bottom-[-80px] right-[-60px] h-[400px] w-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.22),transparent 68%)', filter: 'blur(1px)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div className="pointer-events-none absolute top-1/2 right-[15%] h-[260px] w-[260px] rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* ── floating UI cards (decorativos) ── */}
      <motion.div
        className="pointer-events-none absolute top-[14%] right-[6%] hidden xl:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="rounded-2xl px-4 py-3 text-xs shadow-2xl backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', minWidth: 150 }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-300 font-semibold">Venda realizada</span>
          </div>
          <p className="font-bold text-sm">R$ 347,00</p>
          <p className="text-gray-400 text-[10px]">Cartao de credito</p>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-[22%] right-[8%] hidden xl:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', minWidth: 160 }}>
          <p className="text-[10px] text-blue-300 font-semibold mb-1">Saldo do caixa</p>
          <p className="font-bold text-lg text-white">R$ 12.840</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-[10px] text-green-400">+18% este mes</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute top-[28%] left-[4%] hidden xl:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', minWidth: 140 }}>
          <p className="text-[10px] text-purple-300 font-semibold mb-1">Produtos</p>
          <p className="font-bold text-lg text-white">124 itens</p>
          <div className="mt-2 space-y-1">
            {[75, 50, 90].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full bg-purple-400" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-[30%] left-[5%] hidden xl:block"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', minWidth: 130 }}>
          <p className="text-[10px] text-yellow-300 font-semibold mb-2">Vendas hoje</p>
          <div className="flex items-end gap-1 h-8">
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 6 ? '#3b82f6' : 'rgba(59,130,246,0.35)' }} />
            ))}
          </div>
          <p className="text-xs font-bold text-white mt-1.5">48 vendas</p>
        </div>
      </motion.div>

      {/* ── conteudo central ── */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center">
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.35)', color: '#93c5fd' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Zap className="h-3 w-3" />
          Sistema FLUXEN de Vendas
        </motion.div>

        <motion.h1
          className="text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          Gerencie seu negocio<br />
          <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            com inteligencia
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
          style={{ color: '#94a3b8' }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          Vendas, estoque e financeiro em um so sistema. Simples, rapido e feito para o seu negocio crescer.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
        >
          <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(22,163,74,0.45)' }} whileTap={{ scale: 0.97 }}>
            <Link to="/login" className="flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
              Comecar teste gratis — 7 dias <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a href="#como-funciona"
              className="rounded-2xl border px-8 py-4 text-base font-semibold backdrop-blur transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.18)', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)' }}>
              Ver como funciona
            </a>
          </motion.div>
        </motion.div>

        {/* mini stats */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { icon: ShieldCheck, text: 'Dados protegidos' },
            { icon: Zap,         text: 'Acesso instantaneo' },
            { icon: Users,       text: 'Sem cartao no teste' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2" style={{ color: '#64748b' }}>
              <Icon className="h-4 w-4 text-blue-400" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-14 border-y" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <p className="text-3xl font-black" style={{ color: '#2563eb' }}>{value}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Showcase ──────────────────────────────────────────── */
const SHOWCASE_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#2563eb' },
  { id: 'vendas',    label: 'Vendas',    icon: ShoppingCart,    color: '#16a34a' },
  { id: 'estoque',   label: 'Estoque',   icon: Boxes,           color: '#10b981' },
  { id: 'financeiro',label: 'Financeiro',icon: Wallet,          color: '#8b5cf6' },
  { id: 'relatorios',label: 'Relatórios',icon: BarChart3,       color: '#f59e0b' },
  { id: 'clientes',  label: 'Clientes',  icon: UserCheck,       color: '#ef4444' },
];

function MockDashboard() {
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      {/* topbar */}
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 6 }} />
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>FLUXEN</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['rgba(59,130,246,0.3)','rgba(16,185,129,0.3)','rgba(245,158,11,0.3)'].map((c,i)=>(
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        {/* sidebar */}
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? 'rgba(37,99,235,0.3)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 0 ? '#60a5fa' : '#475569'} />
            </div>
          ))}
        </div>
        {/* content */}
        <div style={{ flex: 1, padding: 14, overflowY: 'hidden' }}>
          <p style={{ color: '#94a3b8', fontSize: 10, marginBottom: 10 }}>Bem-vindo de volta — visão geral</p>
          {/* cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[
              { label: 'Receita', value: 'R$12.840', icon: DollarSign, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
              { label: 'Vendas', value: '48', icon: ShoppingCart, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
              { label: 'Produtos', value: '124', icon: Package, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
              { label: 'Clientes', value: '31', icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  <Icon size={10} color={color} />
                </div>
                <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{value}</p>
                <p style={{ color: '#64748b', fontSize: 9 }}>{label}</p>
              </div>
            ))}
          </div>
          {/* bar chart fake */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 10 }}>
            <p style={{ color: '#94a3b8', fontSize: 9, marginBottom: 8 }}>Vendas por dia</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
              {[35,55,40,70,60,85,50,90,65,80,45,95].map((h,i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius: '3px 3px 0 0', background: i === 11 ? '#3b82f6' : 'rgba(59,130,246,0.32)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockVendas() {
  const items = [{ p:'Camisa Polo', q:2, v:'R$89,90' },{ p:'Calça Jeans', q:1, v:'R$149,90' },{ p:'Tênis Sport', q:1, v:'R$219,90' }];
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>Nova Venda</span>
        <div style={{ background: 'rgba(22,163,74,0.2)', borderRadius: 20, padding: '2px 10px', color: '#4ade80', fontSize: 10, fontWeight: 700 }}>Em aberto</div>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 1 ? 'rgba(16,185,129,0.25)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 1 ? '#4ade80' : '#475569'} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          {/* search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', marginBottom: 10 }}>
            <Search size={10} color='#475569' />
            <span style={{ color: '#475569', fontSize: 10 }}>Buscar produto...</span>
          </div>
          {/* cart items */}
          <div style={{ marginBottom: 10 }}>
            {items.map(({p,q,v}) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, marginBottom: 4 }}>
                <span style={{ color: '#e2e8f0' }}>{p}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: 9 }}>x{q}</span>
                  <span style={{ color: '#60a5fa', fontWeight: 700 }}>{v}</span>
                </div>
              </div>
            ))}
          </div>
          {/* total */}
          <div style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#94a3b8', fontSize: 10 }}>Total</span>
            <span style={{ color: '#4ade80', fontWeight: 800, fontSize: 14 }}>R$ 549,70</span>
          </div>
          {/* payment */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['Dinheiro','Cartão','Pix'].map((m,i) => (
              <div key={m} style={{ flex:1, padding: '5px 0', textAlign:'center', borderRadius: 6, background: i===2 ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i===2?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.08)'}`, color: i===2?'#93c5fd':'#64748b', fontWeight: i===2?700:400, fontSize: 9 }}>{m}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockEstoque() {
  const prods = [
    { name:'Camisa Polo Azul', qty:42, status:'ok' },
    { name:'Calça Jeans Slim', qty:8, status:'low' },
    { name:'Tênis Sport Branco', qty:15, status:'ok' },
    { name:'Blusa Moletom', qty:3, status:'low' },
    { name:'Cinto de Couro', qty:27, status:'ok' },
  ];
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>Gestão de Estoque</span>
        <div style={{ background: 'rgba(16,185,129,0.2)', borderRadius: 20, padding: '2px 10px', color: '#34d399', fontSize: 10, fontWeight: 700 }}>124 itens</div>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 2 ? 'rgba(16,185,129,0.25)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 2 ? '#34d399' : '#475569'} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px' }}>
              <Search size={10} color='#475569' />
              <span style={{ color:'#475569', fontSize:10 }}>Buscar produto...</span>
            </div>
            <div style={{ background:'rgba(16,185,129,0.25)', border:'1px solid rgba(16,185,129,0.4)', borderRadius:8, padding:'5px 12px', color:'#34d399', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>+ Novo</div>
          </div>
          {prods.map(({ name, qty, status }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:7, marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Tag size={9} color='#34d399' />
                </div>
                <span style={{ color:'#e2e8f0' }}>{name}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'#94a3b8', fontSize:10 }}>{qty} un.</span>
                <div style={{ width:8, height:8, borderRadius:'50%', background: status==='ok'?'#22c55e':'#f59e0b' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockFinanceiro() {
  const moves = [
    { desc:'Venda #482', val:'+R$349', type:'in' },
    { desc:'Fornecedor ABC', val:'-R$1.200', type:'out' },
    { desc:'Venda #481', val:'+R$89', type:'in' },
    { desc:'Aluguel sala', val:'-R$800', type:'out' },
    { desc:'Venda #480', val:'+R$549', type:'in' },
  ];
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>Financeiro</span>
        <span style={{ color: '#94a3b8', fontSize: 10 }}>Março 2026</span>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 3 ? 'rgba(139,92,246,0.25)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 3 ? '#a78bfa' : '#475569'} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          {/* balance card */}
          <div style={{ background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2))', border:'1px solid rgba(139,92,246,0.3)', borderRadius:10, padding:'10px 14px', marginBottom:10 }}>
            <p style={{ color:'#a78bfa', fontSize:9, marginBottom:2 }}>Saldo atual</p>
            <p style={{ color:'#fff', fontWeight:800, fontSize:18 }}>R$ 12.840,00</p>
            <div style={{ display:'flex', gap:16, marginTop:6 }}>
              <div>
                <p style={{ color:'#64748b', fontSize:9 }}>Entradas</p>
                <p style={{ color:'#4ade80', fontWeight:700, fontSize:11 }}>+ R$18.200</p>
              </div>
              <div>
                <p style={{ color:'#64748b', fontSize:9 }}>Saídas</p>
                <p style={{ color:'#f87171', fontWeight:700, fontSize:11 }}>- R$5.360</p>
              </div>
            </div>
          </div>
          {/* moves */}
          {moves.map(({ desc, val, type }) => (
            <div key={desc} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 8px', background:'rgba(255,255,255,0.04)', borderRadius:6, marginBottom:3 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:18, height:18, borderRadius:4, background: type==='in'?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {type==='in' ? <ArrowUpRight size={9} color='#4ade80' /> : <ArrowDownRight size={9} color='#f87171' />}
                </div>
                <span style={{ color:'#94a3b8' }}>{desc}</span>
              </div>
              <span style={{ color: type==='in'?'#4ade80':'#f87171', fontWeight:700 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockRelatorios() {
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>Relatórios</span>
        <div style={{ display:'flex', gap:4 }}>
          {['Semana','Mês','Ano'].map((p,i)=>(
            <div key={p} style={{ padding:'2px 8px', borderRadius:20, background: i===1?'rgba(245,158,11,0.25)':'transparent', border:`1px solid ${i===1?'rgba(245,158,11,0.4)':'rgba(255,255,255,0.08)'}`, color: i===1?'#fbbf24':'#475569', fontSize:9, fontWeight: i===1?700:400 }}>{p}</div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 4 ? 'rgba(245,158,11,0.25)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 4 ? '#fbbf24' : '#475569'} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          {/* top cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
            {[
              { label:'Receita total', value:'R$18.200', up:true },
              { label:'Ticket médio', value:'R$379,00', up:true },
              { label:'Vendas', value:'48 pedidos', up:true },
              { label:'Lucro líquido', value:'R$12.840', up:false },
            ].map(({label,value,up})=>(
              <div key={label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'8px 10px' }}>
                <p style={{ color:'#64748b', fontSize:9, marginBottom:3 }}>{label}</p>
                <p style={{ color:'#e2e8f0', fontWeight:700, fontSize:12 }}>{value}</p>
                <div style={{ display:'flex', alignItems:'center', gap:2, marginTop:2 }}>
                  {up ? <ArrowUpRight size={9} color='#4ade80' /> : <ArrowDownRight size={9} color='#f87171' />}
                  <span style={{ color: up?'#4ade80':'#f87171', fontSize:9 }}>{up?'+18%':'-3%'} vs mês ant.</span>
                </div>
              </div>
            ))}
          </div>
          {/* bars */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'8px 10px' }}>
            <p style={{ color:'#94a3b8', fontSize:9, marginBottom:6 }}>Top produtos vendidos</p>
            {[{n:'Tênis Sport',p:90},{n:'Camisa Polo',p:65},{n:'Calça Jeans',p:45}].map(({n,p})=>(
              <div key={n} style={{ marginBottom:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ color:'#94a3b8', fontSize:9 }}>{n}</span>
                  <span style={{ color:'#fbbf24', fontSize:9, fontWeight:700 }}>{p}%</span>
                </div>
                <div style={{ height:4, borderRadius:4, background:'rgba(255,255,255,0.07)' }}>
                  <div style={{ height:4, borderRadius:4, width:`${p}%`, background:'linear-gradient(90deg,#f59e0b,#fbbf24)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockClientes() {
  const clients = [
    { name:'João Silva', total:'R$2.340', orders:12, status:'ativo' },
    { name:'Maria Souza', total:'R$890', orders:4, status:'ativo' },
    { name:'Carlos Mendes', total:'R$5.100', orders:23, status:'vip' },
    { name:'Ana Costa', total:'R$340', orders:2, status:'inativo' },
    { name:'Pedro Lima', total:'R$1.760', orders:9, status:'ativo' },
  ];
  const statusColor: Record<string,string> = { ativo:'#22c55e', vip:'#a78bfa', inativo:'#94a3b8' };
  return (
    <div style={{ background: '#0f1629', borderRadius: 12, overflow: 'hidden', fontFamily: 'sans-serif', fontSize: 11 }}>
      <div style={{ background: '#111827', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 12 }}>Clientes</span>
        <div style={{ background:'rgba(239,68,68,0.2)', borderRadius:20, padding:'2px 10px', color:'#f87171', fontSize:10, fontWeight:700 }}>31 clientes</div>
      </div>
      <div style={{ display: 'flex', height: 260 }}>
        <div style={{ width: 52, background: '#111827', borderRight: '1px solid #1f2937', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[LayoutDashboard, ShoppingCart, Boxes, Wallet, BarChart3, UserCheck].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === 5 ? 'rgba(239,68,68,0.25)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={14} color={i === 5 ? '#f87171' : '#475569'} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          <div style={{ display:'flex', gap:4, marginBottom:10 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px' }}>
              <Search size={10} color='#475569' />
              <span style={{ color:'#475569', fontSize:10 }}>Buscar cliente...</span>
            </div>
            <div style={{ background:'rgba(239,68,68,0.25)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:8, padding:'5px 12px', color:'#f87171', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>+ Novo</div>
          </div>
          {clients.map(({ name, total, orders, status }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:7, marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:`${statusColor[status]}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <UserCheck size={10} color={statusColor[status]} />
                </div>
                <div>
                  <p style={{ color:'#e2e8f0', lineHeight:1.2 }}>{name}</p>
                  <p style={{ color:'#64748b', fontSize:9 }}>{orders} compras</p>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ color:'#60a5fa', fontWeight:700 }}>{total}</p>
                <p style={{ color:statusColor[status], fontSize:9, fontWeight:600 }}>{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCK_COMPONENTS: Record<string, React.FC> = {
  dashboard: MockDashboard,
  vendas:    MockVendas,
  estoque:   MockEstoque,
  financeiro:MockFinanceiro,
  relatorios:MockRelatorios,
  clientes:  MockClientes,
};

function ShowcaseSection() {
  const [active, setActive] = useState('dashboard');
  const tab = SHOWCASE_TABS.find(t => t.id === active)!;
  const MockComp = MOCK_COMPONENTS[active];

  return (
    <section id="showcase" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)' }}>
      {/* decorative orb */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(ellipse,#bfdbfe,transparent 65%)' }} />

      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Preview do Sistema</p>
          <h2 className="text-4xl font-black text-gray-900">Conheça cada módulo</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Navegue pelas telas reais do sistema e veja como é fácil gerenciar seu negócio.</p>
        </FadeIn>

        {/* tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SHOWCASE_TABS.map(({ id, label, icon: Icon, color }) => (
            <motion.button
              key={id}
              onClick={() => setActive(id)}
              className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: active === id ? color : 'white',
                color: active === id ? 'white' : '#64748b',
                border: `2px solid ${active === id ? color : '#e5e7eb'}`,
                boxShadow: active === id ? `0 4px 18px ${color}44` : 'none',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* mock window */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative"
          >
            {/* browser chrome */}
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: '1px solid rgba(0,0,0,0.1)', background: '#1e293b' }}>
              {/* browser bar */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
                  <div className="h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} />
                  <div className="h-3 w-3 rounded-full" style={{ background: '#22c55e' }} />
                </div>
                <div className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.06)', maxWidth: 280 }}>
                  <Lock className="h-3 w-3" style={{ color: '#22c55e' }} />
                  <span className="text-xs" style={{ color: '#64748b' }}>app.fluxen.com.br/{active}</span>
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: `${tab.color}22`, border: `1px solid ${tab.color}44` }}>
                  <tab.icon className="h-3 w-3" style={{ color: tab.color }} />
                  <span className="text-xs font-semibold" style={{ color: tab.color }}>{tab.label}</span>
                </div>
              </div>
              {/* content */}
              <div style={{ padding: '0' }}>
                <MockComp />
              </div>
            </div>

            {/* caption */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Interface real do módulo <strong className="text-gray-700">{tab.label}</strong> — projetada para ser rápida e intuitiva</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="funcionalidades" className="relative py-24 overflow-hidden">
      {/* bg com pontilhado */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: '#fff',
          backgroundImage: 'radial-gradient(rgba(37,99,235,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* orb decorativo */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle,#bfdbfe,transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Funcionalidades</p>
          <h2 className="text-4xl font-black text-gray-900">Tudo que voce precisa</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Um sistema completo para gerenciar cada parte do seu negocio sem complicacao.</p>
        </FadeIn>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger(0.09, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES_GRID.map(({ icon: Icon, color, bg, label, desc }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group rounded-3xl border bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
              style={{ borderColor: '#e5e7eb' }}
            >
              <div className="mb-4 inline-flex rounded-2xl p-3" style={{ background: bg }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Como funciona ──────────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0d1b3e 0%,#1a3a6e 50%,#0f2744 100%)' }}>

      {/* grade */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* orbs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,#60a5fa,transparent)' }} />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle,#a78bfa,transparent)' }} />

      <div className="relative mx-auto max-w-5xl px-6">
        <FadeIn className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-300">Como funciona</p>
          <h2 className="text-4xl font-black text-white">Comece em 3 passos simples</h2>
          <p className="mt-3 text-blue-200 max-w-lg mx-auto">Em menos de 5 minutos voce ja esta vendendo e controlando seu negocio.</p>
        </FadeIn>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {STEPS.map(({ n, title, desc }, i) => (
            <motion.div
              key={n}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="relative rounded-3xl p-7"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)' }}
            >
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 right-[-24px] z-10">
                  <ChevronRight className="h-5 w-5 text-blue-400 opacity-50" />
                </div>
              )}
              <div className="mb-4 text-5xl font-black" style={{ color: 'rgba(96,165,250,0.25)' }}>{n}</div>
              <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-blue-200 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <FadeIn className="mt-12 text-center" delay={0.2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link to="/login" className="flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
              Criar conta gratis <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section id="planos" className="relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: '#f8fafc',
          backgroundImage: 'radial-gradient(rgba(37,99,235,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,#bfdbfe,transparent)' }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <FadeIn>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Planos</p>
          <h2 className="mb-3 text-4xl font-black text-gray-900">Simples e sem surpresas</h2>
          <p className="mb-14 text-gray-500">Um plano completo. Sem pegadinhas. Cancele quando quiser.</p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <motion.div
            className="relative mx-auto max-w-md rounded-3xl p-10 text-left shadow-2xl overflow-hidden"
            style={{ background: 'linear-gradient(150deg,#0d1b3e,#1a3a6e)' }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            {/* inner glow */}
            <div className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle,#60a5fa,transparent)' }} />

            <div className="relative">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Plano Pro</p>
                <span className="rounded-full px-3 py-0.5 text-xs font-bold text-white" style={{ background: '#16a34a' }}>RECOMENDADO</span>
              </div>
              <p className="mt-2 text-5xl font-black text-white">
                R$ 29,90
                <span className="text-base font-normal text-blue-300 ml-2">/mes</span>
              </p>
              <p className="mt-1 text-sm text-blue-200">7 dias gratis, sem cartao de credito</p>

              <div className="my-7 border-t border-white/10" />

              <motion.ul className="mb-8 space-y-3" variants={stagger(0.07, 0.2)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {PLAN_BENEFITS.map((b) => (
                  <motion.li key={b} variants={fadeUp} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#4ade80' }} />
                    <span className="text-sm text-blue-100">{b}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(22,163,74,0.5)' }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="block w-full rounded-2xl py-4 text-center text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                  Comecar teste gratis — 7 dias
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Duvidas</p>
          <h2 className="text-4xl font-black text-gray-900">Perguntas frequentes</h2>
          <p className="mt-3 text-gray-500">Tudo que voce precisa saber antes de comecar.</p>
        </FadeIn>
        <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <AccordionItem value={`faq-${i}`}
                  className="rounded-2xl border bg-gray-50 px-5 overflow-hidden"
                  style={{ borderColor: '#e5e7eb' }}>
                  <AccordionTrigger className="text-sm font-semibold text-gray-800 hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-5">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA final ──────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#050d1f' }}>
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(37,99,235,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.07) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <motion.div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.2),transparent 65%)' }}
        animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            Pronto para crescer?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: '#94a3b8' }}>
            Junte-se a quem ja usa o FLUXEN para vender mais e com mais controle.
          </p>
          <motion.div className="mt-10 inline-block" whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(22,163,74,0.5)' }} whileTap={{ scale: 0.97 }}>
            <Link to="/login" className="flex items-center gap-2 rounded-2xl px-10 py-5 text-lg font-black text-white"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
              Criar conta gratis agora <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
          <p className="mt-4 text-sm" style={{ color: '#475569' }}>7 dias gratis. Sem cartao. Cancele quando quiser.</p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Modal genérico ──────────────────────────────────────── */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  type ModalKey =
    | null
    | 'financeiro'
    | 'estoque'
    | 'vendas'
    | 'relatorios'
    | 'ajuda'
    | 'contato'
    | 'privacidade'
    | 'termos';

  const [modal, setModal] = useState<ModalKey>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const FOOTER_LINKS: Array<[string, Array<{ label: string; action: () => void }>]> = [
    [
      'Produto',
      [
        { label: 'Funcionalidades', action: () => scrollTo('funcionalidades') },
        { label: 'Planos e Preços', action: () => scrollTo('planos') },
        { label: 'Teste Grátis', action: () => (window.location.href = '/login') },
      ],
    ],
    [
      'Sistema',
      [
        { label: 'Controle Financeiro', action: () => setModal('financeiro') },
        { label: 'Gestão de Estoque', action: () => setModal('estoque') },
        { label: 'Vendas', action: () => setModal('vendas') },
        { label: 'Relatórios', action: () => setModal('relatorios') },
      ],
    ],
    [
      'Suporte',
      [
        { label: 'Central de Ajuda', action: () => setModal('ajuda') },
        { label: 'Contato', action: () => setModal('contato') },
        { label: 'Política de Privacidade', action: () => setModal('privacidade') },
        { label: 'Termos de Uso', action: () => setModal('termos') },
      ],
    ],
  ];

  return (
    <>
      <footer style={{ background: '#020817' }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <BrandLogo className="h-14 w-auto brightness-0 invert mb-4" />
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                Sistema comercial moderno para vender com mais controle.
              </p>
            </div>
            {FOOTER_LINKS.map(([title, links]) => (
              <div key={title as string}>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                  {title as string}
                </p>
                <ul className="space-y-2">
                  {(links as Array<{ label: string; action: () => void }>).map(({ label, action }) => (
                    <li key={label}>
                      <motion.button
                        onClick={action}
                        className="text-sm text-left transition-colors"
                        style={{ color: '#475569' }}
                        whileHover={{ x: 3, color: '#e2e8f0' } as { x: number; color: string }}
                      >
                        {label}
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: '#0f172a' }}>
            <p className="text-xs" style={{ color: '#334155' }}>© 2026 FLUXEN Sistema de Vendas. Todos os direitos reservados.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/login" className="rounded-xl px-5 py-2 text-xs font-bold text-white" style={{ background: '#2563eb' }}>
                Acessar o sistema
              </Link>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* ── Modal: Controle Financeiro ── */}
      <Modal open={modal === 'financeiro'} onClose={() => setModal(null)} title="Controle Financeiro">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
            <div className="p-3 bg-purple-100 rounded-xl"><Wallet className="h-6 w-6 text-purple-600" /></div>
            <div>
              <p className="font-bold text-gray-900">Fluxo de Caixa Completo</p>
              <p className="text-sm text-gray-500">Gerencie entradas e saídas em tempo real.</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            O módulo financeiro do FLUXEN permite que você acompanhe todo o dinheiro que entra e sai do seu negócio. 
            Veja o saldo atual, registre despesas, receba alertas de contas a pagar e gere relatórios automáticos mensais.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Lançamentos de entradas e saídas', 'Saldo atualizado em tempo real', 'Categorias de despesas personalizadas', 'Relatório mensal automático', 'Histórico completo de transações'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" onClick={() => setModal(null)}
            className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Acessar Controle Financeiro
          </Link>
        </div>
      </Modal>

      {/* ── Modal: Gestão de Estoque ── */}
      <Modal open={modal === 'estoque'} onClose={() => setModal(null)} title="Gestão de Estoque">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
            <div className="p-3 bg-green-100 rounded-xl"><Boxes className="h-6 w-6 text-green-600" /></div>
            <div>
              <p className="font-bold text-gray-900">Inventário Inteligente</p>
              <p className="text-sm text-gray-500">Nunca fique sem controle do seu estoque.</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Cadastre seus produtos com foto, preço e quantidade. O sistema dá baixa automática a cada venda realizada 
            e te avisa quando um produto estiver chegando no limite mínimo de estoque.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Baixa automática a cada venda', 'Alertas de estoque mínimo', 'Cadastro com foto e preço de custo', 'Histórico de movimentações', 'Controle por categorias'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" onClick={() => setModal(null)}
            className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Acessar Gestão de Estoque
          </Link>
        </div>
      </Modal>

      {/* ── Modal: Vendas ── */}
      <Modal open={modal === 'vendas'} onClose={() => setModal(null)} title="Módulo de Vendas">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
            <div className="p-3 bg-blue-100 rounded-xl"><ShoppingCart className="h-6 w-6 text-blue-600" /></div>
            <div>
              <p className="font-bold text-gray-900">Vendas Rápidas e Organizadas</p>
              <p className="text-sm text-gray-500">Registre uma venda em segundos.</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Realize vendas de forma simples e rápida. Selecione o produto, escolha a forma de pagamento e finalize. 
            O sistema atualiza o estoque e o financeiro automaticamente, sem trabalho manual.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Múltiplas formas de pagamento', 'Venda com ou sem cliente cadastrado', 'Desconto e parcelamento', 'Comprovante de venda imprimível', 'Histórico completo de vendas'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" onClick={() => setModal(null)}
            className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Acessar Módulo de Vendas
          </Link>
        </div>
      </Modal>

      {/* ── Modal: Relatórios ── */}
      <Modal open={modal === 'relatorios'} onClose={() => setModal(null)} title="Relatórios Analíticos">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
            <div className="p-3 bg-yellow-100 rounded-xl"><BarChart3 className="h-6 w-6 text-yellow-600" /></div>
            <div>
              <p className="font-bold text-gray-900">Dados para Decisões Inteligentes</p>
              <p className="text-sm text-gray-500">Veja o que realmente importa para o seu negócio.</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Acesse relatórios detalhados de vendas, produtos mais vendidos, receita por período, 
            ticket médio, lucro real e muito mais. Tudo em gráficos claros e fáceis de entender.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {['Relatório de vendas por período', 'Produtos mais vendidos', 'Receita e lucro líquido', 'Ticket médio por venda', 'Exportar em PDF ou Excel'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" onClick={() => setModal(null)}
            className="mt-2 block w-full rounded-xl py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Acessar Relatórios
          </Link>
        </div>
      </Modal>

      {/* ── Modal: Central de Ajuda ── */}
      <Modal open={modal === 'ajuda'} onClose={() => setModal(null)} title="Central de Ajuda">
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">Encontre respostas rápidas para as dúvidas mais comuns.</p>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: 'Como faço para cadastrar um produto?', a: 'Vá em "Produtos" no menu lateral, clique em "Novo Produto", preencha nome, preço e quantidade em estoque. Salve e pronto!' },
              { q: 'Como registrar uma venda?', a: 'Acesse o módulo "Vendas", clique em "Nova Venda", selecione os produtos, escolha a forma de pagamento e confirme.' },
              { q: 'Como ver o relatório de vendas?', a: 'Acesse "Relatórios" no menu. Selecione o período desejado e visualize os gráficos e tabelas de desempenho.' },
              { q: 'Posso usar no celular?', a: 'Sim! O FLUXEN funciona em qualquer navegador, seja no computador, tablet ou celular.' },
              { q: 'Como entrar em contato com o suporte?', a: 'Pelo WhatsApp: (88) 99959-2580. Atendemos de segunda a sábado das 8h às 18h.' },
            ].map((item, i) => (
              <AccordionItem key={i} value={`help-${i}`} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 overflow-hidden">
                <AccordionTrigger className="text-sm font-semibold text-gray-800 hover:no-underline py-4">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-4">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <button
            onClick={() => { setModal(null); setTimeout(() => setModal('contato'), 100); }}
            className="w-full rounded-xl py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Falar com o Suporte
          </button>
        </div>
      </Modal>

      {/* ── Modal: Contato ── */}
      <Modal open={modal === 'contato'} onClose={() => setModal(null)} title="Entre em Contato">
        <div className="space-y-6">
          <p className="text-gray-500 text-sm leading-relaxed">
            Nossa equipe está pronta para te ajudar. Entre em contato pelo WhatsApp ou ligue diretamente.
          </p>
          <div className="space-y-3">
            <motion.a
              href="https://wa.me/5588999592580"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border-2 border-green-100 bg-green-50 hover:bg-green-100 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/30">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">WhatsApp</p>
                <p className="text-green-700 font-semibold">(88) 99959-2580</p>
                <p className="text-xs text-gray-500 mt-0.5">Clique para abrir o WhatsApp</p>
              </div>
            </motion.a>
            <motion.a
              href="tel:+5588999592580"
              className="flex items-center gap-4 p-5 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Telefone</p>
                <p className="text-blue-700 font-semibold">(88) 99959-2580</p>
                <p className="text-xs text-gray-500 mt-0.5">Segunda a Sábado, 8h às 18h</p>
              </div>
            </motion.a>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-xs text-gray-500">⏱ Tempo médio de resposta: <strong className="text-gray-700">menos de 2 horas</strong></p>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Política de Privacidade ── */}
      <Modal open={modal === 'privacidade'} onClose={() => setModal(null)} title="Política de Privacidade">
        <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
          <p className="text-xs text-gray-400">Última atualização: Janeiro de 2026</p>
          {[
            { title: '1. Dados Coletados', text: 'Coletamos apenas os dados necessários para o funcionamento do sistema: nome, e-mail e informações de uso. Não vendemos nem compartilhamos seus dados com terceiros.' },
            { title: '2. Uso dos Dados', text: 'Seus dados são utilizados exclusivamente para autenticação, funcionamento das funcionalidades do sistema e comunicação sobre atualizações importantes.' },
            { title: '3. Armazenamento e Segurança', text: 'Todos os dados são armazenados em servidores seguros com criptografia AES-256. Utilizamos conexões HTTPS em todas as comunicações.' },
            { title: '4. Seus Direitos', text: 'Você pode solicitar a exclusão total dos seus dados a qualquer momento, sem impossibilidade de futuro cadastro. Entre em contato pelo (88) 99959-2580.' },
            { title: '5. Cookies', text: 'Utilizamos cookies apenas para manter sua sessão ativa e melhorar a experiência de uso. Nenhum cookie de rastreamento de terceiros é utilizado.' },
          ].map(({ title, text }) => (
            <div key={title}>
              <p className="font-bold text-gray-800 mb-1">{title}</p>
              <p>{text}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
            Dúvidas? Entre em contato: <strong>(88) 99959-2580</strong>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Termos de Uso ── */}
      <Modal open={modal === 'termos'} onClose={() => setModal(null)} title="Termos de Uso">
        <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
          <p className="text-xs text-gray-400">Última atualização: Janeiro de 2026</p>
          {[
            { title: '1. Aceitação dos Termos', text: 'Ao utilizar o FLUXEN, você concorda com estes termos. Caso não concorde, não utilize o sistema.' },
            { title: '2. Uso Permitido', text: 'O sistema é destinado ao uso comercial legítimo. É proibido utilizar o FLUXEN para atividades ilegais, fraudes ou qualquer fim que viole a legislação brasileira.' },
            { title: '3. Responsabilidades', text: 'O FLUXEN é responsável pela disponibilidade do sistema (99,5% de uptime) e pela segurança dos dados. O usuário é responsável pelas informações inseridas no sistema.' },
            { title: '4. Plano e Pagamento', text: 'O plano mensal de R$29,90 é cobrado mensalmente sem fidelidade. O cancelamento pode ser feito a qualquer momento, sem multa, com efeito imediato.' },
            { title: '5. Cancelamento', text: 'Em caso de cancelamento, seus dados ficam disponíveis por 30 dias para exportação. Após esse prazo, são excluídos permanentemente.' },
            { title: '6. Suporte', text: 'O suporte é oferecido via WhatsApp no número (88) 99959-2580, de segunda a sábado das 8h às 18h.' },
          ].map(({ title, text }) => (
            <div key={title}>
              <p className="font-bold text-gray-800 mb-1">{title}</p>
              <p>{text}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
            Dúvidas? Entre em contato: <strong>(88) 99959-2580</strong>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── DEPOIMENTOS ────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Ricardo Alves', role: 'Dono de Loja de Roupas', city: 'Fortaleza, CE',
    avatar: 'RA', color: '#2563eb', stars: 5,
    text: 'O FLUXEN transformou meu negócio. Antes eu controlava tudo em caderno, agora tenho estoque, caixa e vendas numa tela só. Em 1 mês já vi a diferença no lucro.',
  },
  {
    name: 'Ana Paula Costa', role: 'Dona de Farmácia', city: 'Caucaia, CE',
    avatar: 'AP', color: '#16a34a', stars: 5,
    text: 'Sistema muito fácil de usar. Minha equipe aprendeu em menos de 1 hora. O alerta de reabastecimento é incrível, não fico mais sem produto nas prateleiras.',
  },
  {
    name: 'Bruno Ferreira', role: 'Dono de Distribuidora', city: 'Maracanaú, CE',
    avatar: 'BF', color: '#8b5cf6', stars: 5,
    text: 'Melhor investimento que fiz. R$29,90 por mês e economizo horas de trabalho todo dia. Os relatórios me ajudam a ver quais produtos vendem mais.',
  },
];

function TestimonialsSection() {
  return (
    <section id="depoimentos" className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0d1b3e 0%,#0f2744 60%,#1a3a6e 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,#60a5fa,transparent)' }} />
      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-300">Depoimentos</p>
          <h2 className="text-4xl font-black text-white">O que nossos clientes dizem</h2>
          <p className="mt-3 text-blue-200 max-w-lg mx-auto">Média de <strong className="text-white">4.9 / 5</strong> de satisfação entre nossos usuários.</p>
        </FadeIn>
        <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-3" variants={stagger(0.12, 0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {TESTIMONIALS.map(({ name, role, city, avatar, color, text, stars }) => (
            <motion.div key={name} variants={fadeUp} whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="relative rounded-3xl p-7"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 opacity-10 text-white" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg,${color},${color}99)` }}>
                  {avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-blue-300 text-xs">{role} · {city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── WHATSAPP FLUTUANTE ─────────────────────────────────── */
function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/5588999592580?text=Ol%C3%A1!%20Tenho%20interesse%20no%20FLUXEN."
      target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-full shadow-2xl"
      style={{ background: '#25D366' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#25D36650' }} />
      <span className="relative flex items-center gap-2 px-4 py-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="text-white font-bold text-sm pr-1">Falar agora</span>
      </span>
    </motion.a>
  );
}

/* ─── pagina ─────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <ShowcaseSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
