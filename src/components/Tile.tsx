'use client';

import React from 'react';
import { 
  Footprints, Smile, Ghost, Dices, HelpCircle, ShieldCheck, 
  FastForward, Mic, MessageSquareText, Gift, HandHeart, Search, 
  Camera, Skull, Rewind, Smartphone, HeartHandshake, Sparkles, Heart
} from 'lucide-react';
import { BoardTile, Player } from '@/types/game';

interface TileProps {
  tile: BoardTile;
  player1: Player;
  player2: Player;
  isP1Here: boolean;
  isP2Here: boolean;
  onTileClick?: (tile: BoardTile) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Footprints,
  Smile,
  Ghost,
  Dices,
  HelpCircle,
  ShieldCheck,
  FastForward,
  Mic,
  MessageSquareText,
  Gift,
  HandHeart,
  Search,
  Camera,
  Skull,
  Rewind,
  Smartphone,
  HeartHandshake,
};

export const Tile: React.FC<TileProps> = ({
  tile,
  player1,
  player2,
  isP1Here,
  isP2Here,
  onTileClick,
}) => {
  const IconComponent = iconMap[tile.iconName] || Sparkles;
  const isCorner = ['start', 'safe', 'jail', 'skull'].includes(tile.type);
  const hasPlayer = isP1Here || isP2Here;

  // Position tile in 6x6 CSS grid
  const gridStyle: React.CSSProperties = {
    gridRow: tile.gridRow,
    gridColumn: tile.gridCol,
  };

  return (
    <div
      style={gridStyle}
      onClick={() => onTileClick?.(tile)}
      className={`relative select-none rounded-xl sm:rounded-2xl border-2 sm:border-2.5 md:border-3 border-[#2D2A26] toy-shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-center justify-between p-1 sm:p-1.5 md:p-2 overflow-hidden group hover:scale-[1.02] active:scale-[0.98] ${
        isCorner ? 'font-black' : ''
      } ${hasPlayer ? 'ring-2 sm:ring-3 ring-pink-400 z-20' : ''}`}
    >
      {/* Background color layer */}
      <div 
        className="absolute inset-0 opacity-95 transition-colors"
        style={{ backgroundColor: tile.bgColor }}
      />

      {/* Decorative patterns for chance & safe tiles */}
      {tile.type === 'chance' && (
        <div className="absolute inset-0 bg-checkered-yellow opacity-25 pointer-events-none" />
      )}
      {tile.type === 'safe' && (
        <div className="absolute inset-0 bg-checkered-pink opacity-20 pointer-events-none" />
      )}

      {/* Top Row: Tile ID or Badge */}
      <div className="relative z-10 flex items-center justify-between w-full shrink-0 leading-none">
        {tile.badge ? (
          <span 
            className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider text-white border border-black/40 shadow-xs"
            style={{ backgroundColor: tile.textColor }}
          >
            {tile.badge}
          </span>
        ) : (
          <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-xs font-black text-stone-500 opacity-70">
            #{tile.id}
          </span>
        )}

        {tile.type === 'chance' && !hasPlayer && (
          <span className="text-[9px] sm:text-xs md:text-sm font-fun font-black text-amber-700 animate-bounce">
            ?
          </span>
        )}
      </div>

      {/* Center Area: Player Avatar(s) or Tile Icon */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full min-h-0 text-center my-0.5">
        {hasPlayer ? (
          /* Centered Player Pawns */
          <div className="flex items-center justify-center -space-x-1 sm:space-x-1">
            {isP1Here && (
              <div 
                title={player1.name}
                className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] xs:text-xs sm:text-base md:text-xl border-1.5 sm:border-2 border-white shadow-md animate-bounce ring-2 ring-pink-400 z-10"
              >
                {player1.avatar || '🐱'}
              </div>
            )}
            {isP2Here && (
              <div 
                title={player2.name}
                className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] xs:text-xs sm:text-base md:text-xl border-1.5 sm:border-2 border-white shadow-md animate-bounce ring-2 ring-sky-400 z-10"
                style={{ animationDelay: '0.15s' }}
              >
                {player2.avatar || '🐰'}
              </div>
            )}
          </div>
        ) : (
          /* Compact Tile Icon (Leaves abundant room for big title!) */
          <div 
            className="p-0.5 rounded-lg transition-transform group-hover:scale-110"
            style={{ color: tile.textColor }}
          >
            <IconComponent className={isCorner ? 'w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7' : 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-6 md:h-6'} />
          </div>
        )}
      </div>

      {/* Bottom Area: Big, Bold, and Clear Title that NEVER overflows */}
      <h4 
        className={`relative z-10 w-full text-center font-fun font-black leading-tight shrink-0 line-clamp-2 px-0.5 pb-0.5 ${
          isCorner 
            ? 'text-[9.5px] xs:text-[11px] sm:text-xs md:text-sm lg:text-[15px] uppercase tracking-tight' 
            : 'text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-[14px]'
        }`}
        style={{ color: tile.textColor }}
      >
        {tile.title}
      </h4>
    </div>
  );
};
