import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ShieldCheck, UserPlus, Key, ArrowLeft, Activity } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, role: 'user' | 'admin') => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@nutricare.ai') {
      onLogin(email, 'admin');
    } else {
      onLogin(email || 'demo@user.ai', 'user');
    }
  };

  const handleDemoUser = () => onLogin('demo@user.ai', 'user');
  const handleDemoAdmin = () => onLogin('admin@nutricare.ai', 'admin');

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/20">
            <Activity className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">NutriCare AI</h1>
          <p className="text-slate-500 text-sm font-mono uppercase tracking-widest mt-1">Digital Therapeutic Ecosystem</p>
        </div>

        <div className="bg-[#0B0E17] border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
                  <p className="text-slate-500 text-sm">Access your biometric dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block">Password</label>
                      <button 
                        type="button" 
                        onClick={() => setView('forgot')}
                        className="text-[10px] font-mono uppercase text-cyan-500 hover:text-cyan-400"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98]">
                    Sign In
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={handleDemoUser}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors group"
                    >
                      <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-cyan-500" />
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-tighter">Demo User</span>
                    </button>
                    <button 
                      onClick={handleDemoAdmin}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors group"
                    >
                      <Key className="w-5 h-5 text-slate-500 group-hover:text-rose-500" />
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-tighter">Demo Admin</span>
                    </button>
                  </div>
                  <p className="text-center text-slate-500 text-xs">
                    Don't have an account?{' '}
                    <button onClick={() => setView('signup')} className="text-cyan-500 font-bold hover:text-cyan-400">Sign Up</button>
                  </p>
                </div>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setView('login')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-xs uppercase font-mono tracking-widest">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
                  <p className="text-slate-500 text-sm">Join the therapeutic ecosystem</p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-slate-500 tracking-widest block">Password</label>
                    <input
                      type="password"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Create a password"
                    />
                  </div>
                  <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 mt-4">
                    Get Started
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button onClick={() => setView('login')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-xs uppercase font-mono tracking-widest">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-1">Verify Identity</h2>
                  <p className="text-slate-500 text-sm">Enter the 4-digit code sent to your email</p>
                </div>

                <div className="flex justify-center gap-3 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-xl text-center text-2xl font-bold text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <button 
                  onClick={() => setView('login')}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all mb-4"
                >
                  Confirm Code
                </button>
                <p className="text-center text-slate-500 text-xs font-mono uppercase tracking-widest">
                  Didn't receive it? <button className="text-cyan-500 font-bold">Resend</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center items-center gap-6 text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Privacy First</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
