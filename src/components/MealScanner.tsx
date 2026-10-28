import React, { useState } from 'react';
import { Utensils, Camera, Plus, Loader2, Zap, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type MealAnalysis = {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  glycemicLoad: number;
  sugarSpikeRisk: string;
  analysis: string;
};

interface MealScannerProps {
  onMealLogged: (calories: number) => void;
}

export default function MealScanner({ onMealLogged }: MealScannerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async (mealName?: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: preview ? preview.split(',')[1] : null,
          mimeType: 'image/jpeg',
          mealName: mealName || null
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const presetMeals = [
    { name: 'Grilled Salmon Bowl', calories: 450 },
    { name: 'Avocado Toast w/ Egg', calories: 380 },
    { name: 'Quinoa Salad', calories: 320 },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <Utensils className="w-5 h-5 text-cyan-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Glycemic Scanner</h2>
        </div>

        <div className="space-y-8">
          {/* Quick Selection */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-slate-500 tracking-widest">Simulate Meal Panel</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {presetMeals.map((meal) => (
                <button
                  key={meal.name}
                  onClick={() => analyzeMeal(meal.name)}
                  disabled={isAnalyzing}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all text-left"
                >
                  <p className="text-xs font-bold text-white mb-1">{meal.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">{meal.calories} kcal</p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center hover:border-slate-700 transition-all">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Meal" className="max-h-48 rounded-lg shadow-2xl" />
                <div className="absolute inset-0 bg-cyan-500/10 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-sm text-slate-400 text-center">Capture or Upload Meal Photo</p>
              </>
            )}
          </div>

          <button
            onClick={() => analyzeMeal()}
            disabled={!preview || isAnalyzing}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {isAnalyzing ? 'Analyzing Nutritional Matrix...' : 'Start Glycemic Analysis'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-600 h-full">
              <Utensils className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-mono uppercase tracking-[0.2em]">Neural Engine Standby</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full">
              <Loader2 className="w-12 h-12 mb-6 text-cyan-500 animate-spin" />
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Biomolecular Impact</h3>
              <p className="text-sm text-slate-400 max-w-xs">Estimating macronutrients and sugar spike probability via computer vision.</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8 space-y-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{result.mealName}</h3>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Nutritional Intelligence Report</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-mono font-bold text-white tabular-nums">{result.calories}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">kcal total</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Protein', value: `${result.protein}g`, color: 'bg-emerald-500' },
                  { label: 'Carbs', value: `${result.carbs}g`, color: 'bg-cyan-500' },
                  { label: 'Fats', value: `${result.fats}g`, color: 'bg-amber-500' },
                ].map((macro) => (
                  <div key={macro.label} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">{macro.label}</p>
                    <p className="text-xl font-bold text-white mb-2">{macro.value}</p>
                    <div className={`h-1 rounded-full ${macro.color}`} style={{ width: '60%' }} />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Glycemic Load</p>
                    <p className="text-xl font-bold text-white">{result.glycemicLoad} <span className="text-xs font-normal text-slate-400">/ 100</span></p>
                  </div>
                </div>
                <div className={`p-4 border rounded-xl flex items-center gap-4 ${
                  result.sugarSpikeRisk === 'Low' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    result.sugarSpikeRisk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Sugar Spike Risk</p>
                    <p className={`text-xl font-bold ${
                      result.sugarSpikeRisk === 'Low' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>{result.sugarSpikeRisk}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-cyan-500" />
                  <h4 className="text-xs font-mono uppercase text-slate-400">Therapeutic Feedback</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{result.analysis}"</p>
              </div>

              <button
                onClick={() => {
                  onMealLogged(result.calories);
                  setResult(null);
                  setPreview(null);
                }}
                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <Plus className="w-5 h-5" />
                Log Meal to Daily Balance
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
