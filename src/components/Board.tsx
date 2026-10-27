'use client';

import React from 'react';
import { BOARD_TILES } from '@/data/tiles';
import { Tile } from './Tile';
import { CenterStage } from './CenterStage';
import { BoardTile, Player, PlayerId } from '@/types/game';

interface BoardProps {
  player1: Player;
  player2: Player;
  currentTurn: PlayerId;
  myPlayerId: PlayerId;
  isSingleDevice: boolean;
  isRolling: boolean;
  diceValue: number | null;
  onRollDice: () => void;
  onTileClick: (tile: BoardTile) => void;
  onSendReaction: (emoji: string) => void;
  onOpenChancePreview: () => void;
}

export const Board: React.FC<BoardProps> = ({
  player1,
  player2,
  currentTurn,
  myPlayerId,
  isSingleDevice,
  isRolling,
  diceValue,
  onRollDice,
  onTileClick,
  onSendReaction,
  onOpenChancePreview,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-4 select-none">
      {/* 6x6 Board Grid Loop */}
      <div 
        className="w-full aspect-square max-h-[82vh] grid grid-cols-6 grid-rows-6 gap-1 sm:gap-2 p-1.5 sm:p-3 rounded-3xl sm:rounded-4xl bg-[#FFF9E6] border-3 sm:border-4 border-[#2D2A26] toy-shadow-lg relative overflow-hidden"
      >
        {/* Render Perimeter Tiles */}
        {BOARD_TILES.map((tile) => {
          const isP1Here = player1.position === tile.id;
          const isP2Here = player2.position === tile.id;

          return (
            <Tile
              key={tile.id}
              tile={tile}
              player1={player1}
              player2={player2}
              isP1Here={isP1Here}
              isP2Here={isP2Here}
              onTileClick={onTileClick}
            />
          );
        })}

        {/* Center Stage (rows 2..5, cols 2..5) */}
        <CenterStage
          currentTurn={currentTurn}
          myPlayerId={myPlayerId}
          isSingleDevice={isSingleDevice}
          isRolling={isRolling}
          diceValue={diceValue}
          player1={player1}
          player2={player2}
          onRollDice={onRollDice}
          onSendReaction={onSendReaction}
          onOpenChancePreview={onOpenChancePreview}
        />
      </div>
    </div>
  );
};
