import { Reaction } from '../types';

const EMOJIS = ['❤️', '😂', '🥺', '✨'];

interface Props {
  reactions?: Reaction[];
  onReact: (emoji: string) => void;
}

export default function Reactions({ reactions = [], onReact }: Props) {
  return (
    <div className="absolute -bottom-3 left-4 flex gap-1 z-30">
      {reactions.map(r => (
        <button 
          key={r.emoji} 
          onClick={() => onReact(r.emoji)} 
          className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-black/5 text-xs hover:scale-105 transition-transform"
        >
          <span>{r.emoji}</span>
          <span className="font-medium text-soft">{r.count}</span>
        </button>
      ))}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-black/5">
        {EMOJIS.filter(e => !reactions.find(r => r.emoji === e)).map(e => (
          <button 
            key={e} 
            onClick={() => onReact(e)} 
            className="hover:scale-125 transition-transform text-xs"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
