// mobile/app/(app)/translator/[code].tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslatorChat } from '../../hooks/useTranslatorChat';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getIsoCode, LANGUAGES } from '../../constants/languages';
import { voiceService } from '../../services/voice.service'; // ✅ AJOUT

export default function TranslatorRoomScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [useElevenLabs, setUseElevenLabs] = useState(true); // ✅ AJOUT
  const lastSpokenId = useRef<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const { messages, myLanguage, otherLanguage, peerConnected, sending, sendMessage } = useTranslatorChat(code as string);
  const { speak } = useSpeechSynthesis();
  const { record, finishRecording, isRecording, transcription, reset: resetVoice } = useSpeechRecognition(getIsoCode(myLanguage || 'francais'), 15000);

  React.useEffect(() => {
    if (transcription && !isRecording) {
      sendMessage(transcription);
      resetVoice();
    }
  }, [transcription, isRecording]);

  // ✅ MODIFIÉ : Utiliser ElevenLabs pour la lecture automatique des messages reçus
  React.useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (!last.isMine && last.id !== lastSpokenId.current) {
      lastSpokenId.current = last.id;
      
      if (useElevenLabs) {
        // ✅ Utiliser ElevenLabs
        voiceService.speak(last.translatedText, {
          voice: 'alice',
          speed: 0.85,
          emotion: 'neutral',
        }).catch(() => {
          // Fallback vers la voix native
          speak(last.translatedText, last.translatedLanguage);
        });
      } else {
        speak(last.translatedText, last.translatedLanguage);
      }
    }
  }, [messages, useElevenLabs]);

  function handleSend() {
    if (!input.trim() || sending) return;
    sendMessage(input.trim());
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }

  function handleVoiceInput() {
    if (isRecording) finishRecording();
    else record();
  }

  const myFlag = LANGUAGES.find(l => l.code === myLanguage)?.flag || '🌐';
  const otherFlag = LANGUAGES.find(l => l.code === otherLanguage)?.flag || '🌐';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{myFlag} ↔ {otherFlag}</Text>
          <Text style={[styles.headerSubtitle, { color: peerConnected ? '#22C55E' : theme.textSecondary }]}>
            {peerConnected ? 'Connecte' : "En attente de l'autre personne..."}
          </Text>
        </View>
        {/* ✅ AJOUT : Toggle ElevenLabs */}
        <TouchableOpacity onPress={() => setUseElevenLabs(v => !v)} style={[styles.voiceToggle, { backgroundColor: theme.surface }]}>
          <FontAwesome 
            name={useElevenLabs ? 'magic' : 'volume-up'} 
            size={16} 
            color={useElevenLabs ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble, { backgroundColor: item.isMine ? theme.primary : theme.surface }]}>
            <Text style={[styles.bubbleText, { color: item.isMine ? '#fff' : theme.text }]}>
              {item.isMine ? item.originalText : item.translatedText}
            </Text>
            {!item.isMine && (
              <Text style={[styles.originalHint, { color: theme.textSecondary }]}>« {item.originalText} »</Text>
            )}
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity onPress={handleVoiceInput} style={[styles.micBtn, { backgroundColor: isRecording ? '#EF4444' : theme.primaryLight }]}>
            <FontAwesome name={isRecording ? 'stop' : 'microphone'} size={18} color={isRecording ? '#fff' : theme.primary} />
          </TouchableOpacity>
          <TextInput
            value={input} onChangeText={setInput}
            placeholder={`Ecris en ${myLanguage || '...'}`}
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            multiline maxLength={300} editable={!isRecording}
          />
          <TouchableOpacity onPress={handleSend} disabled={sending || !input.trim()}
            style={[styles.sendBtn, { backgroundColor: sending || !input.trim() ? theme.border : theme.primary }]}>
            {sending ? <ActivityIndicator size="small" color="#fff" /> : <FontAwesome name="send" size={16} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 8, 
    paddingBottom: 12 
  },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  voiceToggle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, // ✅ AJOUT
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  headerSubtitle: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  list: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  myBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  otherBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  originalHint: { fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, marginHorizontal: 12, marginBottom: 8, borderRadius: 20 },
  micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, maxHeight: 80, paddingHorizontal: 4 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});