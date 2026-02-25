import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: { color: string; font: string };
  setSettings: (s: { color: string; font: string }) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, setSettings }: Props) {
  if (!isOpen) return null;

  const colors = [
    { id: 'bg-gold', label: 'Gold' },
    { id: 'bg-blush', label: 'Blush' },
    { id: 'bg-sage', label: 'Sage' },
    { id: 'bg-white', label: 'White' },
  ];

  const fonts = [
    { id: 'font-sans', label: 'Sans Serif' },
    { id: 'font-serif', label: 'Serif' },
    { id: 'font-mono', label: 'Monospace' },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl text-deep font-bold">Note Settings</h3>
          <button onClick={onClose} className="text-soft hover:text-deep transition-colors"><X size={20}/></button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-soft uppercase tracking-widest mb-3">Default Color</label>
            <div className="flex gap-3">
              {colors.map(c => (
                <button 
                  key={c.id}
                  onClick={() => setSettings({ ...settings, color: c.id })}
                  className={`w-8 h-8 rounded-full ${c.id} border-2 transition-all ${settings.color === c.id ? 'border-deep scale-110 shadow-md' : 'border-black/10 hover:scale-105'}`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-soft uppercase tracking-widest mb-3">Default Font</label>
            <div className="flex flex-col gap-2">
              {fonts.map(f => (
                <button 
                  key={f.id}
                  onClick={() => setSettings({ ...settings, font: f.id })}
                  className={`px-4 py-2 rounded-lg text-left transition-colors ${f.id} ${settings.font === f.id ? 'bg-black/5 font-bold text-deep' : 'hover:bg-black/5 text-soft'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
