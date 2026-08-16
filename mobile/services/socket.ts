import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.0.195:3000'; // ✅ Correction de l'IP

//const SOCKET_URL = 'https://voxlingo-twto.onrender.com';

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