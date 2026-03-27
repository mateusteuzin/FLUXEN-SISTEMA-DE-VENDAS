import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';
import { isLocalMode } from '@/lib/app-mode';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success(isLocalMode ? 'Conta local criada com sucesso!' : 'Conta criada! Verifique seu email.');
      } else {
        await signIn(email, password);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <BrandLogo className="mx-auto h-[166px] w-[460px] max-w-full" />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              {BRAND_NAME}
            </p>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? 'Criar Conta' : 'Entrar no Sistema'}
            </CardTitle>
          </div>

          <p className="text-muted-foreground text-sm">
            {BRAND_TAGLINE}
          </p>

          {isLocalMode && (
            <p className="text-xs text-muted-foreground">
              Modo local ativo: cadastro e login funcionam sem confirmacao por email.
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Seus dados estao protegidos</span>
          </div>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? 'Já tem conta? Faca login' : 'Não tem conta? Cadastre-se'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
