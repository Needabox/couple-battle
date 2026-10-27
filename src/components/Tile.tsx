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
      className={`relative select-none rounded-xl sm:rounded-2xl border-2 sm:border-2.5 border-[#2D2A26] toy-shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between p-1 sm:p-2 group hover:scale-[1.02] active:scale-[0.98] ${
        isCorner ? 'font-bold' : ''
      } ${hasPlayer ? 'ring-2 ring-pink-400/80 z-20' : ''}`}
    >
      {/* Background color layer */}
      <div 
        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-95 transition-colors"
        style={{ backgroundColor: tile.bgColor }}
      />

      {/* Decorative patterns for chance & special tiles */}
      {tile.type === 'chance' && (
        <div className="absolute inset-0 bg-checkered-yellow opacity-25 pointer-events-none rounded-xl sm:rounded-2xl" />
      )}
      {tile.type === 'safe' && (
        <div className="absolute inset-0 bg-checkered-pink opacity-20 pointer-events-none rounded-xl sm:rounded-2xl" />
      )}

      {/* Top Bar: Tile ID / Badge */}
      <div className="relative z-10 flex items-center justify-between w-full leading-none">
        {tile.badge ? (
          <span 
            className="text-[7px] sm:text-[9px] font-extrabold px-1 py-0.5 rounded-full uppercase tracking-wider text-white border border-black/40 shadow-xs"
            style={{ backgroundColor: tile.textColor }}
          >
            {tile.badge}
          </span>
        ) : (
          <span className="text-[7px] sm:text-[9px] font-bold text-stone-500 opacity-70">
            #{tile.id}
          </span>
        )}

        {tile.type === 'chance' && !hasPlayer && (
          <span className="text-[9px] sm:text-xs font-fun font-bold text-amber-700 animate-bounce">
            ?
          </span>
        )}
      </div>

      {/* Center Area: Player Avatar(s) if present, else Tile Icon */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto text-center px-0.5">
        {hasPlayer ? (
          /* Prominent Centered Player Pawns (Never submerged!) */
          <div className="flex items-center justify-center -space-x-1.5 sm:space-x-1 my-0.5 sm:my-1">
            {isP1Here && (
              <div 
                title={player1.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs sm:text-base border-2 border-white shadow-md animate-bounce ring-2 ring-pink-400 z-10"
              >
                {player1.avatar || '🐱'}
              </div>
            )}
            {isP2Here && (
              <div 
                title={player2.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs sm:text-base border-2 border-white shadow-md animate-bounce ring-2 ring-sky-400 z-10"
                style={{ animationDelay: '0.15s' }}
              >
                {player2.avatar || '🐰'}
              </div>
            )}
          </div>
        ) : (
          /* Default Tile Icon */
          <div 
            className="p-0.5 sm:p-1 rounded-lg transition-transform group-hover:scale-110"
            style={{ color: tile.textColor }}
          >
            <IconComponent className={isCorner ? 'w-4 h-4 sm:w-6 sm:h-6' : 'w-3.5 h-3.5 sm:w-5 sm:h-5'} />
          </div>
        )}

        <h4 
          className={`font-fun leading-tight text-center line-clamp-2 ${
            isCorner ? 'text-[9px] sm:text-xs font-extrabold' : 'text-[8px] sm:text-[10.5px] font-bold'
          }`}
          style={{ color: tile.textColor }}
        >
          {tile.title}
        </h4>

        {tile.subtitle && (
          <p className="hidden sm:block text-[8px] text-stone-600 font-medium opacity-80 mt-0.5 truncate max-w-full">
            {tile.subtitle}
          </p>
        )}
      </div>

      {/* Bottom status dot when player is on tile */}
      <div className="relative z-10 min-h-[4px] sm:min-h-[6px] flex items-center justify-center">
        {hasPlayer && (
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-ping" />
        )}
      </div>
    </div>
  );
};
