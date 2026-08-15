import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Calendar,
  Zap,
  AlertCircle,
  Loader2,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AuthMode = 'login' | 'signup';

const features = [
  {
    icon: <CheckSquare className="w-5 h-5" />,
    title: 'Tarefas na nuvem',
    desc: 'Seus dados sincronizados e seguros no Supabase'
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Análises em tempo real',
    desc: 'Dashboard completo de produtividade pessoal'
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Calendário inteligente',
    desc: 'Visualize prazos e organize sua semana'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Rápido e intuitivo',
    desc: 'Interface premium com micro-animações fluídas'
  }
];

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const translateError = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) return 'E-mail ou senha inválidos.';
    if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de fazer login.';
    if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('Password should be at least')) return 'A senha deve ter ao menos 6 caracteres.';
    if (msg.includes('Unable to validate email address')) return 'Endereço de e-mail inválido.';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(translateError(error.message));
      } else {
        const { error, needsConfirmation } = await signUp(email, password);
        if (error) {
          setError(translateError(error.message));
        } else if (needsConfirmation) {
          setSuccessMessage(
            'Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça o login.'
          );
        }
        // Se não precisar de confirmação, onAuthStateChange já redireciona
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">
      {/* ─── Painel Esquerdo — Branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950">
        {/* Orbs decorativos */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Grade de pontos */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-400 via-indigo-300 to-sky-300 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <Sparkles className="w-6 h-6 text-indigo-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">TaskFlow</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-800/60 border border-indigo-700/50 px-2 py-0.5 rounded-md">
                Pro
              </span>
            </div>
            <p className="text-xs text-indigo-300/80">Gerenciador de Tarefas & Produtividade</p>
          </div>
        </div>

        {/* Headline central */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Organize.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-violet-300">
                Priorize.
              </span>
              <br />
              Conquiste.
            </h1>
            <p className="text-lg text-indigo-200/70 max-w-sm leading-relaxed">
              O gerenciador de tarefas inteligente que transforma sua produtividade com análises em
              tempo real.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3.5 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-800/60 border border-indigo-700/50 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-700/60 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-indigo-300/70 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Card de tarefa decorativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 p-4 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm text-white/90 font-medium">Integração com Supabase ✓</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
              Alta
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex-shrink-0" />
            <span className="text-sm text-white/60 font-medium">Configurar tela de análises</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Média
            </span>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-indigo-300/60">2 de 5 tarefas concluídas</span>
            <div className="flex-1 mx-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
            </div>
            <span className="text-[11px] text-indigo-300/60 font-semibold">40%</span>
          </div>
        </motion.div>
      </div>

      {/* ─── Painel Direito — Formulário ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">TaskFlow Pro</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Bem-vindo de volta! 👋' : 'Criar sua conta ✨'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login'
                ? 'Entre com sua conta para acessar suas tarefas'
                : 'Comece gratuitamente e organize sua produtividade'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
            {(['login', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  mode === m
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          {/* Formulário */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Campo Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Campo Confirmar Senha (apenas no cadastro) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required={mode === 'signup'}
                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mensagem de erro */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mensagem de sucesso (confirmar e-mail) */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'login' ? 'Entrando...' : 'Cadastrando...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar na conta' : 'Criar conta gratuita'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {mode === 'login' ? 'Cadastre-se grátis' : 'Fazer login'}
            </button>
          </p>

          <p className="text-center text-[11px] text-slate-300">
            Ao continuar, você concorda com os{' '}
            <span className="text-slate-400 cursor-pointer hover:text-slate-500">Termos de Uso</span>{' '}
            e{' '}
            <span className="text-slate-400 cursor-pointer hover:text-slate-500">
              Política de Privacidade
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
