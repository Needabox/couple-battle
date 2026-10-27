'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Board } from '@/components/Board';
import { LobbyModal } from '@/components/LobbyModal';
import { ChallengeModal } from '@/components/ChallengeModal';
import { FloatingReactions, ReactionItem } from '@/components/FloatingReactions';
import { ChatDrawer, ChatMessage } from '@/components/ChatDrawer';
import { PeerManager } from '@/lib/peer';
import { soundManager } from '@/lib/sounds';
import { BOARD_TILES } from '@/data/tiles';
import { CHANCE_CARDS } from '@/data/chanceCards';
import { 
  PlayerId, PlayerRole, Player, BoardTile, ChanceCard, PeerMessage 
} from '@/types/game';
import { MessageSquare } from 'lucide-react';

export default function CoupleBattleGame() {
  const searchParams = useSearchParams();
  const urlRoom = searchParams.get('room');

  const [mounted, setMounted] = useState<boolean>(false);

  // Peer & Room State
  const [roomCode, setRoomCode] = useState<string>('');
  const [myRole, setMyRole] = useState<PlayerRole>('host');
  const [myPlayerId, setMyPlayerId] = useState<PlayerId>(1);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSingleDevice, setIsSingleDevice] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string>('');

  // UI Modals & Drawers
  const [isLobbyOpen, setIsLobbyOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<ReactionItem[]>([]);

  // Game Board State
  const [turn, setTurn] = useState<PlayerId>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);

  const [players, setPlayers] = useState<{ 1: Player; 2: Player }>({
    1: {
      id: 1,
      name: 'Ayang 1',
      avatar: '🐱',
      color: '#EC4899',
      position: 0,
      score: 0,
    },
    2: {
      id: 2,
      name: 'Ayang 2',
      avatar: '🐰',
      color: '#0EA5E9',
      position: 0,
      score: 0,
    },
  });

  // Challenge Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isChance: boolean;
    tile?: BoardTile;
    chanceCard?: ChanceCard;
  }>({
    isOpen: false,
    isChance: false,
  });

  const peerManagerRef = useRef<PeerManager | null>(null);

  // Handle Incoming Peer Messages
  const handlePeerData = useCallback((msg: PeerMessage) => {
    switch (msg.type) {
      case 'SYNC_STATE': {
        const { stateTurn, statePlayers } = msg.payload;
        if (stateTurn) setTurn(stateTurn);
        if (statePlayers) {
          setPlayers((prev) => ({
            1: { ...prev[1], ...statePlayers[1] },
            2: { ...prev[2], ...statePlayers[2] },
          }));
          if (myPlayerId === 2 && statePlayers[1]) {
            setPartnerName(statePlayers[1].name);
          } else if (myPlayerId === 1 && statePlayers[2]) {
            setPartnerName(statePlayers[2].name);
          }
        }
        break;
      }

      case 'UPDATE_PROFILE': {
        const { id, name, avatar } = msg.payload;
        setPlayers((prev) => ({
          ...prev,
          [id]: {
            ...prev[id as PlayerId],
            name: name || prev[id as PlayerId].name,
            avatar: avatar || prev[id as PlayerId].avatar,
          },
        }));
        setPartnerName(name);
        break;
      }

      case 'ROLL_DICE': {
        const { val, player } = msg.payload;
        setTurn(player);
        executeDiceRoll(val, player, false);
        break;
      }

      case 'SHOW_CHALLENGE': {
        const { tileId, isChance, chanceCardId } = msg.payload;
        const targetTile = BOARD_TILES.find((t) => t.id === tileId);
        const card = chanceCardId ? CHANCE_CARDS.find((c) => c.id === chanceCardId) : undefined;
        setModalState({
          isOpen: true,
          isChance: !!isChance,
          tile: targetTile,
          chanceCard: card,
        });
        if (isChance) {
          soundManager.playChanceCard();
        }
        break;
      }

      case 'COMPLETE_CHALLENGE': {
        const { nextTurn, updatedScores } = msg.payload;
        if (updatedScores) {
          setPlayers((prev) => ({
            1: { ...prev[1], score: updatedScores[1] },
            2: { ...prev[2], score: updatedScores[2] },
          }));
        }
        setTurn(nextTurn);
        setModalState({ isOpen: false, isChance: false });
        soundManager.playSuccess();
        break;
      }

      case 'SEND_REACTION': {
        const { emoji, senderName } = msg.payload;
        triggerFloatingReaction(emoji, senderName);
        break;
      }

      case 'SEND_CHAT': {
        const newMsg: ChatMessage = msg.payload;
        setChatMessages((prev) => [...prev, newMsg]);
        soundManager.playHeartPop();
        setUnreadChatCount((prev) => prev + 1);
        break;
      }

      case 'RESTART_GAME': {
        setPlayers((prev) => ({
          1: { ...prev[1], position: 0 },
          2: { ...prev[2], position: 0 },
        }));
        setTurn(1);
        setModalState({ isOpen: false, isChance: false });
        soundManager.playSuccess();
        break;
      }
    }
  }, [myPlayerId]);

  // Connect to Host as Guest
  const connectAsGuest = useCallback((targetCode: string) => {
    setIsConnecting(true);
    setRoomCode(targetCode);
    setMyRole('guest');
    setMyPlayerId(2);
    setIsSingleDevice(false);

    if (peerManagerRef.current) {
      peerManagerRef.current.cleanup();
    }

    const pm = new PeerManager({
      onOpen: (id) => {
        console.log('Guest peer opened:', id);
      },
      onConnected: (conn) => {
        setIsConnecting(false);
        setIsConnected(true);
        soundManager.playSuccess();
        confetti({ particleCount: 50, spread: 60 });

        setTimeout(() => {
          pm.sendMessage({
            type: 'UPDATE_PROFILE',
            payload: {
              id: 2,
              name: players[2].name,
              avatar: players[2].avatar,
            },
            timestamp: Date.now(),
          });
        }, 500);
      },
      onData: (data) => handlePeerData(data),
      onDisconnected: () => {
        setIsConnected(false);
      },
      onError: (err) => {
        console.warn('Guest connection error:', err);
        setIsConnecting(false);
      },
    });

    peerManagerRef.current = pm;
    pm.initGuest(targetCode);
  }, [handlePeerData, players]);

  // Create Room as Host
  const createRoomAsHost = useCallback((customCode?: string) => {
    const code = (customCode || PeerManager.generateRoomCode()).toUpperCase();
    setRoomCode(code);
    setMyRole('host');
    setMyPlayerId(1);
    setIsSingleDevice(false);
    setIsConnecting(true);

    if (peerManagerRef.current) {
      peerManagerRef.current.cleanup();
    }

    const pm = new PeerManager({
      onOpen: (id) => {
        setIsConnecting(false);
        console.log('Host room open with ID:', id);
      },
      onRoomCodeChanged: (newCode) => {
        setRoomCode(newCode);
      },
      onConnected: (conn) => {
        setIsConnected(true);
        soundManager.playSuccess();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

        setTimeout(() => {
          pm.sendMessage({
            type: 'SYNC_STATE',
            payload: {
              stateTurn: turn,
              statePlayers: players,
            },
            timestamp: Date.now(),
          });
        }, 300);
      },
      onData: (data) => handlePeerData(data),
      onDisconnected: () => {
        setIsConnected(false);
      },
      onError: (err) => {
        console.warn('Host room error:', err);
        setIsConnecting(false);
        if (err?.type === 'unavailable-id') {
          const freshCode = PeerManager.generateRoomCode();
          setRoomCode(freshCode);
          setTimeout(() => {
            createRoomAsHost(freshCode);
          }, 300);
        }
      },
    });

    peerManagerRef.current = pm;
    pm.initHost(code);
  }, [handlePeerData, turn, players]);

  // Mount effect: Only runs in client browser
  useEffect(() => {
    setMounted(true);
    soundManager.init();

    const savedName = localStorage.getItem('cb_player_name');
    const savedAvatar = localStorage.getItem('cb_player_avatar');
    if (savedName || savedAvatar) {
      setPlayers((prev) => ({
        ...prev,
        [myPlayerId]: {
          ...prev[myPlayerId],
          name: savedName || prev[myPlayerId].name,
          avatar: savedAvatar || prev[myPlayerId].avatar,
        },
      }));
    }

    if (urlRoom && urlRoom.trim().length >= 3) {
      const clean = urlRoom.trim().toUpperCase();
      setRoomCode(clean);
      connectAsGuest(clean);
    } else {
      const initialCode = PeerManager.generateRoomCode();
      setRoomCode(initialCode);
      createRoomAsHost(initialCode);
      setIsLobbyOpen(true);
    }

    return () => {
      peerManagerRef.current?.cleanup();
    };
  }, []); // Run once on mount

  // Floating emoji reaction
  const triggerFloatingReaction = (emoji: string, senderName: string) => {
    soundManager.playHeartPop();
    const newReaction: ReactionItem = {
      id: Math.random().toString(),
      emoji,
      senderName,
      x: 15 + Math.random() * 70,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 3000);
  };

  const handleSendReaction = (emoji: string) => {
    const sender = players[myPlayerId].name;
    triggerFloatingReaction(emoji, sender);

    if (!isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'SEND_REACTION',
        payload: { emoji, senderName: sender },
        timestamp: Date.now(),
      });
    }
  };

  // Chat Sending
  const handleSendMessage = (text: string) => {
    const sender = players[myPlayerId].name;
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender,
      senderId: myPlayerId,
      text,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    if (!isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'SEND_CHAT',
        payload: newMsg,
        timestamp: Date.now(),
      });
    }
  };

  // Step-by-Step Pawn Animation
  const animatePawnMovement = (
    player: PlayerId,
    startPos: number,
    steps: number,
    onComplete: (finalPos: number) => void
  ) => {
    let currentStep = 0;
    let currPos = startPos;

    const interval = setInterval(() => {
      currentStep++;
      currPos = (currPos + 1) % BOARD_TILES.length;

      if (currPos === 0) {
        soundManager.playHeartPop();
        confetti({ particleCount: 30, spread: 50 });
      }

      setPlayers((prev) => ({
        ...prev,
        [player]: {
          ...prev[player],
          position: currPos,
        },
      }));

      soundManager.playPawnStep(currentStep);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(currPos);
        }, 350);
      }
    }, 280);
  };

  // Execute Dice Roll
  const executeDiceRoll = (val: number, player: PlayerId, isInitiator: boolean) => {
    setIsRolling(true);
    setDiceValue(null);
    soundManager.playDiceRoll();

    if (isInitiator && !isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'ROLL_DICE',
        payload: { val, player },
        timestamp: Date.now(),
      });
    }

    setTimeout(() => {
      setDiceValue(val);
      setIsRolling(false);

      const startPos = players[player].position;
      animatePawnMovement(player, startPos, val, (finalPos) => {
        handleTileLanded(finalPos, player, isInitiator);
      });
    }, 900);
  };

  // When pawn lands on tile
  const handleTileLanded = (tileIndex: number, player: PlayerId, isInitiator: boolean) => {
    const tile = BOARD_TILES[tileIndex];

    if (tile.type === 'chance') {
      const randomIdx = Math.floor(Math.random() * CHANCE_CARDS.length);
      const card = CHANCE_CARDS[randomIdx];

      setModalState({
        isOpen: true,
        isChance: true,
        tile,
        chanceCard: card,
      });
      soundManager.playChanceCard();

      if (isInitiator && !isSingleDevice && peerManagerRef.current?.isConnected()) {
        peerManagerRef.current.sendMessage({
          type: 'SHOW_CHALLENGE',
          payload: {
            tileId: tile.id,
            isChance: true,
            chanceCardId: card.id,
          },
          timestamp: Date.now(),
        });
      }
    } else {
      setModalState({
        isOpen: true,
        isChance: false,
        tile,
      });

      if (isInitiator && !isSingleDevice && peerManagerRef.current?.isConnected()) {
        peerManagerRef.current.sendMessage({
          type: 'SHOW_CHALLENGE',
          payload: {
            tileId: tile.id,
            isChance: false,
          },
          timestamp: Date.now(),
        });
      }
    }
  };

  // User Clicks Dice Button
  const handleRollDiceClick = () => {
    if (isRolling) return;
    const randomDice = Math.floor(Math.random() * 6) + 1;
    executeDiceRoll(randomDice, turn, true);
  };

  // Challenge Completed
  const handleCompleteChallenge = () => {
    const currentTile = modalState.tile;
    let nextTurn: PlayerId = turn === 1 ? 2 : 1;

    if (currentTile?.type === 'roll_again') {
      nextTurn = turn;
    }

    const updatedScores = {
      1: turn === 1 ? players[1].score + 1 : players[1].score,
      2: turn === 2 ? players[2].score + 1 : players[2].score,
    };

    setPlayers((prev) => ({
      1: { ...prev[1], score: updatedScores[1] },
      2: { ...prev[2], score: updatedScores[2] },
    }));

    setTurn(nextTurn);
    setModalState({ isOpen: false, isChance: false });

    if (currentTile?.actionValue) {
      const shift = currentTile.actionValue;
      setTimeout(() => {
        const newPos = (players[turn].position + shift + BOARD_TILES.length) % BOARD_TILES.length;
        setPlayers((prev) => ({
          ...prev,
          [turn]: {
            ...prev[turn],
            position: newPos,
          },
        }));
        soundManager.playPawnStep(1);
      }, 400);
    }

    if (!isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'COMPLETE_CHALLENGE',
        payload: {
          nextTurn,
          updatedScores,
        },
        timestamp: Date.now(),
      });
    }
  };

  // Restart Board Game
  const handleRestartGame = () => {
    soundManager.playClick();
    setPlayers((prev) => ({
      1: { ...prev[1], position: 0 },
      2: { ...prev[2], position: 0 },
    }));
    setTurn(1);
    setDiceValue(null);
    setModalState({ isOpen: false, isChance: false });

    if (!isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'RESTART_GAME',
        timestamp: Date.now(),
      });
    }
  };

  // Update Profile Name & Avatar
  const handleUpdateProfile = (name: string, avatar: string) => {
    localStorage.setItem('cb_player_name', name);
    localStorage.setItem('cb_player_avatar', avatar);

    setPlayers((prev) => ({
      ...prev,
      [myPlayerId]: {
        ...prev[myPlayerId],
        name,
        avatar,
      },
    }));

    if (!isSingleDevice && peerManagerRef.current?.isConnected()) {
      peerManagerRef.current.sendMessage({
        type: 'UPDATE_PROFILE',
        payload: {
          id: myPlayerId,
          name,
          avatar,
        },
        timestamp: Date.now(),
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] flex flex-col items-center justify-center p-4">
        <div className="font-fun text-2xl text-pink-500 font-bold animate-pulse flex items-center gap-2">
          <span>Couple Battle!</span>
          <span>💖</span>
        </div>
        <p className="text-xs text-stone-500 mt-2 font-medium">
          Memuat papan monopoli cinta...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-doodle-stars flex flex-col justify-between selection:bg-pink-300 selection:text-pink-900 pb-4">
      {/* Top Navigation & Status Header */}
      <Header
        roomCode={roomCode}
        isConnected={isConnected}
        isSingleDevice={isSingleDevice}
        partnerName={partnerName}
        myPlayerName={players[myPlayerId].name}
        onOpenLobby={() => setIsLobbyOpen(true)}
        onRestart={handleRestartGame}
      />

      {/* Main Board Game View */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
        <Board
          player1={players[1]}
          player2={players[2]}
          currentTurn={turn}
          myPlayerId={myPlayerId}
          isSingleDevice={isSingleDevice}
          isRolling={isRolling}
          diceValue={diceValue}
          onRollDice={handleRollDiceClick}
          onTileClick={(tile) => {
            setModalState({
              isOpen: true,
              isChance: tile.type === 'chance',
              tile,
              chanceCard: tile.type === 'chance' ? CHANCE_CARDS[0] : undefined,
            });
            soundManager.playClick();
          }}
          onSendReaction={handleSendReaction}
          onOpenChancePreview={() => {
            const random = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
            setModalState({
              isOpen: true,
              isChance: true,
              chanceCard: random,
            });
            soundManager.playChanceCard();
          }}
        />
      </div>

      {/* Floating Bottom Bar: Quick Chat & Actions */}
      <div className="w-full max-w-md mx-auto px-4 flex items-center justify-between gap-2 z-20">
        <button
          type="button"
          onClick={() => {
            setIsChatOpen(true);
            setUnreadChatCount(0);
            soundManager.playClick();
          }}
          className="relative px-4 py-2 bg-white hover:bg-pink-50 text-stone-800 rounded-full border-2 border-stone-800 toy-shadow-sm flex items-center gap-2 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-pink-500" />
          <span>Chat Mesra</span>
          {unreadChatCount > 0 && (
            <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold animate-bounce">
              {unreadChatCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-stone-300 toy-shadow-sm text-xs font-fun font-bold text-stone-700">
          <span>{players[1].avatar} {players[1].name} ({players[1].score})</span>
          <span className="text-pink-400">vs</span>
          <span>{players[2].avatar} {players[2].name} ({players[2].score})</span>
        </div>
      </div>

      {/* Modals & Overlays */}
      <LobbyModal
        isOpen={isLobbyOpen}
        roomCode={roomCode}
        myRole={myRole}
        myPlayerName={players[myPlayerId].name}
        myAvatar={players[myPlayerId].avatar}
        isConnecting={isConnecting}
        isConnected={isConnected}
        isSingleDevice={isSingleDevice}
        onClose={() => setIsLobbyOpen(false)}
        onCreateRoom={(custom) => createRoomAsHost(custom)}
        onJoinRoom={(code) => connectAsGuest(code)}
        onStartSingleDevice={() => {
          setIsSingleDevice(true);
          setIsConnected(false);
        }}
        onUpdateProfile={handleUpdateProfile}
      />

      <ChallengeModal
        isOpen={modalState.isOpen}
        isChance={modalState.isChance}
        tile={modalState.tile}
        chanceCard={modalState.chanceCard}
        currentTurn={turn}
        myPlayerId={myPlayerId}
        isSingleDevice={isSingleDevice}
        player1={players[1]}
        player2={players[2]}
        onComplete={handleCompleteChallenge}
        onClose={() => setModalState({ isOpen: false, isChance: false })}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        messages={chatMessages}
        myPlayerId={myPlayerId}
        myPlayerName={players[myPlayerId].name}
        onClose={() => setIsChatOpen(false)}
        onSendMessage={handleSendMessage}
      />

      {/* Realtime Floating Reaction Hearts */}
      <FloatingReactions reactions={reactions} />
    </main>
  );
}
