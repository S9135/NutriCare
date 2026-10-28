import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  PieChart, 
  FileText, 
  Utensils, 
  AlertCircle, 
  Trophy,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Biometrics from './components/Biometrics';
import Dashboard from './components/Dashboard';
import LabScanner from './components/LabScanner';
import MealScanner from './components/MealScanner';
import SOSOverlay from './components/SOSOverlay';
import Auth from './components/Auth';
import AdminConsole from './components/AdminConsole';

export type UserProfile = {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  email: string;
  contact: string;
  emergencyName: string;
  emergencyPhone: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
};

export type AppState = {
  profile: UserProfile | null;
  dailyConsumed: number;
  streak: number;
  badges: string[];
};

export default function App() {
  const [session, setSession] = useState<{ email: string; role: 'user' | 'admin' } | null>(() => {
    const saved = localStorage.getItem('nutricare_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'labs' | 'meals' | 'admin'>('dashboard');
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nutricare_state');
    return saved ? JSON.parse(saved) : {
      profile: null,
      dailyConsumed: 0,
      streak: 0,
      badges: []
    };
  });
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nutricare_state', JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('nutricare_session', JSON.stringify(session));
      if (session.role === 'admin') setActiveTab('admin');
    } else {
      localStorage.removeItem('nutricare_session');
    }
  }, [session]);

  const handleLogin = (email: string, role: 'user' | 'admin') => {
    setSession({ email, role });
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab('dashboard');
  };

  const updateProfile = (profile: UserProfile) => {
    setAppState(prev => ({ ...prev, profile }));
    setActiveTab('dashboard');
  };

  const addCalories = (cals: number) => {
    setAppState(prev => ({ ...prev, dailyConsumed: prev.dailyConsumed + cals }));
  };

  const navLinks = session?.role === 'admin' 
    ? [{ id: 'admin', label: 'Admin Terminal', icon: ShieldCheck }]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: PieChart },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'labs', label: 'Lab Reports', icon: FileText },
        { id: 'meals', label: 'Meal Analysis', icon: Utensils },
      ];

  if (!session) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Top Telemetry Ribbon */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0E17]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-8">
            {/* Zone 1: Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <Activity className="w-6 h-6 text-cyan-500" />
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                NUTRICARE AI
              </span>
            </div>

            {/* Zone 2: Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === link.id ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: SOS & Mobile Menu */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleLogout}
                className="hidden md:block p-2 text-slate-500 hover:text-white transition-colors"
                title="Log Out"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSOSActive(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-600/10 border border-rose-500/50 text-rose-400 rounded-md text-xs font-bold hover:bg-rose-600/20 transition-all uppercase tracking-wider"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Emergency SOS
              </button>
              <button 
                className="md:hidden p-2 text-slate-400"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#07090E] pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    activeTab === link.id 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <link.icon className="w-6 h-6" />
                  <span className="text-lg font-medium">{link.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-4 rounded-xl border bg-rose-500/10 border-rose-500/50 text-rose-400"
              >
                <X className="w-6 h-6" />
                <span className="text-lg font-medium">Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!appState.profile && activeTab !== 'profile' && session.role !== 'admin' ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <User className="w-16 h-16 text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to NutriCare AI</h2>
            <p className="text-slate-400 mb-8 max-w-md">Please set up your health profile to begin tracking your biometric therapy.</p>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-8 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20"
            >
              Set Up Profile
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard state={appState} />}
              {activeTab === 'profile' && <Biometrics profile={appState.profile} onSave={updateProfile} />}
              {activeTab === 'labs' && <LabScanner />}
              {activeTab === 'meals' && <MealScanner onMealLogged={addCalories} />}
              {activeTab === 'admin' && <AdminConsole onLogout={handleLogout} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* SOS Overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <SOSOverlay 
            onClose={() => setIsSOSActive(false)} 
            emergencyContact={appState.profile ? { name: appState.profile.emergencyName, phone: appState.profile.emergencyPhone } : null}
          />
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono tracking-widest uppercase">
          <span>&copy; 2026 TheraLoop AI Ecosystem</span>
          <div className="flex gap-6">
            <span>System: Nominal</span>
            <span>Security: AES-256</span>
            <span>Cloud: Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
