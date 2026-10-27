import type { Peer, DataConnection } from 'peerjs';
import { PeerMessage } from '@/types/game';

export interface PeerManagerEvents {
  onOpen: (peerId: string) => void;
  onConnected: (conn: DataConnection) => void;
  onData: (message: PeerMessage) => void;
  onDisconnected: () => void;
  onError: (error: any) => void;
  onRoomCodeChanged?: (newCode: string) => void;
}

export class PeerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private events: PeerManagerEvents;
  private isHost: boolean = false;
  private pingInterval: any = null;

  constructor(events: PeerManagerEvents) {
    this.events = events;
  }

  // Generates a random room ID e.g. "K9X2P4"
  public static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public static getHostPeerId(roomCode: string): string {
    return `couplebattle-${roomCode.trim().toUpperCase()}`;
  }

  public async initHost(roomCode: string, retryCount = 0) {
    if (typeof window === 'undefined') return;
    this.cleanup();
    this.isHost = true;

    const { default: Peer } = await import('peerjs');
    const hostPeerId = PeerManager.getHostPeerId(roomCode);

    this.peer = new Peer(hostPeerId, {
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
    });

    this.peer.on('open', (id) => {
      this.events.onOpen(id);
    });

    this.peer.on('connection', (conn) => {
      this.setupConnection(conn);
    });

    this.peer.on('error', (err: any) => {
      console.warn('PeerJS Host error:', err);
      // If the ID is already taken (e.g. from a previous tab or collision), auto-generate a new one!
      if (err?.type === 'unavailable-id' && retryCount < 5) {
        const newCode = PeerManager.generateRoomCode();
        console.log(`Room ID "${roomCode}" was taken. Retrying with fresh code: "${newCode}"...`);
        this.events.onRoomCodeChanged?.(newCode);
        setTimeout(() => {
          this.initHost(newCode, retryCount + 1);
        }, 400);
        return;
      }
      this.events.onError(err);
    });

    this.peer.on('disconnected', () => {
      this.peer?.reconnect();
    });
  }

  public async initGuest(roomCode: string) {
    if (typeof window === 'undefined') return;
    this.cleanup();
    this.isHost = false;

    const { default: Peer } = await import('peerjs');
    const hostPeerId = PeerManager.getHostPeerId(roomCode);

    this.peer = new Peer({
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
    });

    this.peer.on('open', (myId) => {
      this.events.onOpen(myId);
      // Connect to host
      if (!this.peer) return;
      const conn = this.peer.connect(hostPeerId, {
        reliable: true,
      });
      this.setupConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.warn('PeerJS Guest error:', err);
      this.events.onError(err);
    });
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn;

    conn.on('open', () => {
      this.startHeartbeat();
      this.events.onConnected(conn);
    });

    conn.on('data', (data: any) => {
      try {
        const msg: PeerMessage = typeof data === 'string' ? JSON.parse(data) : data;
        if (msg.type === 'PING') {
          this.sendMessage({ type: 'PONG', timestamp: Date.now() });
          return;
        }
        if (msg.type === 'PONG') {
          return;
        }
        this.events.onData(msg);
      } catch (e) {
        console.error('Failed to parse peer message:', e);
      }
    });

    conn.on('close', () => {
      this.stopHeartbeat();
      this.events.onDisconnected();
    });

    conn.on('error', (err) => {
      console.warn('Connection error:', err);
      this.events.onError(err);
    });
  }

  public sendMessage(message: PeerMessage) {
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(message);
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.connection && this.connection.open) {
        this.sendMessage({ type: 'PING', timestamp: Date.now() });
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public isConnected(): boolean {
    return !!(this.connection && this.connection.open);
  }

  public cleanup() {
    this.stopHeartbeat();
    if (this.connection) {
      try {
        this.connection.close();
      } catch {}
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}
