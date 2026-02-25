import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RoomItem } from '../types';
import { X } from 'lucide-react';
import Reactions from './Reactions';

interface Props {
  key?: string | number;
  item: RoomItem;
  updateItem: (id: string, updates: Partial<RoomItem>) => void;
  removeItem: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
}

export default function StickyNote({ item, updateItem, removeItem, onReact }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.x, y: item.y, scale: 0, rotate: item.rotation }}
      animate={{ scale: 1, rotate: item.rotation }}
      className={`absolute w-48 h-48 p-4 shadow-lg cursor-grab active:cursor-grabbing flex flex-col group ${item.color || 'bg-gold'} text-deep`}
      style={{ borderRadius: '2px 12px 12px 12px', zIndex: 10 }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
    >
      <button 
        onClick={() => removeItem(item.id)}
        className="absolute -top-2 -right-2 bg-deep text-cream rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <X size={14} />
      </button>
      
      {item.author && (
        <div className="text-[10px] font-mono opacity-50 mb-1">{item.author}</div>
      )}

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            updateItem(item.id, { content: text });
          }}
          className="w-full h-full bg-transparent resize-none outline-none font-sans text-sm font-medium"
          placeholder="Type something..."
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="w-full h-full font-sans text-sm font-medium whitespace-pre-wrap overflow-hidden cursor-text"
        >
          {text || 'Click to edit...'}
        </div>
      )}

      <Reactions reactions={item.reactions} onReact={(emoji) => onReact(item.id, emoji)} />
    </motion.div>
  );
}
