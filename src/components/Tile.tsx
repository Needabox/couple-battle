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

  // Position tile in 6x6 CSS grid
  const gridStyle: React.CSSProperties = {
    gridRow: tile.gridRow,
    gridColumn: tile.gridCol,
  };

  return (
    <div
      style={gridStyle}
      onClick={() => onTileClick?.(tile)}
      className={`relative select-none rounded-xl sm:rounded-2xl border-2 sm:border-2.5 border-[#2D2A26] toy-shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between p-1 sm:p-2 overflow-hidden group hover:scale-[1.03] active:scale-[0.98] ${
        isCorner ? 'font-bold' : ''
      }`}
    >
      {/* Background color layer */}
      <div 
        className="absolute inset-0 opacity-95 transition-colors"
        style={{ backgroundColor: tile.bgColor }}
      />

      {/* Decorative patterns for chance & special tiles */}
      {tile.type === 'chance' && (
        <div className="absolute inset-0 bg-checkered-yellow opacity-25 pointer-events-none" />
      )}
      {tile.type === 'safe' && (
        <div className="absolute inset-0 bg-checkered-pink opacity-20 pointer-events-none" />
      )}

      {/* Top Bar: Tile ID / Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {tile.badge ? (
          <span 
            className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider text-white border border-black/40 shadow-xs"
            style={{ backgroundColor: tile.textColor }}
          >
            {tile.badge}
          </span>
        ) : (
          <span className="text-[8px] sm:text-[9px] font-bold text-stone-500 opacity-70">
            #{tile.id}
          </span>
        )}

        {tile.type === 'chance' && (
          <span className="text-[10px] font-fun font-bold text-amber-700 animate-bounce">
            ?
          </span>
        )}
      </div>

      {/* Center Icon & Content */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-0.5">
        <div 
          className="p-1 sm:p-1.5 rounded-lg mb-0.5 sm:mb-1 transition-transform group-hover:scale-110"
          style={{ color: tile.textColor }}
        >
          <IconComponent className={isCorner ? 'w-5 h-5 sm:w-7 sm:h-7' : 'w-3.5 h-3.5 sm:w-5 sm:h-5'} />
        </div>

        <h4 
          className={`font-fun leading-tight text-center line-clamp-2 ${
            isCorner ? 'text-[11px] sm:text-xs font-extrabold' : 'text-[9px] sm:text-[11px] font-bold'
          }`}
          style={{ color: tile.textColor }}
        >
          {tile.title}
        </h4>

        {tile.subtitle && (
          <p className="hidden sm:block text-[8px] sm:text-[9px] text-stone-600 font-medium opacity-80 mt-0.5 truncate max-w-full">
            {tile.subtitle}
          </p>
        )}
      </div>

      {/* Bottom Area: Pawns Indicator */}
      <div className="relative z-20 min-h-[18px] sm:min-h-[24px] flex items-center justify-center gap-1 mt-auto">
        {isP1Here && (
          <div 
            title={player1.name}
            className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs sm:text-sm border-2 border-white shadow-md animate-bounce ring-2 ring-pink-400"
          >
            {player1.avatar || '💖'}
          </div>
        )}
        {isP2Here && (
          <div 
            title={player2.name}
            className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs sm:text-sm border-2 border-white shadow-md animate-bounce ring-2 ring-sky-400"
            style={{ animationDelay: '0.15s' }}
          >
            {player2.avatar || '💙'}
          </div>
        )}
      </div>
    </div>
  );
};
