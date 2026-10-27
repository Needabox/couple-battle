'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
        <span className="font-fun text-2xl sm:text-4xl md:text-5xl text-pink-600 font-extrabold animate-pulse">
          ?
        </span>
      );
    }

    const dotClass = "w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-rose-600 shadow-inner";

    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-rose-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-1.5 sm:p-2.5">
            <div className={dotClass} />
            <div className={`${dotClass} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-1.5 sm:p-2.5">
            <div className={dotClass} />
            <div className={`${dotClass} self-center`} />
            <div className={`${dotClass} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5">
            <div className={dotClass} />
            <div className={`${dotClass} justify-self-end`} />
            <div className={dotClass} />
            <div className={`${dotClass} justify-self-end`} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1 sm:p-2 place-items-center">
            <div className={`${dotClass} col-start-1 row-start-1`} />
            <div className={`${dotClass} col-start-3 row-start-1`} />
            <div className={`${dotClass} col-start-2 row-start-2`} />
            <div className={`${dotClass} col-start-1 row-start-3`} />
            <div className={`${dotClass} col-start-3 row-start-3`} />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-1 sm:gap-1.5 p-1 sm:p-2.5 place-items-center">
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
        );
      default:
        return <span className="font-fun text-xl sm:text-3xl md:text-4xl font-bold">{value}</span>;
    }
  };

  return (
    <div className="col-start-2 col-end-6 row-start-2 row-end-6 relative flex flex-col items-center justify-between p-1.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/75 backdrop-blur-xs border-2 sm:border-3.5 border-stone-800 toy-shadow-sm overflow-hidden z-10 m-0.5 sm:m-2">
      {/* Subtle doodle star background */}
      <div className="absolute inset-0 bg-doodle-stars opacity-40 pointer-events-none" />

      {/* Top Center: Logo "couple battle!" */}
      <div className="relative z-10 flex flex-col items-center text-center mt-0.5 sm:mt-1">
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-base sm:text-3xl"
          >
            💖
          </motion.div>
          <h1 className="font-fun text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
            couple battle!
          </h1>
          <motion.div
            animate={{ rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-base sm:text-3xl"
          >
            ✨
          </motion.div>
        </div>
        <p className="text-[9px] sm:text-sm font-bold text-stone-500 tracking-wide hidden xs:block">
          Monopoli Mini Spesial Pasangan ❤️
        </p>
      </div>

      {/* Center Interactive Stage: Dice & Chance Deck Preview */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-8 my-auto py-0.5 sm:py-2">
        {/* Chance Card Deck Preview */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenChancePreview}
          title="Tumpukan Kartu Kesempatan"
          className="cursor-pointer relative w-13 h-18 sm:w-22 sm:h-32 md:w-26 md:h-36 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-stone-800 bg-[#FEF08A] toy-shadow-sm flex flex-col items-center justify-between p-1 sm:p-2.5 bg-checkered-yellow overflow-hidden select-none"
        >
          {/* Card header */}
          <div className="text-[7.5px] sm:text-xs font-fun font-black text-amber-900 bg-amber-200/95 px-1 py-0.5 rounded-xs w-full text-center truncate">
            CHANCE
          </div>

          {/* Card center icon */}
          <div className="w-6 h-6 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-white border-2 border-stone-800 flex items-center justify-center toy-shadow-sm">
            <span className="font-fun text-sm sm:text-2xl font-black text-amber-500">
              ?
            </span>
          </div>

          <div className="text-[7.5px] sm:text-xs font-black text-amber-800 truncate">
            Acak Kartu
          </div>
        </motion.div>

        {/* 3D Interactive Dice */}
        <div className="flex flex-col items-center gap-1 sm:gap-2.5">
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
            className={`relative w-13 h-13 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-xl sm:rounded-3xl border-2.5 sm:border-3.5 border-stone-800 bg-white flex flex-col items-center justify-center transition-all ${
              isMyTurn
                ? 'cursor-pointer hover:border-pink-600 toy-shadow ring-3 sm:ring-5 ring-pink-300/70'
                : 'opacity-70 cursor-not-allowed bg-stone-100 toy-shadow-sm'
            }`}
          >
            {renderDiceDots(diceValue)}
          </motion.button>

          {/* Dice label / click instruction */}
          {isMyTurn ? (
            <span className="text-[9px] sm:text-sm font-fun font-black px-2 sm:px-3 py-0.5 sm:py-1 bg-rose-500 text-white rounded-full toy-shadow-sm animate-bounce truncate text-center">
              {isRolling ? 'Kocok...' : 'Kocok Dadu! 🎲'}
            </span>
          ) : (
            <span className="text-[8.5px] sm:text-xs md:text-sm font-bold text-stone-500 bg-stone-200/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full truncate">
              Giliran {activePlayer.name}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Center: Turn Banner & Quick Reaction Bar */}
      <div className="relative z-10 w-full flex flex-col items-center gap-1 sm:gap-2">
        {/* Turn Status Banner */}
        <div 
          className={`w-full max-w-xs sm:max-w-md px-2.5 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl border-1.5 sm:border-2.5 border-stone-800 toy-shadow-sm flex items-center justify-between text-[10px] sm:text-sm font-fun transition-colors ${
            isMyTurn 
              ? 'bg-rose-100 text-rose-950 border-rose-800' 
              : 'bg-stone-100 text-stone-700'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="text-sm sm:text-xl">{activePlayer.avatar}</span>
            <span className="font-extrabold truncate">
              {isMyTurn ? 'Giliran Kamu! Lempar dadumu' : `Giliran ${activePlayer.name}...`}
            </span>
          </div>

          <div className="text-[9px] sm:text-xs md:text-sm font-sans font-black px-2 py-0.5 rounded-lg bg-white/90 border border-stone-300 shrink-0">
            {player1.score} : {player2.score}
          </div>
        </div>

        {/* Quick Reaction Emoji Bar */}
        <div className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1.5 bg-white/85 rounded-full border border-stone-300 toy-shadow-sm">
          {['❤️', '🥺', '🤣', '💋', '🔥', '🎁'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSendReaction(emoji)}
              className="text-xs sm:text-xl md:text-2xl p-0.5 sm:p-1 hover:scale-130 active:scale-95 transition-transform cursor-pointer"
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
