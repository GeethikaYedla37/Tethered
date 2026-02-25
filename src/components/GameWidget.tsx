import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, RotateCcw } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
  currentUser: string;
  onClose: () => void;
}

export default function GameWidget({ socket, currentUser, onClose }: Props) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleAction = (action: any) => {
      if (action.type === 'PLAY_MOVE') {
        const newBoard = [...action.board];
        newBoard[action.index] = action.player;
        setBoard(newBoard);
        setXIsNext(action.player === 'X' ? false : true);
        checkWinner(newBoard);
      } else if (action.type === 'RESET_GAME') {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        setWinner(null);
      }
    };

    socket.on('game_action', handleAction);
    return () => {
      socket.off('game_action', handleAction);
    };
  }, [socket]);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
        return;
      }
    }
    if (!squares.includes(null)) {
      setWinner('Draw');
    }
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const player = xIsNext ? 'X' : 'O';
    socket?.emit('game_action', { type: 'PLAY_MOVE', index: i, player, board });
  };

  const resetGame = () => {
    socket?.emit('game_action', { type: 'RESET_GAME' });
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 100, scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute bg-white p-5 rounded-2xl shadow-xl border border-black/5 z-40 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-lg font-bold text-deep">Tic-Tac-Toe</h3>
        <button onClick={onClose} className="text-soft hover:text-deep"><X size={16}/></button>
      </div>

      <div className="text-center mb-4 text-sm font-medium text-soft">
        {winner ? (winner === 'Draw' ? "It's a draw!" : `Winner: ${winner}`) : `Next player: ${xIsNext ? 'X' : 'O'}`}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-16 h-16 bg-cream rounded-xl text-2xl font-bold flex items-center justify-center text-deep hover:bg-gold/20 transition-colors"
          >
            {square}
          </button>
        ))}
      </div>

      <button 
        onClick={resetGame}
        className="w-full py-2 bg-black/5 rounded-lg text-sm font-medium hover:bg-black/10 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Reset Game
      </button>
    </motion.div>
  );
}
