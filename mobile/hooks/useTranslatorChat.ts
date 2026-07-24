import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { getSocket } from '../services/socket';
import { translateText } from '../services/chatbot';
import { getConversationMessagesRequest } from '../services/api/conversations';

export interface TranslatorMessage {
  id: string;
  senderId: number;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  translatedLanguage: string;
  createdAt: string;
  isMine: boolean;
}

export function useTranslatorChat(code: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TranslatorMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [myLanguage, setMyLanguage] = useState<string | null>(null);
  const [otherLanguage, setOtherLanguage] = useState<string | null>(null);
  const [peerConnected, setPeerConnected] = useState(false);
  const [sending, setSending] = useState(false);

  // ✅ Garde trace des messages reçus en direct AVANT que l'historique REST soit chargé,
  // pour ne jamais les perdre lors de la fusion.
  const liveMessagesBeforeLoadRef = useRef<TranslatorMessage[]>([]);
  const historyLoadedRef = useRef(false);

  useEffect(() => {
    historyLoadedRef.current = false;
    liveMessagesBeforeLoadRef.current = [];

    (async () => {
      try {
        const res = await getConversationMessagesRequest(code);
        setConversationId(res.conversationId);
        const loaded: TranslatorMessage[] = res.messages.map((m: any) => ({
          id: m.id.toString(),
          senderId: m.sender_id,
          originalText: m.original_text,
          originalLanguage: m.original_language,
          translatedText: m.translated_text,
          translatedLanguage: m.translated_language,
          createdAt: m.created_at,
          isMine: m.sender_id === user?.id,
        }));

        // ✅ Fusionne l'historique avec les messages arrivés en direct entre-temps,
        // en évitant les doublons (un message reçu par socket peut aussi apparaître
        // dans l'historique s'il a eu le temps d'être sauvegardé avant que le GET réponde).
        const liveOnly = liveMessagesBeforeLoadRef.current.filter(
          live => !loaded.some(
            l => l.senderId === live.senderId && l.originalText === live.originalText && l.createdAt === live.createdAt
          )
        );

        setMessages([...loaded, ...liveOnly]);
        if (loaded.length > 0 || liveOnly.length > 0) setPeerConnected(true);
        historyLoadedRef.current = true;
      } catch {
        // Si le chargement échoue, on garde quand meme les messages deja reçus en direct
        historyLoadedRef.current = true;
        if (liveMessagesBeforeLoadRef.current.length > 0) {
          setMessages(liveMessagesBeforeLoadRef.current);
        }
      }
    })();
  }, [code]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    const socket = getSocket();
    socket.emit('join_room', { code, userId });

    function handleRoomInfo(info: any) {
      setConversationId(info.conversationId);
      setMyLanguage(info.myLanguage);
      setOtherLanguage(info.otherLanguage);
      if (info.otherLanguage) setPeerConnected(true);
    }
    function handlePeerJoined(info: any) {
      setOtherLanguage(info.language);
      setPeerConnected(true);
    }
    function handlePeerLeft() { setPeerConnected(false); }
    function handleNewMessage(payload: any) {
      const newMessage: TranslatorMessage = {
        id: Date.now().toString() + Math.random(),
        senderId: payload.senderId,
        originalText: payload.originalText,
        originalLanguage: payload.originalLanguage,
        translatedText: payload.translatedText,
        translatedLanguage: payload.translatedLanguage,
        createdAt: payload.createdAt,
        isMine: payload.senderId === userId,
      };

      if (!historyLoadedRef.current) {
        // ✅ L'historique n'est pas encore chargé : on stocke le message a part
        // pour qu'il soit fusionné plus tard, au lieu de risquer un écrasement.
        liveMessagesBeforeLoadRef.current.push(newMessage);
      }

      setMessages(prev => [...prev, newMessage]);
    }

    socket.on('room_info', handleRoomInfo);
    socket.on('peer_joined', handlePeerJoined);
    socket.on('peer_left', handlePeerLeft);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('room_info', handleRoomInfo);
      socket.off('peer_joined', handlePeerJoined);
      socket.off('peer_left', handlePeerLeft);
      socket.off('new_message', handleNewMessage);
    };
  }, [code, user]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !myLanguage || !otherLanguage || !conversationId || sending) return; // ✅ garde anti double-envoi
    setSending(true);
    try {
      const translated = await translateText(text, myLanguage, otherLanguage);
      const socket = getSocket();
      socket.emit('send_message', {
        code,
        conversationId,
        senderId: user.id,
        originalText: text,
        originalLanguage: myLanguage,
        translatedText: translated,
        translatedLanguage: otherLanguage,
      });
    } finally {
      setSending(false);
    }
  }, [code, conversationId, myLanguage, otherLanguage, user, sending]);

  return { messages, myLanguage, otherLanguage, peerConnected, sending, sendMessage };
}