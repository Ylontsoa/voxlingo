import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useChatBot } from '../../hooks/useChatBot';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getIsoCode } from '../../constants/languages';

export default function ChatBotScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true); // ✅ lecture vocale auto (activée par défaut)
  const flatListRef = useRef<FlatList>(null);
  const lastSpokenIndex = useRef(-1); // ✅ évite de relire un message déjà lu
  const language = user?.target_language || 'anglais';
  const { messages, loading, sendMessage, reset, translate, correct, check, practice } = useChatBot(language);

  // ✅ Synthèse vocale (IA parle)
  const { speak, isSpeaking } = useSpeechSynthesis();

  // ✅ Reconnaissance vocale (tu parles)
  const { record, isRecording, transcription, reset: resetVoice } = useSpeechRecognition(getIsoCode(language));

  // Quand la reconnaissance vocale a fini
  React.useEffect(() => {
    if (transcription && !isRecording) {
      sendMessage(transcription);
      resetVoice();
    }
  }, [transcription, isRecording]);

  // ✅ Lecture vocale automatique : reponse du chat (ai) + phrase de pratique (practice)
  React.useEffect(() => {
    if (messages.length === 0 || !autoSpeak) return;
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];
    if (lastIndex === lastSpokenIndex.current) return;

    if (last.role === 'ai') {
      lastSpokenIndex.current = lastIndex;
      speak(last.text, language);
    } else if (last.role === 'practice') {
      lastSpokenIndex.current = lastIndex;
      // last.text contient "🎤 " + la phrase, on retire l'emoji avant de la faire lire
      speak(last.text.replace('🎤 ', ''), language);
    }
  }, [messages, autoSpeak]);

  function handleSend() {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }

  function handleSpeak(text: string) {
    speak(text, language);
  }

  function handleVoiceInput() {
    if (isRecording) return;
    record();
  }

  function handleTranslate() {
    const lastMsg = [...messages].reverse().find(m => m.role === 'ai' || m.role === 'user');
    if (lastMsg) translate(lastMsg.text);
  }

  function handleCorrect() {
    if (input.trim()) {
      correct(input.trim());
      setInput('');
    }
  }

  function handleCheck() {
    if (input.trim()) {
      check(input.trim());
      setInput('');
    }
  }

  function handleReset() {
    lastSpokenIndex.current = -1; // ✅ réinitialise le suivi de lecture vocale
    reset();
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>💬 Conversation</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={() => setAutoSpeak(v => !v)}>
            <FontAwesome name={autoSpeak ? 'volume-up' : 'volume-off'} size={18} color={autoSpeak ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow} contentContainerStyle={styles.actionsContent}>
        <TouchableOpacity onPress={() => practice()} style={[styles.actionBtn, { backgroundColor: theme.primaryLight }]}>
          <Text style={{ fontSize: 16 }}>🎤</Text>
          <Text style={[styles.actionText, { color: theme.primary }]}>Pratique</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTranslate} style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}>
          <Text style={{ fontSize: 16 }}>🇫🇷</Text>
          <Text style={[styles.actionText, { color: '#92400E' }]}>Traduire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCorrect} style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}>
          <Text style={{ fontSize: 16 }}>🔧</Text>
          <Text style={[styles.actionText, { color: '#1E40AF' }]}>Corriger</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCheck} style={[styles.actionBtn, { backgroundColor: '#F0FDF4' }]}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={[styles.actionText, { color: '#166534' }]}>Vérifier</Text>
        </TouchableOpacity>
      </ScrollView>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 50 }}>🤖</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Commence une conversation en {language} !
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            🎤 Pratique - phrase a prononcer{'\n'}
            🇫🇷 Traduire - traduit le dernier message{'\n'}
            🔧 Corriger - corrige l'orthographe{'\n'}
            🔍 Verifier - trouve les erreurs{'\n'}
            🎙️ Micro - parle au lieu d'ecrire{'\n'}
            🔊 Son - lecture automatique (icone en haut pour desactiver)
          </Text>
        </View>
      ) : (
        <FlatList ref={flatListRef} data={messages} keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View>
              {item.role === 'user' && (
                <View style={[styles.bubble, styles.userBubble, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.bubbleText, { color: '#fff' }]}>{item.text}</Text>
                </View>
              )}
              {item.role === 'ai' && (
                <View>
                  <View style={[styles.bubble, styles.aiBubble, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.bubbleText, { color: theme.text }]}>{item.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleSpeak(item.text)} style={styles.listenBtn}>
                    <FontAwesome name={isSpeaking ? 'volume-up' : 'volume-up'} size={14} color={theme.primary} />
                    <Text style={[styles.listenText, { color: theme.primary }]}>Ecouter</Text>
                  </TouchableOpacity>
                </View>
              )}
              {['translation', 'correction', 'practice', 'check'].includes(item.role) && (
                <View style={[styles.specialBubble, {
                  backgroundColor: item.role === 'practice' ? '#EEF0FF' :
                                   item.role === 'translation' ? '#FFFBEB' :
                                   item.role === 'check' ? '#F0FDF4' : '#EFF6FF'
                }]}>
                  <Text style={styles.specialTitle}>{item.text}</Text>
                  <Text style={styles.specialExtra}>{item.extra}</Text>
                  {item.role === 'practice' && (
                    <TouchableOpacity onPress={() => handleSpeak(item.text.replace('🎤 ', ''))} style={styles.listenBtn}>
                      <FontAwesome name="volume-up" size={14} color={theme.primary} />
                      <Text style={[styles.listenText, { color: theme.primary }]}>Ecouter</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity onPress={handleVoiceInput} disabled={isRecording || loading}
            style={[styles.micBtn, { backgroundColor: isRecording ? '#EF4444' : theme.primaryLight }]}>
            <FontAwesome name={isRecording ? 'stop' : 'microphone'} size={18} color={isRecording ? '#fff' : theme.primary} />
          </TouchableOpacity>

          <TextInput value={input} onChangeText={setInput} placeholder={isRecording ? 'Ecoute...' : `Ecris en ${language}...`}
            placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]}
            multiline maxLength={300} returnKeyType="send" onSubmitEditing={handleSend} editable={!isRecording} />
          <TouchableOpacity onPress={handleSend} disabled={loading || !input.trim()}
            style={[styles.sendBtn, { backgroundColor: loading || !input.trim() ? theme.border : theme.primary }]}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <FontAwesome name="send" size={16} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  actionsRow: { maxHeight: 50, marginBottom: 4 },
  actionsContent: { paddingHorizontal: 20, gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  actionText: { fontSize: 12, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  emptySubtext: { fontSize: 13, marginTop: 12, textAlign: 'center', lineHeight: 20 },
  list: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 16, marginBottom: 4 },
  listenText: { fontSize: 12, fontWeight: '600' },
  specialBubble: { alignSelf: 'center', maxWidth: '90%', padding: 12, borderRadius: 12, marginVertical: 4 },
  specialTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  specialExtra: { fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, marginHorizontal: 12, marginBottom: 8, borderRadius: 20 },
  micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 15, maxHeight: 80, paddingHorizontal: 4 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});