import React, { useState } from 'react';
import { UserProfile } from '../App';
import { calculateBMR, calculateBMI, calculateTDEE } from '../lib/utils';
import { User, Shield, Info } from 'lucide-react';

interface BiometricsProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export default function Biometrics({ profile, onSave }: BiometricsProps) {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: '',
    age: 30,
    gender: 'male',
    weight: 70,
    height: 170,
    email: '',
    contact: '',
    emergencyName: '',
    emergencyPhone: '',
    activityLevel: 'sedentary'
  });

  const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.gender);
  const bmi = calculateBMI(formData.weight, formData.height);
  const tdee = calculateTDEE(bmr, formData.activityLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-5 h-5 text-cyan-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Biometric Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Age (yrs)</label>
              <input
                required
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Weight (kg)</label>
              <input
                required
                type="number"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Height (cm)</label>
              <input
                required
                type="number"
                value={formData.height}
                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 appearance-none"
            >
              <option value="sedentary">Sedentary (Office job)</option>
              <option value="light">Lightly Active (1-3 days exercise)</option>
              <option value="moderate">Moderately Active (3-5 days exercise)</option>
              <option value="very">Very Active (6-7 days hard exercise)</option>
              <option value="extra">Extra Active (Physical labor / athlete)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Emergency Protocol</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Emergency Contact Name</label>
                <input
                  required
                  type="text"
                  value={formData.emergencyName}
                  onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-500 tracking-wider">Emergency Phone</label>
                <input
                  required
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20"
          >
            Save Biometric Data
          </button>
        </form>
      </div>

      {/* Analysis Section */}
      <div className="space-y-6">
        <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Biometric Analysis</h2>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em] block mb-2">BMR Rating</label>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-white tabular-nums">{Math.round(bmr)}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">kcal/day</span>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em] block mb-2">BMI Index</label>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-white tabular-nums">{bmi.value}</span>
                  <span className={`text-[10px] font-mono uppercase ${bmi.status === 'Normal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {bmi.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl overflow-hidden">
              <div className="relative z-10">
                <label className="text-[10px] font-mono uppercase text-cyan-400 tracking-[0.2em] block mb-2">Calculated TDEE (Daily Allowance)</label>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-mono font-bold text-cyan-400 tabular-nums">{tdee}</span>
                  <span className="text-xs font-mono text-cyan-400/60 uppercase">Calories / Day</span>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  Total Daily Energy Expenditure based on your activity level. Consuming within this range will maintain your current therapeutic state.
                </p>
              </div>
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-16 -mt-16" />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-slate-500 tracking-widest">Medical References</h4>
              <div className="grid gap-3">
                {[
                  { label: 'BMR (Mifflin-St Jeor)', value: 'Gold standard formula' },
                  { label: 'TDEE Calculation', value: 'Includes metabolic activity' },
                  { label: 'Status Protocol', value: 'WHO Standardized BMI' },
                ].map((ref, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-slate-800/50 pb-2">
                    <span className="text-slate-400 uppercase">{ref.label}</span>
                    <span className="text-slate-200">{ref.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
