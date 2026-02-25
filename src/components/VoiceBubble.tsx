import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RoomItem } from '../types';
import { X, Play, Square } from 'lucide-react';
import Reactions from './Reactions';

interface Props {
  key?: string | number;
  item: RoomItem;
  currentUser: string;
  removeItem: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function VoiceBubble({ item, currentUser, removeItem, onReact, onMove }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAuthor = item.author === currentUser;

  useEffect(() => {
    if (item.content && item.content !== 'voice_mock') {
      audioRef.current = new Audio(item.content);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [item.content]);

  const togglePlay = () => {
    if (!audioRef.current && item.content === 'voice_mock') {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        setTimeout(() => setIsPlaying(false), 3000);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.x, y: item.y, scale: 0 }}
      animate={{ x: item.x, y: item.y, scale: 1 }}
      onDragEnd={(e, info) => onMove(item.id, item.x + info.offset.x, item.y + info.offset.y)}
      className="absolute cursor-grab active:cursor-grabbing group"
      style={{ zIndex: 15 }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
    >
      {isAuthor && (
        <button 
          onClick={() => removeItem(item.id)}
          className="absolute -top-2 -right-2 bg-deep text-cream rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <X size={12} />
        </button>
      )}
      
      <div 
        onClick={togglePlay}
        className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-md border backdrop-blur-md transition-colors ${
          isPlaying 
            ? 'bg-sage/90 border-sage text-white' 
            : 'bg-white/80 border-white/40 text-deep hover:bg-white'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-white/20' : 'bg-sage/20 text-sage'}`}>
          {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </div>
        
        <div className="flex items-center gap-1 h-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div 
              key={i}
              className={`w-1 rounded-full ${isPlaying ? 'bg-white' : 'bg-sage/40'}`}
              animate={isPlaying ? {
                height: ['20%', '100%', '40%', '80%', '20%']
              } : {
                height: '40%'
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1
              }}
              style={{ height: '40%' }}
            />
          ))}
        </div>
        {item.author && (
          <span className="text-[10px] font-mono opacity-70 ml-2 border-l border-current pl-2">{item.author}</span>
        )}
      </div>
      
      <Reactions reactions={item.reactions} onReact={(emoji) => onReact(item.id, emoji)} />
    </motion.div>
  );
}
