'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Share2, Users, Check, Heart, Sparkles, RefreshCw } from 'lucide-react';
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

  React.useEffect(() => {
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
    <header className="w-full max-w-4xl mx-auto pt-3 pb-2 px-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20">
      {/* Brand Title Pill */}
      <div className="flex items-center gap-2">
        <div className="px-4 py-1.5 bg-[#8C6D62] text-[#FFF9F2] rounded-full toy-shadow-sm font-fun text-base sm:text-lg tracking-wide flex items-center gap-2 border border-[#6D534A]">
          <Heart className="w-4 h-4 fill-pink-300 text-pink-300 animate-pulse" />
          <span>Couple Battle!</span>
          <span className="text-xs bg-[#5E443B] text-amber-200 px-2 py-0.5 rounded-full font-sans font-bold">
            LDR
          </span>
        </div>
      </div>

      {/* Status & Action Center */}
      <div className="flex items-center flex-wrap justify-center gap-2 text-xs sm:text-sm">
        {/* Connection Status Pill */}
        {isSingleDevice ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-semibold toy-shadow-sm">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Mode 1 HP (Offline)</span>
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-semibold toy-shadow-sm animate-pulse-glow">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>Terhubung: {partnerName || 'Pasangan'} ❤️</span>
          </div>
        ) : (
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-full font-semibold toy-shadow-sm hover:bg-yellow-200 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>Menunggu Pasangan ({roomCode})</span>
            {copied ? (
              <span className="flex items-center text-emerald-700 ml-1 font-bold">
                <Check className="w-3.5 h-3.5 mr-0.5" /> Disalin!
              </span>
            ) : (
              <Share2 className="w-3.5 h-3.5 ml-1 text-yellow-700" />
            )}
          </button>
        )}

        {/* Buttons: Lobby, Rematch, Sound */}
        <div className="flex items-center gap-1.5">
          {!isSingleDevice && (
            <button
              onClick={handleCopyLink}
              title="Salin Link Room"
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white text-gray-700 hover:text-pink-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-pink-50 transition-all flex items-center gap-1 text-xs font-bold"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
            </button>
          )}

          <button
            onClick={toggleSound}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white text-gray-700 hover:text-amber-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-amber-50 transition-all flex items-center gap-1 text-xs font-bold"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={onRestart}
            title="Reset Papan Game"
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white text-gray-700 hover:text-purple-600 border border-stone-300 rounded-full toy-shadow-sm hover:bg-purple-50 transition-all flex items-center gap-1 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onOpenLobby}
            title="Ganti Room / Mode"
            className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300 rounded-full toy-shadow-sm transition-all font-bold text-xs flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};
