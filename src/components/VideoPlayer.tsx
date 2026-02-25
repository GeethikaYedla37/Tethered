import React from 'react';
import { motion } from 'motion/react';
import { RoomItem } from '../types';
import { X } from 'lucide-react';
import Reactions from './Reactions';

interface Props {
  key?: string | number;
  item: RoomItem;
  currentUser: string;
  removeItem: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function VideoPlayer({ item, currentUser, removeItem, onReact, onMove }: Props) {
  const isAuthor = item.author === currentUser;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.x, y: item.y, scale: 0, rotate: item.rotation }}
      animate={{ x: item.x, y: item.y, scale: 1, rotate: item.rotation }}
      onDragEnd={(e, info) => onMove(item.id, item.x + info.offset.x, item.y + info.offset.y)}
      className="absolute p-3 pb-8 bg-white shadow-xl cursor-grab active:cursor-grabbing group"
      style={{ zIndex: 10 }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
    >
      <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {isAuthor && (
          <button 
            onClick={() => removeItem(item.id)}
            className="bg-deep text-cream rounded-full p-1.5 shadow-md hover:bg-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="w-64 bg-black relative rounded-sm overflow-hidden">
        <video 
          src={item.content} 
          controls 
          className="w-full h-auto max-h-64 object-contain"
          playsInline
        />
      </div>
      
      {item.author && (
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-soft">{item.author}</div>
      )}

      <Reactions reactions={item.reactions} onReact={(emoji) => onReact(item.id, emoji)} />
    </motion.div>
  );
}
