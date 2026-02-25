import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, KeyRound, ArrowRight, Users, User } from 'lucide-react';
import { RoomType } from '../types';

export default function AuthPage({ onEnter }: { onEnter: (name: string, code: string, type: RoomType) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [roomType, setRoomType] = useState<RoomType>('private');

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-cream relative overflow-hidden">
      {/* Background blobs */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-gold/20 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-blush/20 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" 
      />

      <motion.div 
        className="bg-white/60 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/40 w-full max-w-md z-10 relative overflow-hidden"
      >
        <h1 className="font-serif text-4xl text-deep mb-8 text-center font-bold">
          <em className="text-gold not-italic">T</em>ethered
        </h1>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
            >
              <p className="text-center text-soft mb-6 font-sans text-sm">What should your friends call you?</p>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Your Display Name" 
                className="w-full bg-white/50 border border-black/10 px-4 py-4 rounded-xl outline-none focus:border-gold/50 transition-colors font-sans text-center text-lg mb-4 text-deep placeholder:text-soft/50" 
                autoFocus
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
              />
              <button 
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="w-full bg-deep text-cream py-4 rounded-xl font-medium hover:bg-ink transition-colors shadow-lg shadow-deep/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex gap-2 mb-6 p-1 bg-black/5 rounded-xl">
                <button 
                  onClick={() => setMode('join')} 
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'join' ? 'bg-white shadow-sm text-deep' : 'text-soft hover:text-deep'}`}
                >
                  Join Room
                </button>
                <button 
                  onClick={() => setMode('create')} 
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'create' ? 'bg-white shadow-sm text-deep' : 'text-soft hover:text-deep'}`}
                >
                  Create New
                </button>
              </div>

              {mode === 'join' ? (
                <>
                  <p className="text-center text-soft mb-4 font-sans text-sm">Enter your shared connection code.</p>
                  <input 
                    value={code} 
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. MOONLIGHT-42" 
                    className="w-full bg-white/50 border border-black/10 px-4 py-4 rounded-xl outline-none focus:border-gold/50 transition-colors font-mono text-center text-lg mb-4 uppercase tracking-widest text-deep placeholder:text-soft/40" 
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && code.trim() && onEnter(name, code.toUpperCase(), 'group')}
                  />
                </>
              ) : (
                <div className="mb-6">
                  <p className="text-center text-soft mb-4 font-sans text-sm">Choose your room type.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                      onClick={() => setRoomType('private')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${roomType === 'private' ? 'border-gold bg-gold/10 text-deep' : 'border-black/10 bg-white/50 text-soft hover:border-gold/50'}`}
                    >
                      <User size={24} />
                      <span className="text-xs font-medium">Private (2 Max)</span>
                    </button>
                    <button 
                      onClick={() => setRoomType('group')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${roomType === 'group' ? 'border-gold bg-gold/10 text-deep' : 'border-black/10 bg-white/50 text-soft hover:border-gold/50'}`}
                    >
                      <Users size={24} />
                      <span className="text-xs font-medium">Group (Unlimited)</span>
                    </button>
                  </div>
                </div>
              )}

              <button 
                disabled={mode === 'join' && !code.trim()}
                onClick={() => {
                  const finalCode = mode === 'create' ? Math.random().toString(36).substring(2, 10).toUpperCase() : code.toUpperCase();
                  onEnter(name, finalCode, roomType);
                }}
                className="w-full bg-gold text-deep py-4 rounded-xl font-medium hover:bg-amber transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {mode === 'join' ? <><KeyRound size={18} /> Unlock Space</> : <><Sparkles size={18} /> Create Space</>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
