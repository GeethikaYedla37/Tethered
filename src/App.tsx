import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Mic, Sparkles, Square, Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { RoomItem, Mood } from './types';

import Sticky from './components/StickyNote';
import Photo from './components/PhotoFrame';
import Voice from './components/VoiceBubble';
import MoodSelector from './components/MoodSelector';
import AuthPage from './components/AuthPage';

const MOOD_COLORS: Record<Mood, string> = {
  neutral: 'var(--color-cream)',
  calm: '#e0f2fe',
  energetic: '#fef3c7',
  melancholy: '#e0e7ff',
  warm: '#ffedd5',
};

const MOOD_EMOJIS: Record<Mood, string> = {
  neutral: '😶', calm: '☁️', energetic: '⚡', melancholy: '🌧️', warm: '🌅'
};

const fileToBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function App() {
  const [view, setView] = useState<'auth' | 'room'>('auth');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  const [items, setItems] = useState<RoomItem[]>([]);
  const [mood, setMood] = useState<Mood>('neutral');
  const [showMood, setShowMood] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view === 'room') {
      const newSocket = io();
      setSocket(newSocket);

      newSocket.emit('join_room', { roomId, userName });

      newSocket.on('room_state', (state) => {
        setItems(state.items);
        setMood(state.mood);
        setUsers(state.users);
      });

      newSocket.on('users_update', (updatedUsers) => {
        setUsers(updatedUsers);
      });

      newSocket.on('item_added', (item) => {
        setItems(prev => {
          if (prev.find(i => i.id === item.id)) return prev;
          return [...prev, item];
        });
      });

      newSocket.on('item_updated', ({ id, updates }) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      });

      newSocket.on('item_removed', (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
      });

      newSocket.on('mood_changed', (newMood) => {
        setMood(newMood);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [view, roomId, userName]);

  const addItem = (type: RoomItem['type'], content?: string, color?: string) => {
    const newItem: RoomItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      type,
      x: window.innerWidth / 2 - 100 + (Math.random() * 100 - 50),
      y: window.innerHeight / 2 - 100 + (Math.random() * 100 - 50),
      content,
      color,
      rotation: Math.random() * 10 - 5,
      author: userName,
      reactions: []
    };
    socket?.emit('add_item', newItem);
  };

  const updateItem = (id: string, updates: Partial<RoomItem>) => {
    socket?.emit('update_item', { id, updates });
  };

  const removeItem = (id: string) => {
    socket?.emit('remove_item', id);
  };

  const handleReact = (id: string, emoji: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    let newReactions = [...(item.reactions || [])];
    const existing = newReactions.find(r => r.emoji === emoji);
    
    if (existing) {
      if (existing.users.includes(userName)) {
        const newUsers = existing.users.filter(u => u !== userName);
        if (newUsers.length === 0) {
          newReactions = newReactions.filter(r => r.emoji !== emoji);
        } else {
          newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, users: newUsers } : r);
        }
      } else {
        newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, userName] } : r);
      }
    } else {
      newReactions.push({ emoji, count: 1, users: [userName] });
    }
    
    updateItem(id, { reactions: newReactions });
  };

  const handleReplacePhoto = async (id: string, file: File) => {
    const base64 = await fileToBase64(file);
    updateItem(id, { content: base64 });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      addItem('photo', base64);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (chatInput.trim()) {
      const colors = ['bg-gold', 'bg-blush', 'bg-sage', 'bg-white'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const x = Math.random() * (window.innerWidth - 300) + 100;
      const y = Math.random() * (window.innerHeight - 300) + 100;

      const newItem: RoomItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        type: 'sticky',
        x, y,
        content: chatInput.trim(),
        color: randomColor,
        rotation: Math.random() * 10 - 5,
        author: userName,
        reactions: []
      };
      socket?.emit('add_item', newItem);
      setChatInput('');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const base64 = await fileToBase64(audioBlob);
          addItem('voice', base64);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const handleSetMood = (newMood: Mood) => {
    socket?.emit('change_mood', newMood);
  };

  if (view === 'auth') {
    return <AuthPage onEnter={(name, code) => {
      setUserName(name);
      setRoomId(code);
      setView('room');
    }} />;
  }

  const roommates = users.filter(u => u !== userName);

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: MOOD_COLORS[mood] }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 mix-blend-multiply">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold/20 blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blush/20 blur-[120px]"
        />
      </div>

      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30 pointer-events-none">
        <div className="font-serif text-2xl font-bold text-deep pointer-events-auto">
          <em className="text-gold not-italic">T</em>ethered
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-deep">Room: {roomId}</span>
          </div>
          {roommates.length > 0 ? (
            <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-sans font-medium text-deep">
                {roommates.join(', ')} {roommates.length === 1 ? 'is' : 'are'} here
              </span>
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm flex items-center gap-2 opacity-50">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-xs font-sans font-medium text-deep">You are alone</span>
            </div>
          )}
        </div>
      </header>

      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {items.map(item => {
            if (item.type === 'sticky') {
              return <Sticky key={item.id} item={item} updateItem={updateItem} removeItem={removeItem} onReact={handleReact} />;
            }
            if (item.type === 'photo') {
              return <Photo key={item.id} item={item} removeItem={removeItem} onReact={handleReact} onReplace={handleReplacePhoto} />;
            }
            if (item.type === 'voice') {
              return <Voice key={item.id} item={item} removeItem={removeItem} onReact={handleReact} />;
            }
            return null;
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-full shadow-2xl border border-white/40 flex items-center gap-2 z-50 w-[90%] max-w-2xl">
        
        <form onSubmit={handleChatSubmit} className="flex-1 flex items-center bg-white/50 border border-black/10 rounded-full px-4 py-2 focus-within:border-gold/50 transition-colors">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a note and press enter..." 
            className="flex-1 bg-transparent outline-none font-sans text-sm text-deep placeholder:text-soft"
          />
          <button type="submit" className="text-gold hover:text-amber transition-colors ml-2" disabled={!chatInput.trim()}>
            <Send size={16} />
          </button>
        </form>

        <div className="w-px h-8 bg-black/10 mx-2" />

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="p-2.5 hover:bg-black/5 rounded-full transition-colors text-deep group relative"
          title="Add Photo"
        >
          <ImageIcon size={20} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Photo</span>
        </button>
        <button 
          onClick={toggleRecording} 
          className={`p-2.5 rounded-full transition-colors group relative ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-black/5 text-deep'}`}
          title={isRecording ? "Stop Recording" : "Record Voice"}
        >
          {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isRecording ? 'Stop' : 'Voice'}
          </span>
        </button>
        
        <div className="w-px h-8 bg-black/10 mx-2" />
        
        <button 
          onClick={() => setShowMood(!showMood)} 
          className={`p-2.5 rounded-full transition-colors group relative ${showMood ? 'bg-gold/20 text-amber' : 'hover:bg-black/5 text-deep'}`}
          title="Change Mood"
        >
          <Sparkles size={20} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mood</span>
        </button>
      </div>

      <MoodSelector 
        currentMood={mood} 
        setMood={handleSetMood} 
        isOpen={showMood} 
        onClose={() => setShowMood(false)} 
      />
    </div>
  );
}
