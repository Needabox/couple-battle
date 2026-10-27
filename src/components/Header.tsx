'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Users, Check, Heart, RefreshCw } from 'lucide-react';
import { soundManager } from '@/lib/sounds';

interface HeaderProps {
  roomCode: string;
  isConnected: boolean;
  isSingleDevice: boolean;
  partnerName: string;
  myPlayerName: string;
  onOpenLobby: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  isConnected,
  isSingleDevice,
  partnerName,
  myPlayerName,
  onOpenLobby,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.isMuted());
  }, []);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/?room=${roomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  return (
    <header className="w-full max-w-lg sm:max-w-4xl mx-auto pt-2 pb-1.5 px-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-1.5 z-20">
      {/* Brand Title Pill */}
      <div className="flex items-center gap-1.5">
        <div className="px-3 sm:px-4 py-1 bg-[#8C6D62] text-[#FFF9F2] rounded-full toy-shadow-sm font-fun text-xs sm:text-base tracking-wide flex items-center gap-1.5 border border-[#6D534A]">
          <Heart className="w-3.5 h-3.5 fill-pink-300 text-pink-300 animate-pulse" />
          <span>Couple Battle!</span>
          <span className="text-[9px] sm:text-xs bg-[#5E443B] text-amber-200 px-1.5 py-0.2 rounded-full font-sans font-bold">
            LDR
          </span>
        </div>
      </div>

      {/* Status & Action Center */}
      <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-[11px] sm:text-sm">
        {/* Connection Status Pill */}
        {isSingleDevice ? (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-semibold toy-shadow-sm text-[10px] sm:text-xs">
            <Users className="w-3 h-3 text-amber-700" />
            <span>Mode 1 HP</span>
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-semibold toy-shadow-sm text-[10px] sm:text-xs animate-pulse-glow">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="truncate max-w-[110px] sm:max-w-none">{partnerName || 'Pasangan'} ❤️</span>
          </div>
        ) : (
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-full font-semibold toy-shadow-sm hover:bg-yellow-200 transition-all cursor-pointer text-[10px] sm:text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span>Room: {roomCode}</span>
            {copied ? (
              <span className="text-emerald-700 font-bold ml-0.5">Disalin!</span>
            ) : (
              <Share2 className="w-3 h-3 text-yellow-700 ml-0.5" />
            )}
          </button>
        )}

        {/* Buttons: Lobby, Rematch, Sound */}
        <div className="flex items-center gap-1">
          {!isSingleDevice && (
            <button
              onClick={handleCopyLink}
              title="Salin Link Room"
              className="p-1 sm:px-2.5 sm:py-1 bg-white text-gray-700 hover:text-pink-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-pink-50 transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
            </button>
          )}

          <button
            onClick={toggleSound}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-1 sm:px-2 sm:py-1 bg-white text-gray-700 hover:text-amber-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-amber-50 transition-all flex items-center text-xs font-bold cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
          </button>

          <button
            onClick={onRestart}
            title="Reset Papan Game"
            className="p-1 sm:px-2 sm:py-1 bg-white text-gray-700 hover:text-purple-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-purple-50 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onOpenLobby}
            title="Ganti Room / Mode"
            className="px-2 sm:px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300 rounded-full toy-shadow-sm transition-all font-bold text-[10px] sm:text-xs flex items-center gap-1 cursor-pointer"
          >
            <Users className="w-3 h-3" />
            <span>Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};
