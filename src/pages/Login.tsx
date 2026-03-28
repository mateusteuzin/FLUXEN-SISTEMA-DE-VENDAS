import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ShieldCheck,
  BarChart3, Package, ShoppingCart, FileText,
  CheckCircle2, ArrowLeft, Lock, ArrowRight,
  TrendingUp, Users, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';
import { isLocalMode } from '@/lib/app-mode';

type View = 'login' | 'signup' | 'forgot';

const FEATURES = [
  {
    icon: TrendingUp,
    label: 'Dashboard Analitico',
    desc: 'Visao estrategica do seu negocio em tempo real.',
  },
  {
    icon: ShoppingCart,
    label: 'Gestao de Vendas',
    desc: 'Registre e monitore suas vendas com agilidade.',
  },
  {
    icon: Package,
    label: 'Controle de Estoque',
    desc: 'Inventario inteligente com alertas de reposicao.',
  },
  {
    icon: BarChart3,
    label: 'Relatorios Analiticos',
    desc: 'Analise detalhada de lucros e desempenho.',
  },
];

const PLAN_BENEFITS = [
  'Dashboard completo em tempo real',
  'Controle de estoque ilimitado',
  'Relatorios e graficos avancados',
  'Emissao de notas fiscais',
  'Suporte prioritario 7 dias',
];

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth();

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        await signIn(email, password);
        toast.success('Bem-vindo de volta!');
      } else if (view === 'signup') {
        await signUp(email, password);
        setSignupSuccess(true);
        setEmail('');
        setPassword('');
      } else if (view === 'forgot') {
        await resetPassword(email);
        setForgotSuccess(true);
        setEmail('');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setView('login');
    setSignupSuccess(false);
    setForgotSuccess(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex">

      {/* ===== PAINEL ESQUERDO - Marketing ===== */}
      <div
        className="hidden lg:flex lg:w-[50%] flex-col p-12 relative overflow-hidden"
        style={{
          background: '#0a0f1d',
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1/4 -right-1/4 w-full h-full bg-blue-600/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-indigo-600/10 blur-[100px] rounded-full"
          />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="relative z-10 mb-16 cursor-pointer"
        >
          <BrandLogo className="h-36 w-auto brightness-0 invert" />
        </motion.div>

        {/* Headline */}
        <div className="relative z-10 mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[2.8rem] font-bold text-white leading-[1.1] tracking-tight"
          >
            Impulsione sua gestao<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              com inteligencia data-driven
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-gray-400 text-lg leading-relaxed max-w-md"
          >
            A plataforma definitiva para escalar suas operacoes comerciais com precisao e seguranca.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-12">
          {FEATURES.map(({ icon: Icon, label, desc }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className="rounded-2xl p-5 border border-white/5 bg-white/5 backdrop-blur-md transition-shadow hover:shadow-2xl hover:shadow-blue-500/10 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-white font-semibold text-sm">{label}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Plan card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative z-10 rounded-3xl p-8 mt-auto overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl group"
        >
          <div className="absolute top-0 right-0 p-4">
            <Zap className="h-12 w-12 text-blue-500/20 group-hover:text-blue-500/40 transition-colors" />
          </div>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                PLANO PROFESSIONAL
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-4xl font-bold">R$ 29,90</span>
                <span className="text-gray-400 text-sm font-medium">/mes</span>
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            >
              MELHOR CUSTO-BENEFICIO
            </motion.span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mb-8">
            {PLAN_BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-gray-300 text-[11px]">{b}</span>
              </div>
            ))}
          </div>

          <motion.a
            href="https://mpago.la/2cXqs8Y"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all"
          >
            Comecar agora
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>

      {/* ===== PAINEL DIREITO - Formulario ===== */}
      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center min-h-screen bg-gray-50/30 px-6 py-10 relative">
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {/* ---- ESQUECI MINHA SENHA ---- */}
            {view === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <button
                  onClick={goToLogin}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors font-medium group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Voltar para login
                </button>

                {forgotSuccess ? (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">Email enviado!</h2>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
                      </p>
                    </div>
                    <Button 
                      onClick={goToLogin}
                      variant="outline"
                      className="w-full h-12 rounded-xl font-semibold border-gray-200 hover:bg-gray-50"
                    >
                      Voltar para o login
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
                        <Lock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Esqueceu a senha?</h2>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Digite seu email e enviaremos um link seguro para redefinir sua senha.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Email Corporativo</label>
                        <Input
                          type="email"
                          placeholder="seu@fluxen.com.br"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                        disabled={loading}
                      >
                        {loading ? 'Enviando...' : 'Enviar link de redefinicao'}
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {/* ---- CRIAR CONTA ---- */}
            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                {signupSuccess ? (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">Conta criada!</h2>
                      <p className="text-gray-500 text-sm leading-relaxed px-4">
                        {isLocalMode
                          ? 'Sua conta foi criada com sucesso. Faca login para comecar.'
                          : 'Enviamos um email de verificacao. Confirme seu email para ativar sua conta.'}
                      </p>
                    </div>
                    <Button onClick={goToLogin} className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                      Fazer login
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Criar nova conta</h2>
                        <p className="text-gray-500 text-sm mt-2">Comece sua jornada com o FLUXEN hoje.</p>
                      </div>
                      <BrandLogo className="h-8 w-auto opacity-20 grayscale" />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Email profissional</label>
                        <Input
                          type="email"
                          placeholder="seu@fluxen.com.br"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Senha de acesso</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-12 pl-4 pr-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                        disabled={loading}
                      >
                        {loading ? 'Processando...' : 'Criar minha conta gratis'}
                      </Button>
                    </form>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">
                        Ja possui uma conta?{' '}
                        <button
                          onClick={goToLogin}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                        >
                          Fazer Login
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ---- LOGIN ---- */}
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200/20 border border-white/50"
              >
                <div className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start mb-8">
                    <BrandLogo className="h-40 w-auto" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo(a)</h2>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    Insira suas credenciais corporativas para acessar o painel de gestao.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Email de Acesso</label>
                    <Input
                      type="email"
                      placeholder="ana@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[13px] font-semibold text-gray-700">Senha</label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Esqueceu?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pl-4 pr-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Autenticando...
                      </div>
                    ) : 'Acessar Sistema'}
                  </Button>
                </form>

                <div className="pt-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-[13px] text-slate-500 transition-all hover:bg-slate-100/50">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" />
                    <span className="leading-tight">Conexao protegida por criptografia de ponta a ponta.</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[14px] text-gray-500">
                    Novo por aqui?{' '}
                    <button
                      onClick={() => setView('signup')}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                    >
                      Criar conta empresarial
                    </button>
                  </p>
                </div>

                {/* Mobile plan button */}
                <div className="lg:hidden pt-4">
                  <a
                    href="https://mpago.la/2cXqs8Y"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    Assinar Plano Pro
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
