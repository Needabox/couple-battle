'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, HelpCircle, Flame, Smile, Frown } from 'lucide-react';
import { Player, PlayerId } from '@/types/game';

interface CenterStageProps {
  currentTurn: PlayerId;
  myPlayerId: PlayerId;
  isSingleDevice: boolean;
  isRolling: boolean;
  diceValue: number | null;
  player1: Player;
  player2: Player;
  onRollDice: () => void;
  onSendReaction: (emoji: string) => void;
  onOpenChancePreview?: () => void;
}

export const CenterStage: React.FC<CenterStageProps> = ({
  currentTurn,
  myPlayerId,
  isSingleDevice,
  isRolling,
  diceValue,
  player1,
  player2,
  onRollDice,
  onSendReaction,
  onOpenChancePreview,
}) => {
  const isMyTurn = isSingleDevice || currentTurn === myPlayerId;
  const activePlayer = currentTurn === 1 ? player1 : player2;

  // Render dots for traditional dice faces
  const renderDiceDots = (value: number | null) => {
    if (!value) {
      return (
        <span className="font-fun text-3xl sm:text-4xl text-pink-600 font-extrabold animate-pulse">
          ?
        </span>
      );
    }

    const dotClass = "w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-rose-600 shadow-inner";

    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className={dotClass} />
            <div className={`${dotClass} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className={dotClass} />
            <div className={`${dotClass} self-center`} />
            <div className={`${dotClass} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
            <div className={dotClass} />
            <div className={`${dotClass} justify-self-end`} />
            <div className={dotClass} />
            <div className={`${dotClass} justify-self-end`} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1.5 place-items-center">
            <div className={`${dotClass} col-start-1 row-start-1`} />
            <div className={`${dotClass} col-start-3 row-start-1`} />
            <div className={`${dotClass} col-start-2 row-start-2`} />
            <div className={`${dotClass} col-start-1 row-start-3`} />
            <div className={`${dotClass} col-start-3 row-start-3`} />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-1 p-2 place-items-center">
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
        );
      default:
        return <span className="font-fun text-3xl font-bold">{value}</span>;
    }
  };

  return (
    <div className="col-start-2 col-end-6 row-start-2 row-end-6 relative flex flex-col items-center justify-between p-2 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-xs border-2 sm:border-3 border-stone-800 toy-shadow-sm overflow-hidden z-10 m-1 sm:m-2">
      {/* Subtle doodle heart background */}
      <div className="absolute inset-0 bg-doodle-stars opacity-40 pointer-events-none" />

      {/* Top Center: Logo "couple battle!" */}
      <div className="relative z-10 flex flex-col items-center text-center mt-0.5 sm:mt-1">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-lg sm:text-2xl"
          >
            💖
          </motion.div>
          <h1 className="font-fun text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
            couple battle!
          </h1>
          <motion.div
            animate={{ rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-lg sm:text-2xl"
          >
            ✨
          </motion.div>
        </div>
        <p className="text-[10px] sm:text-xs font-bold text-stone-500 tracking-wide">
          Monopoli Mini Spesial Pasangan ❤️
        </p>
      </div>

      {/* Center Interactive Stage: Dice & Chance Deck Preview */}
      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 my-auto py-1">
        {/* Chance Card Deck Preview */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenChancePreview}
          title="Tumpukan Kartu Kesempatan"
          className="cursor-pointer relative w-16 h-22 sm:w-22 sm:h-30 rounded-xl sm:rounded-2xl border-2 sm:border-2.5 border-stone-800 bg-[#FEF08A] toy-shadow-sm flex flex-col items-center justify-between p-1.5 sm:p-2 bg-checkered-yellow overflow-hidden select-none"
        >
          {/* Card header */}
          <div className="text-[8px] sm:text-[9px] font-fun font-extrabold text-amber-900 bg-amber-200/90 px-1 rounded-sm w-full text-center truncate">
            CHANCE
          </div>

          {/* Card center icon */}
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-stone-800 flex items-center justify-center toy-shadow-sm">
            <span className="font-fun text-lg sm:text-2xl font-black text-amber-500">
              ?
            </span>
          </div>

          <div className="text-[8px] sm:text-[9px] font-bold text-amber-800 truncate">
            Buka Kartu
          </div>
        </motion.div>

        {/* 3D Interactive Dice */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            type="button"
            disabled={!isMyTurn || isRolling}
            onClick={onRollDice}
            whileHover={isMyTurn && !isRolling ? { scale: 1.08 } : {}}
            whileTap={isMyTurn && !isRolling ? { scale: 0.92 } : {}}
            animate={
              isRolling
                ? {
                    rotate: [0, 90, 180, 270, 360, 450, 540, 720],
                    scale: [1, 1.15, 0.9, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className={`relative w-18 h-18 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border-3 border-stone-800 bg-white flex flex-col items-center justify-center transition-all ${
              isMyTurn
                ? 'cursor-pointer hover:border-pink-600 toy-shadow ring-4 ring-pink-300/60'
                : 'opacity-70 cursor-not-allowed bg-stone-100 toy-shadow-sm'
            }`}
          >
            {renderDiceDots(diceValue)}
          </motion.button>

          {/* Dice label / click instruction */}
          {isMyTurn ? (
            <span className="text-[10px] sm:text-xs font-fun font-bold px-2 py-0.5 bg-rose-500 text-white rounded-full toy-shadow-sm animate-bounce">
              {isRolling ? 'Mengocok...' : 'Kocok Dadu! 🎲'}
            </span>
          ) : (
            <span className="text-[9px] sm:text-[11px] font-semibold text-stone-500 bg-stone-200/90 px-2 py-0.5 rounded-full">
              Giliran {activePlayer.name}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Center: Turn Banner & Quick Reaction Bar */}
      <div className="relative z-10 w-full flex flex-col items-center gap-1.5 sm:gap-2">
        {/* Turn Status Banner */}
        <div 
          className={`w-full max-w-sm px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 border-stone-800 toy-shadow-sm flex items-center justify-between text-xs sm:text-sm font-fun transition-colors ${
            isMyTurn 
              ? 'bg-rose-100 text-rose-950 border-rose-800' 
              : 'bg-stone-100 text-stone-700'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-base sm:text-lg">{activePlayer.avatar}</span>
            <span className="font-bold truncate">
              {isMyTurn ? 'Giliran Kamu! Lempar dadumu' : `Giliran ${activePlayer.name}...`}
            </span>
          </div>

          <div className="text-[10px] sm:text-xs font-sans font-bold px-2 py-0.5 rounded-lg bg-white/80 border border-stone-300 shrink-0">
            Poin: {player1.score} vs {player2.score}
          </div>
        </div>

        {/* Quick Reaction Emoji Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/80 rounded-full border border-stone-300 toy-shadow-sm">
          {['❤️', '🥺', '🤣', '💋', '🔥', '🎁'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSendReaction(emoji)}
              className="text-base sm:text-lg p-1 hover:scale-130 active:scale-95 transition-transform"
              title={`Kirim ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
