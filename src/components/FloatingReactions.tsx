'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ReactionItem {
  id: string;
  emoji: string;
  senderName: string;
  x: number; // percentage 10% to 90%
}

interface FloatingReactionsProps {
  reactions: ReactionItem[];
}

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {reactions.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 100, x: `${item.x}vw`, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: '-80vh',
              scale: [0.6, 1.3, 1.1, 0.9],
              rotate: [-15, 15, -10, 10],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            className="absolute bottom-10 flex flex-col items-center"
          >
            <span className="text-4xl sm:text-5xl filter drop-shadow-md select-none">
              {item.emoji}
            </span>
            <span className="text-[10px] font-fun font-bold px-2 py-0.5 bg-white/90 text-stone-800 rounded-full border border-stone-300 shadow-sm mt-1">
              {item.senderName}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
