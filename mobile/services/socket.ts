import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://voxlingo-backend.onrender.com'; // ✅ URL Render
//const SOCKET_URL = 'http://192.168.0.195:3000'; // URL locale

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}