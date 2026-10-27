'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, CheckCircle2, Award, 
  HelpCircle, AlertCircle, ArrowRight, Dices, RotateCcw
} from 'lucide-react';
import { BoardTile, ChanceCard, PlayerId, Player } from '@/types/game';
import { soundManager } from '@/lib/sounds';

interface ChallengeModalProps {
  isOpen: boolean;
  isChance: boolean;
  tile?: BoardTile;
  chanceCard?: ChanceCard;
  currentTurn: PlayerId;
  myPlayerId: PlayerId;
  isSingleDevice: boolean;
  player1: Player;
  player2: Player;
  onComplete: () => void;
  onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  isChance,
  tile,
  chanceCard,
  currentTurn,
  myPlayerId,
  isSingleDevice,
  player1,
  player2,
  onComplete,
  onClose,
}) => {
  if (!isOpen) return null;

  const activePlayer = currentTurn === 1 ? player1 : player2;
  const isMyTurn = isSingleDevice || currentTurn === myPlayerId;

  const handleFinish = () => {
    soundManager.playSuccess();
    soundManager.vibrate([40, 30, 60]);
    onComplete();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="w-full max-w-md relative bg-[#FFFDF5] border-3 border-stone-800 rounded-3xl toy-shadow-lg overflow-hidden flex flex-col"
        >
          {/* Card Style Decoration Header */}
          {isChance ? (
            /* Chance Card Yellow Checkered Header */
            <div className="bg-[#FEF08A] bg-checkered-yellow p-4 sm:p-5 border-b-3 border-stone-800 flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 border-2 border-stone-800 flex items-center justify-center font-fun text-xl font-black toy-shadow-sm">
                  ?
                </span>
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 bg-amber-300 text-amber-900 rounded-full border border-amber-500 inline-block mb-0.5">
                    {chanceCard?.category || 'Kartu Kesempatan'}
                  </span>
                  <h3 className="font-fun text-lg sm:text-2xl font-black text-stone-900">
                    KARTU KESEMPATAN!
                  </h3>
                </div>
              </div>

              <div className="text-3xl animate-bounce">
                🌼
              </div>
            </div>
          ) : (
            /* Regular Tile Challenge Header */
            <div 
              className="p-4 sm:p-5 border-b-3 border-stone-800 flex items-center justify-between relative"
              style={{ backgroundColor: tile?.bgColor || '#FCE7F3' }}
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-10 h-10 rounded-2xl bg-white border-2 border-stone-800 flex items-center justify-center toy-shadow-sm text-xl"
                  style={{ color: tile?.textColor || '#BE185D' }}
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                </span>
                <div>
                  <span 
                    className="text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 rounded-full border border-black/30 inline-block mb-0.5 text-white"
                    style={{ backgroundColor: tile?.textColor || '#BE185D' }}
                  >
                    Tantangan Petak #{tile?.id}
                  </span>
                  <h3 
                    className="font-fun text-lg sm:text-2xl font-black"
                    style={{ color: tile?.textColor || '#BE185D' }}
                  >
                    {tile?.title}
                  </h3>
                </div>
              </div>

              <div className="text-2xl">
                {tile?.type === 'skull' ? '💀' : tile?.type === 'safe' ? '🕊️' : '💖'}
              </div>
            </div>
          )}

          {/* Modal Content Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Active Performer Banner */}
            <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-2xl border-2 border-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1 bg-white rounded-xl border border-stone-200">
                  {activePlayer.avatar}
                </span>
                <div>
                  <span className="text-[10px] text-stone-500 font-bold block">
                    Pemain yang Ditantang:
                  </span>
                  <span className="font-fun font-bold text-sm text-stone-800">
                    {activePlayer.name} {isMyTurn ? '(Kamu)' : ''}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                +1 Poin Cinta ❤️
              </span>
            </div>

            {/* The Main Challenge / Question Text */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border-2 border-stone-800 toy-shadow-sm space-y-2">
              {isChance ? (
                <>
                  <h4 className="font-fun text-base sm:text-lg font-bold text-amber-900 leading-snug">
                    {chanceCard?.question}
                  </h4>
                  {chanceCard?.instruction && (
                    <p className="text-xs sm:text-sm text-stone-600 italic">
                      💡 {chanceCard?.instruction}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-fun text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {tile?.description}
                  </h4>

                  {/* Dynamic randomized challenge/question from 130+ card deck */}
                  {chanceCard && (
                    <div className="mt-2 pt-2 border-t border-dashed border-stone-300 bg-amber-50/70 p-2.5 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-900 border border-amber-300">
                          {chanceCard.category || 'Tantangan Acak'}
                        </span>
                        <span className="text-[10px] font-fun font-bold text-stone-500">
                          #{chanceCard.id}
                        </span>
                      </div>
                      <p className="font-fun text-xs sm:text-sm font-bold text-amber-950 leading-snug">
                        "{chanceCard.question}"
                      </p>
                      {chanceCard.instruction && (
                        <p className="text-[10px] sm:text-xs text-stone-600 italic mt-1">
                          💡 {chanceCard.instruction}
                        </p>
                      )}
                    </div>
                  )}

                  {tile?.type === 'roll_again' && (
                    <p className="text-xs text-amber-700 font-bold flex items-center gap-1 mt-1">
                      <Dices className="w-4 h-4" /> Giliran kamu tidak berganti, lempar dadu lagi!
                    </p>
                  )}
                  {tile?.actionValue && (
                    <p className="text-xs text-blue-700 font-bold flex items-center gap-1 mt-1">
                      <RotateCcw className="w-4 h-4" /> Pion akan otomatis berpindah {tile.actionValue > 0 ? `maju ${tile.actionValue}` : `mundur ${Math.abs(tile.actionValue)}`} petak!
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {isMyTurn ? (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-fun font-bold text-sm sm:text-base rounded-2xl border-2 border-stone-900 toy-shadow cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Tantangan Selesai! Ganti Giliran</span>
                </button>
              ) : (
                <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-center">
                  <p className="text-xs font-fun font-bold text-amber-900">
                    Menunggu {activePlayer.name} menyelesaikan tantangannya... ⏳
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Lihat layar pasangan dan nikmati reaksinya!
                  </p>
                </div>
              )}

              {/* Close / Peek Board button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Intip Papan Permainan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
