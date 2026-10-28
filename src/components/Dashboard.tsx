import React from 'react';
import { AppState } from '../App';
import { calculateBMR, calculateTDEE } from '../lib/utils';
import { 
  Zap, 
  Target, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Award,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  state: AppState;
}

export default function Dashboard({ state }: DashboardProps) {
  if (!state.profile) return null;

  const bmr = calculateBMR(state.profile.weight, state.profile.height, state.profile.age, state.profile.gender);
  const tdee = calculateTDEE(bmr, state.profile.activityLevel);
  const remaining = tdee - state.dailyConsumed;
  const isOver = remaining < 0;
  
  // Calculate wellness score (simplified)
  const wellnessScore = Math.max(0, Math.min(100, 
    100 - (isOver ? (Math.abs(remaining) / tdee) * 100 : 0)
  ));

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
      {isOver && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-center gap-4 text-rose-400"
        >
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold text-sm uppercase tracking-wider">Metabolic Threshold Exceeded</p>
            <p className="text-xs opacity-80">You have consumed {Math.abs(remaining)} calories over your daily TDEE limit.</p>
          </div>
        </motion.div>
      )}

      {/* Primary Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Calorie Card */}
        <div className="md:col-span-2 bg-[#0B0E17] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-mono uppercase text-slate-500 tracking-[0.2em] mb-1">Daily Calorie Balance</h3>
                <p className="text-sm text-slate-400">Therapeutic Target: {tdee} kcal</p>
              </div>
              <Target className="w-5 h-5 text-cyan-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <div className="space-y-1">
                <span className={`text-6xl font-mono font-bold tabular-nums ${isOver ? 'text-rose-500' : 'text-white'}`}>
                  {remaining}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase block">kcal remaining</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (state.dailyConsumed / tdee) * 100)}%` }}
                    className={`h-full ${isOver ? 'bg-rose-500' : 'bg-cyan-500'}`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  <span>Consumed: {state.dailyConsumed}</span>
                  <span>Limit: {tdee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-mono uppercase text-slate-500 tracking-[0.2em] mb-6">Wellness Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-900"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="364.4"
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (364.4 * wellnessScore) / 100 }}
                className={wellnessScore > 80 ? 'text-cyan-500' : wellnessScore > 50 ? 'text-amber-500' : 'text-rose-500'}
              />
            </svg>
            <span className="absolute text-3xl font-mono font-bold text-white">{Math.round(wellnessScore)}</span>
          </div>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Index Quality: {wellnessScore > 80 ? 'Optimal' : 'Stable'}</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Activity Streak', value: `${state.streak} Days`, icon: Flame, color: 'text-orange-500' },
          { label: 'Avg Glycemic Load', value: '42 GL', icon: TrendingUp, color: 'text-cyan-500' },
          { label: 'Metabolic Load', value: 'Low', icon: Zap, color: 'text-amber-500' },
          { label: 'Achievements', value: `${state.badges.length} Badges`, icon: Award, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0B0E17] border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards / Badges Section */}
      <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Therapeutic Milestones</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {[
            { id: 'guardian', label: 'Calorie Guardian', earned: true },
            { id: 'master', label: 'Glycemic Master', earned: state.badges.includes('master') },
            { id: 'streak', label: 'Consistency King', earned: state.streak >= 7 },
            { id: 'labs', label: 'Lab Scout', earned: false },
            { id: 'early', label: 'Alpha Protocol', earned: true },
          ].map((badge) => (
            <div key={badge.id} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${badge.earned ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/50 border-slate-800 opacity-40 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.earned ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                {badge.earned ? <CheckCircle2 className="w-6 h-6" /> : <Award className="w-6 h-6" />}
              </div>
              <span className="text-[10px] font-mono text-center uppercase tracking-tighter text-slate-300">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
