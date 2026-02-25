import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Location, Room, Emotion, Task } from '../types';
import { 
  Home, Map as MapIcon, Film, Gamepad2, Dumbbell, ShoppingBag, Briefcase, GraduationCap,
  Coffee, Utensils, Bed, WashingMachine, Smile, Frown, Angry, Heart, BellOff, BellRing,
  CheckCircle2, Circle
} from 'lucide-react';
import CookingGame from './CookingGame';

interface Props {
  userName: string;
}

const EMOTION_ICONS: Record<Emotion, React.ReactNode> = {
  happy: <Smile className="text-emerald-500" size={20} />,
  sad: <Frown className="text-blue-500" size={20} />,
  angry: <Angry className="text-red-500" size={20} />,
  caring: <Heart className="text-rose-500" size={20} />,
  neutral: <Smile className="text-slate-400" size={20} />
};

export default function GameScreen({ userName }: Props) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: userName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&style=circle`,
    location: 'home',
    room: 'bedroom',
    status: 'Idle',
    emotion: 'neutral',
    isBusy: false
  });

  const [avatarPos, setAvatarPos] = useState({ x: 150, y: 250 });
  const [avatarRotation, setAvatarRotation] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showCooking, setShowCooking] = useState(false);

  const handleInteract = (action: string, x: number, y: number, rotate: number = 0) => {
    setIsSleeping(false);
    setAvatarPos({ x, y });
    setAvatarRotation(rotate);
    setCurrentUser(prev => ({ ...prev, status: action }));

    if (action === 'Sleeping') {
      setTimeout(() => setIsSleeping(true), 500);
    }
    if (action === 'Cooking') {
      setTimeout(() => setShowCooking(true), 500);
    }
  };

  const handleCookingComplete = (meal: string) => {
    setShowCooking(false);
    setCurrentUser(prev => ({ ...prev, status: `Eating ${meal}`, emotion: 'happy' }));
    setAvatarPos({ x: 150, y: 250 }); // move to center
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full bg-slate-100 border-2 border-indigo-100" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                  {EMOTION_ICONS[currentUser.emotion]}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">{currentUser.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{currentUser.status}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-mono text-slate-500 border border-slate-200">
            SECURE TUNNEL ACTIVE
          </div>
        </div>
      </header>

      {/* Main Visual Room */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col relative">
        <div className="w-full flex-1 bg-amber-50 rounded-3xl border-4 border-amber-200 overflow-hidden relative shadow-inner">
          {/* Wall */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-blue-50 border-b-4 border-blue-200 flex items-center justify-center">
            {/* Window */}
            <div className="w-32 h-32 bg-sky-200 border-8 border-white rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full" />
              <div className="absolute w-full h-2 bg-white top-1/2 -translate-y-1/2" />
              <div className="absolute h-full w-2 bg-white left-1/2 -translate-x-1/2" />
            </div>
          </div>
          
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-amber-100" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 42px)' }} />

          {/* Interactive Objects */}
          
          {/* Bed */}
          <div 
            onClick={() => handleInteract('Sleeping', 50, 180, 90)}
            className="absolute left-10 top-1/2 -translate-y-1/4 text-8xl cursor-pointer hover:scale-105 transition-transform drop-shadow-xl z-10"
            title="Sleep"
          >
            🛏️
          </div>

          {/* Stove */}
          <div 
            onClick={() => handleInteract('Cooking', window.innerWidth > 800 ? 600 : 250, 200, 0)}
            className="absolute right-10 top-1/2 -translate-y-1/4 text-8xl cursor-pointer hover:scale-105 transition-transform drop-shadow-xl z-10"
            title="Cook"
          >
            🍳
          </div>

          {/* Sofa */}
          <div 
            onClick={() => handleInteract('Relaxing', window.innerWidth > 800 ? 300 : 150, 250, 0)}
            className="absolute left-1/2 -translate-x-1/2 bottom-10 text-8xl cursor-pointer hover:scale-105 transition-transform drop-shadow-xl z-10"
            title="Relax"
          >
            🛋️
          </div>

          {/* Washing Machine */}
          <div 
            onClick={() => handleInteract('Washing Clothes', 100, 300, 0)}
            className="absolute left-32 bottom-20 text-6xl cursor-pointer hover:scale-105 transition-transform drop-shadow-xl z-10"
            title="Wash Clothes"
          >
            🧺
          </div>

          {/* Avatar */}
          <motion.div
            animate={{ 
              x: avatarPos.x, 
              y: avatarPos.y, 
              rotate: avatarRotation 
            }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="absolute z-20 flex flex-col items-center"
          >
            <AnimatePresence>
              {isSleeping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 -right-8 text-2xl font-bold text-blue-500"
                >
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}>Z</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}>z</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}>z</motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <img src={currentUser.avatar} alt="Avatar" className="w-24 h-24 drop-shadow-2xl" />
            <div className="w-12 h-3 bg-black/20 rounded-full blur-sm mt-1" />
          </motion.div>
        </div>

        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
          <p className="text-slate-600 font-medium">Click on the Bed, Stove, Sofa, or Laundry to interact!</p>
        </div>
      </main>

      {/* Cooking Mini-Game Overlay */}
      {showCooking && (
        <CookingGame 
          onComplete={handleCookingComplete} 
          onCancel={() => {
            setShowCooking(false);
            setCurrentUser(prev => ({ ...prev, status: 'Idle' }));
            setAvatarPos({ x: 150, y: 250 });
          }} 
        />
      )}
    </div>
  );
}
