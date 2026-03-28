import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BarChart3, Boxes, CheckCircle2, ChevronRight,
  FileText, LayoutDashboard, Package, Receipt,
  Settings, ShoppingCart, Wallet, TrendingUp,
  ShieldCheck, Zap, Users,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

/* ─── helpers ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
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
function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        <Link to="/"><BrandLogo className="h-24 w-auto" /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {[['#funcionalidades', 'Funcionalidades'], ['#como-funciona', 'Como funciona'], ['#planos', 'Planos'], ['#faq', 'Duvidas']].map(([href, label]) => (
            <motion.a key={href} href={href} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" whileHover={{ y: -1 }}>
              {label}
            </motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/login" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Entrar</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>Teste gratis</Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
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

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#020817' }}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo className="h-14 w-auto brightness-0 invert mb-4" />
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>Sistema comercial moderno para vender com mais controle.</p>
          </div>
          {[
            ['Produto', ['Funcionalidades', 'Planos e Precos', 'Teste Gratis']],
            ['Sistema', ['Controle Financeiro', 'Gestao de Estoque', 'Vendas', 'Relatorios']],
            ['Suporte', ['Central de Ajuda', 'Contato', 'Politica de Privacidade', 'Termos de Uso']],
          ].map(([title, links]) => (
            <div key={title as string}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#334155' }}>{title}</p>
              <ul className="space-y-2">
                {(links as string[]).map((l) => (
                  <li key={l}>
                    <motion.a href="#" className="text-sm transition-colors" style={{ color: '#475569' }}
                      whileHover={{ x: 3, color: '#e2e8f0' }}>
                      {l}
                    </motion.a>
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
  );
}

/* ─── pagina ─────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
