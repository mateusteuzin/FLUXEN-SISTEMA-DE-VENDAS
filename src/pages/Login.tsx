import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ShieldCheck,
  BarChart3, Package, ShoppingCart,
  CheckCircle2, ArrowLeft, Lock, ArrowRight,
  TrendingUp, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';
import { isLocalMode } from '@/lib/app-mode';

type View = 'login' | 'signup' | 'forgot';

const FEATURES = [
  { icon: TrendingUp,   label: 'Dashboard Analítico',  desc: 'Visão estratégica do seu negócio em tempo real.' },
  { icon: ShoppingCart, label: 'Gestão de Vendas',      desc: 'Registre e monitore suas vendas com agilidade.' },
  { icon: Package,      label: 'Controle de Estoque',   desc: 'Inventário inteligente com alertas de reposição.' },
  { icon: BarChart3,    label: 'Relatórios Analíticos', desc: 'Análise detalhada de lucros e desempenho.' },
];

const PLAN_BENEFITS = [
  'Dashboard completo em tempo real',
  'Controle de estoque ilimitado',
  'Relatórios e gráficos avançados',
  'Emissão de notas fiscais',
  'Suporte prioritário 7 dias',
];

/* ── Ícone Google SVG ─────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao entrar com Google';
      toast.error(message);
      setGoogleLoading(false);
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

      {/* ===== PAINEL ESQUERDO — Marketing ===== */}
      <div
        className="hidden lg:flex lg:w-[50%] flex-col p-12 relative overflow-hidden"
        style={{ background: '#0a0f1d' }}
      >
        {/* Fundo animado */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1/4 -right-1/4 w-full h-full bg-blue-600/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-indigo-600/10 blur-[100px] rounded-full"
          />
        </div>

        {/* Grade sutil */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(37,99,235,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.05) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-14"
        >
          <BrandLogo className="h-44 w-auto brightness-0 invert" />
        </motion.div>

        {/* Headline */}
        <div className="relative z-10 mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight"
          >
            Impulsione sua gestão<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              com inteligência
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-gray-400 text-base leading-relaxed max-w-md"
          >
            A plataforma definitiva para escalar suas operações comerciais com precisão e segurança.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-10">
          {FEATURES.map(({ icon: Icon, label, desc }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className="rounded-2xl p-4 border border-white/5 bg-white/5 backdrop-blur-md transition-all hover:shadow-xl hover:shadow-blue-500/10 group cursor-default"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-white font-semibold text-xs">{label}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Plano card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative z-10 rounded-3xl p-7 mt-auto overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl group"
        >
          <div className="absolute top-0 right-0 p-4">
            <Zap className="h-10 w-10 text-blue-500/20 group-hover:text-blue-500/40 transition-colors" />
          </div>

          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">PLANO PROFESSIONAL</p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-4xl font-bold">R$ 29,90</span>
                <span className="text-gray-400 text-sm font-medium">/mês</span>
              </div>
              <p className="text-green-400 text-xs font-medium mt-1">✓ 7 dias grátis, sem cartão</p>
            </div>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            >
              MELHOR CUSTO
            </motion.span>
          </div>

          <div className="grid grid-cols-2 gap-y-2.5 mb-6">
            {PLAN_BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
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
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>

      {/* ===== PAINEL DIREITO — Formulário ===== */}
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
                transition={{ duration: 0.35, ease: 'easeOut' }}
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
                        Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                      </p>
                    </div>
                    <Button onClick={goToLogin} variant="outline" className="w-full h-12 rounded-xl font-semibold border-gray-200 hover:bg-gray-50">
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
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
                        <Input
                          type="email"
                          placeholder="seu@email.com.br"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar link de redefinição'}
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
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
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
                          ? 'Sua conta foi criada com sucesso. Faça login para começar.'
                          : 'Enviamos um email de verificação. Confirme seu email para ativar sua conta.'}
                      </p>
                    </div>
                    <Button onClick={goToLogin} className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                      Fazer login
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Criar nova conta</h2>
                      <p className="text-gray-500 text-sm mt-1">Comece sua jornada com o FLUXEN hoje.</p>
                    </div>

                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      {googleLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      {googleLoading ? 'Redirecionando...' : 'Criar conta com Google'}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400 font-medium">ou com email</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
                        <Input
                          type="email"
                          placeholder="seu@email.com.br"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-gray-700 ml-1">Senha</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mínimo 6 caracteres"
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
                      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all" disabled={loading}>
                        {loading ? 'Processando...' : 'Criar minha conta grátis'}
                      </Button>
                    </form>

                    <p className="text-sm text-center text-gray-400">
                      Já possui conta?{' '}
                      <button onClick={goToLogin} className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                        Fazer login
                      </button>
                    </p>
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
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6 bg-white/90 backdrop-blur-xl p-9 rounded-[2rem] shadow-2xl shadow-blue-200/20 border border-white/60"
              >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <BrandLogo className="h-48 w-auto" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Bem-vindo de volta!</h2>
                  <p className="text-gray-500 text-sm mt-1">Acesse seu painel de gestão.</p>
                </div>

                {/* Botão Google */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  {googleLoading ? 'Redirecionando...' : 'Entrar com Google'}
                </button>

                {/* Separador */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-medium">ou com email e senha</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Email</label>
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

                {/* Segurança */}
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-[12px] text-slate-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Conexão protegida com criptografia de ponta a ponta.</span>
                </div>

                <p className="text-sm text-center text-gray-500">
                  Novo por aqui?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                  >
                    Criar conta grátis
                  </button>
                </p>

                {/* Mobile plano */}
                <div className="lg:hidden">
                  <a
                    href="https://mpago.la/2cXqs8Y"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    Assinar Plano Pro — R$29,90/mês
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
