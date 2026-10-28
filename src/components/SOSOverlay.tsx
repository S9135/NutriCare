import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Phone, MessageSquare, X } from 'lucide-react';

interface SOSOverlayProps {
  onClose: () => void;
  emergencyContact: { name: string; phone: string } | null;
}

export default function SOSOverlay({ onClose, emergencyContact }: SOSOverlayProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Start siren sound
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Siren frequency sweep
    const sweep = () => {
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(400, now + 1);
    };
    
    osc.start();
    sweep();
    const interval = setInterval(sweep, 1000);
    
    oscillatorRef.current = osc;

    return () => {
      clearInterval(interval);
      osc.stop();
      audioCtx.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-rose-950 flex flex-col items-center justify-center p-6"
    >
      {/* Flashing Background Effect */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="absolute inset-0 bg-rose-600"
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-rose-200 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_80px_rgba(255,255,255,0.4)]"
        >
          <ShieldAlert className="w-16 h-16 text-rose-600" />
        </motion.div>

        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Emergency Protocol Active</h1>
        <p className="text-rose-200 text-lg mb-12">An emergency siren is sounding and system telemetry is being broadcasted.</p>

        <div className="space-y-4">
          {emergencyContact ? (
            <>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-rose-200 text-xs font-mono uppercase tracking-widest mb-2">Emergency Contact</p>
                <p className="text-2xl font-bold text-white mb-6">{emergencyContact.name}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`tel:${emergencyContact.phone}`}
                    className="flex flex-col items-center gap-3 p-6 bg-white text-rose-600 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-8 h-8" />
                    Call Now
                  </a>
                  <a 
                    href={`sms:${emergencyContact.phone}`}
                    className="flex flex-col items-center gap-3 p-6 bg-emerald-500 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    <MessageSquare className="w-8 h-8" />
                    Send SOS
                  </a>
                </div>
              </div>
              
              <div className="mt-8 text-rose-300/60 text-xs font-mono uppercase tracking-[0.2em]">
                System ID: THERALOOP-99-B<br />
                Location: Broadcast Active
              </div>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <p className="text-white font-bold mb-4">No Emergency Contact Configured</p>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-rose-600 rounded-xl font-bold"
              >
                Configure Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
