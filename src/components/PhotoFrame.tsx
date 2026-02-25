import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { RoomItem } from '../types';
import { X, RefreshCw } from 'lucide-react';
import Reactions from './Reactions';

interface Props {
  key?: string | number;
  item: RoomItem;
  removeItem: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onReplace: (id: string, file: File) => void;
}

export default function PhotoFrame({ item, removeItem, onReact, onReplace }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplace(item.id, file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.x, y: item.y, scale: 0, rotate: item.rotation }}
      animate={{ scale: 1, rotate: item.rotation }}
      className="absolute p-3 pb-8 bg-white shadow-xl cursor-grab active:cursor-grabbing group"
      style={{ zIndex: 10 }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
    >
      <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-deep rounded-full p-1.5 shadow-md border border-black/5 hover:bg-gray-50"
          title="Replace Photo"
        >
          <RefreshCw size={14} />
        </button>
        <button 
          onClick={() => removeItem(item.id)}
          className="bg-deep text-cream rounded-full p-1.5 shadow-md hover:bg-ink"
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="w-64 h-64 overflow-hidden bg-gray-100 border border-gray-200 relative">
        <img 
          src={item.content} 
          alt="Memory" 
          className="w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {item.author && (
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-soft">{item.author}</div>
      )}

      <Reactions reactions={item.reactions} onReact={(emoji) => onReact(item.id, emoji)} />
    </motion.div>
  );
}
