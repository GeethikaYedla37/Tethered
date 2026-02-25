import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Fingerprint, LockKeyhole, Cpu, AlertOctagon } from 'lucide-react';

interface Props {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [sessionKey, setSessionKey] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionKey.length < 8) return;
    
    setIsScanning(true);
    // Simulate biometric/hardware lock scanning
    setTimeout(() => {
      onLogin("User");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 relative"
      >
        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <motion.div
              animate={{ y: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-32 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-full mb-8"
            />
            <Fingerprint size={64} className="text-emerald-500 mb-4 animate-pulse" />
            <p className="text-emerald-400 font-bold tracking-widest">VERIFYING HARDWARE BINDING...</p>
            <p className="text-slate-400 text-xs mt-2">Establishing End-to-End Encrypted Tunnel</p>
          </div>
        )}

        <div className="p-8 text-center border-b border-slate-700">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <LockKeyhole size={28} className="text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SECURE ENTRY</h1>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Un-hackable Private Space</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-lg flex gap-3 items-start">
            <AlertOctagon className="text-rose-500 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-rose-200 leading-relaxed">
              <strong>STRICT POLICY:</strong> This session is hardware-bound. It cannot be shared, hacked, or accessed by third parties. Any inappropriate behavior is monitored by local AI and will terminate the session permanently.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Unique Session Key</label>
            <input 
              type="text" 
              value={sessionKey}
              onChange={(e) => setSessionKey(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-600 text-emerald-400 font-mono text-center text-xl py-4 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all tracking-[0.2em]"
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
              required
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            <Cpu size={14} className="text-emerald-500" />
            <span>Device Hardware Lock: <strong>ENABLED</strong></span>
          </div>

          <button 
            type="submit"
            disabled={sessionKey.length < 8 || isScanning}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <Shield size={18} />
            Initialize Secure Room
          </button>
        </form>
      </motion.div>
    </div>
  );
}
