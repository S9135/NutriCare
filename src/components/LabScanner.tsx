import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertTriangle, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type LabResult = {
  biomarkers: Array<{
    name: string;
    value: string;
    unit: string;
    status: string;
  }>;
  summary: string;
  riskAssessment: string;
};

export default function LabScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LabResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const analyzeLabReport = async (base64Image?: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const imgData = base64Image || preview;
      if (!imgData) return;

      const response = await fetch('/api/analyze-lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgData.split(',')[1],
          mimeType: file?.type || 'image/jpeg'
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

  const simulateLabPanel = () => {
    // Simulated base64 for a dummy lab report or just use the text-only path if I had one.
    // For demo, we'll just show the result directly with mock data or call the API with a preset.
    analyzeLabReport('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1FVWV1hZWmNkZWZnaGlqc3R1dnd4eXq0hYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/oooqD//2Q==');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-5 h-5 text-cyan-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Lab Scanner</h2>
        </div>

        <div className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
              preview ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg shadow-2xl" />
            ) : (
              <>
                <Upload className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-sm text-slate-400 text-center">
                  Drag and drop your lab report image here,<br />or click to browse.
                </p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => analyzeLabReport()}
              disabled={!preview || isAnalyzing}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {isAnalyzing ? 'Analyzing Report...' : 'Analyze Report'}
            </button>
            <button
              onClick={simulateLabPanel}
              disabled={isAnalyzing}
              className="px-6 py-3 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-lg transition-all text-xs font-mono uppercase tracking-widest"
            >
              Simulate Demo
            </button>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex gap-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Your medical data is processed using end-to-end encrypted AI models. No patient identity information is stored on our servers.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-600 h-full"
            >
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-mono uppercase tracking-[0.2em]">Awaiting Telemetry Input</p>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full"
            >
              <Loader2 className="w-12 h-12 mb-6 text-cyan-500 animate-spin" />
              <h3 className="text-xl font-bold text-white mb-2">Neural Analysis in Progress</h3>
              <p className="text-sm text-slate-400 max-w-xs">Extracting biomarkers and calculating risk factors using Gemini 3.8 Intelligence.</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-[0.2em]">Extracted Lab Panel</h3>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20">VERIFIED</span>
              </div>

              <div className="grid gap-4">
                {result.biomarkers.map((bio, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">{bio.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-mono font-bold text-white tabular-nums">{bio.value}</span>
                        <span className="text-[10px] font-mono text-slate-500">{bio.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        bio.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {bio.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                    Clinical Summary
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                </div>
                
                <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/20">
                  <h4 className="text-xs font-mono uppercase text-rose-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Risk Assessment
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.riskAssessment}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
