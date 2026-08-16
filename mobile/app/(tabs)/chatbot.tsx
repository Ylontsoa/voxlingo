// mobile/app/(tabs)/chatbot.tsx
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
import { voiceService } from '../../services/voice.service';

export default function ChatBotScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const lastSpokenIndex = useRef(-1);
  const manuallySpokenIds = useRef<Set<string>>(new Set()); // ✅ AJOUT : pour éviter les répétitions
  
  const language = user?.target_language || 'anglais';
  const { messages, loading, pastSessions, sendMessage, reset, translate, correct, check, practice, loadSession } = useChatBot(language);

  const { speak, isSpeaking } = useSpeechSynthesis();
  const { record, finishRecording, isRecording, transcription, reset: resetVoice } = useSpeechRecognition(getIsoCode(language), 15000);

  React.useEffect(() => {
    if (transcription && !isRecording) {
      sendMessage(transcription);
      resetVoice();
    }
  }, [transcription, isRecording]);

  // ✅ MODIFIÉ : Lecture automatique avec vérification des doublons
  React.useEffect(() => {
    if (messages.length === 0 || !autoSpeak) return;
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];
    if (lastIndex === lastSpokenIndex.current) return;
    
    if (last.role === 'ai') {
      lastSpokenIndex.current = lastIndex;
      // ✅ Marquer comme déjà lu automatiquement
      manuallySpokenIds.current.add(last.id);
      
      if (useElevenLabs) {
        voiceService.speak(last.text, {
          voice: 'alice',
          speed: 0.85,
          emotion: 'neutral',
        }).catch(() => {
          speak(last.text, language);
        });
      } else {
        speak(last.text, language);
      }
    } else if (last.role === 'practice') {
      lastSpokenIndex.current = lastIndex;
      const practiceText = last.text.replace('🎤 ', '');
      // ✅ Marquer comme déjà lu automatiquement
      manuallySpokenIds.current.add(last.id);
      
      if (useElevenLabs) {
        voiceService.speak(practiceText, {
          voice: 'alice',
          speed: 0.85,
          emotion: 'neutral',
        }).catch(() => {
          speak(practiceText, language);
        });
      } else {
        speak(practiceText, language);
      }
    }
  }, [messages, autoSpeak, useElevenLabs]);

  function handleSend() {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }

  // ✅ MODIFIÉ : Lecture manuelle avec vérification des doublons
  function handleSpeak(text: string, messageId?: string) {
    // ✅ Si le message a déjà été lu automatiquement, on ne le relit pas
    if (messageId && manuallySpokenIds.current.has(messageId)) {
      console.log('[ChatBot] Message déjà lu automatiquement');
      return;
    }
    
    // ✅ Marquer comme lu manuellement
    if (messageId) {
      manuallySpokenIds.current.add(messageId);
    }
    
    if (useElevenLabs) {
      voiceService.speak(text, {
        voice: 'alice',
        speed: 0.85,
        emotion: 'neutral',
      }).catch(() => {
        speak(text, language);
      });
    } else {
      speak(text, language);
    }
  }

  function handleVoiceInput() {
    if (isRecording) {
      finishRecording();
    } else {
      record();
    }
  }

  function handleTranslate() {
    const lastMsg = [...messages].reverse().find(m => m.role === 'ai' || m.role === 'user');
    if (lastMsg) translate(lastMsg.text);
  }

  function handleCorrect() {
    if (input.trim()) { correct(input.trim()); setInput(''); }
  }

  function handleCheck() {
    if (input.trim()) { check(input.trim()); setInput(''); }
  }

  async function handleReset() {
    lastSpokenIndex.current = -1;
    manuallySpokenIds.current.clear(); // ✅ Nettoyer les IDs
    await reset();
  }

  function handleLoadSession(sessionId: number) {
    lastSpokenIndex.current = -1;
    manuallySpokenIds.current.clear(); // ✅ Nettoyer les IDs
    loadSession(sessionId);
    setShowHistory(false);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Conversation</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={() => setUseElevenLabs(v => !v)}>
            <FontAwesome 
              name={useElevenLabs ? 'magic' : 'volume-up'} 
              size={18} 
              color={useElevenLabs ? theme.primary : theme.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHistory(v => !v)}>
            <FontAwesome name="history" size={18} color={showHistory ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAutoSpeak(v => !v)}>
            <FontAwesome name={autoSpeak ? 'volume-up' : 'volume-off'} size={18} color={autoSpeak ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showHistory && (
        <View style={[styles.historyPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {pastSessions.length === 0 ? (
            <Text style={{ color: theme.textSecondary, fontSize: 13, padding: 12 }}>Aucune conversation sauvegardee.</Text>
          ) : (
            pastSessions.map(session => {
              let preview = '...';
              try {
                const parsed = JSON.parse(session.messages);
                preview = parsed[0]?.text || '...';
              } catch {}
              return (
                <TouchableOpacity key={session.id} onPress={() => handleLoadSession(session.id)} style={[styles.historyItem, { borderBottomColor: theme.border }]}>
                  <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>
                    {new Date(session.created_at).toLocaleDateString()} {new Date(session.created_at).toLocaleTimeString().slice(0, 5)}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }} numberOfLines={1}>{preview}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow} contentContainerStyle={styles.actionsContent}>
        <TouchableOpacity onPress={() => practice()} style={[styles.actionBtn, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.actionText, { color: theme.primary }]}>Pratique</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTranslate} style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.actionText, { color: '#92400E' }]}>Traduire</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCorrect} style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.actionText, { color: '#1E40AF' }]}>Corriger</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCheck} style={[styles.actionBtn, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.actionText, { color: '#166534' }]}>Verifier</Text>
        </TouchableOpacity>
      </ScrollView>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Commence une conversation en {language}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Ecris un message ou appuie sur le micro pour parler
          </Text>

          <View style={styles.featuresGrid}>
            <View style={[styles.featureItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.featureIcon}>🎤</Text>
              <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Pratique</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Phrase a prononcer</Text>
            </View>
            <View style={[styles.featureItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.featureIcon}>🇫🇷</Text>
              <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Traduction auto</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Sous chaque reponse</Text>
            </View>
            <View style={[styles.featureItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.featureIcon}>🔧</Text>
              <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Corriger</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Orthographe</Text>
            </View>
            <View style={[styles.featureItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Verifier</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>Trouver erreurs</Text>
            </View>
          </View>

          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Astuce : L'IA corrige automatiquement tes erreurs, te repond a l'oral, et traduit sa reponse en francais automatiquement
          </Text>
        </View>
      ) : (
        <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item.id}
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
                  {item.translation && (
                    <Text style={[styles.autoTranslation, { color: theme.textSecondary }]}>🇫🇷 {item.translation}</Text>
                  )}
                  <TouchableOpacity 
                    onPress={() => handleSpeak(item.text, item.id)} // ✅ Passer l'ID
                    style={styles.listenBtn}
                  >
                    <FontAwesome name="volume-up" size={14} color={theme.primary} />
                    <Text style={[styles.listenText, { color: theme.primary }]}>Ecouter</Text>
                  </TouchableOpacity>
                </View>
              )}
              {['translation', 'correction', 'practice', 'check'].includes(item.role) && (
                <View style={[styles.specialBubble, {
                  backgroundColor: item.role === 'practice' ? '#EEF0FF' : item.role === 'translation' ? '#FFFBEB' : item.role === 'check' ? '#F0FDF4' : '#EFF6FF'
                }]}>
                  <Text style={styles.specialTitle}>{item.text}</Text>
                  <Text style={styles.specialExtra}>{item.extra}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity onPress={handleVoiceInput} disabled={loading}
            style={[styles.micBtn, { backgroundColor: isRecording ? '#EF4444' : theme.primaryLight }]}>
            <FontAwesome name={isRecording ? 'stop' : 'microphone'} size={18} color={isRecording ? '#fff' : theme.primary} />
          </TouchableOpacity>
          <TextInput value={input} onChangeText={setInput} placeholder={isRecording ? 'Parle...' : `Ecris en ${language}...`}
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
  historyPanel: { marginHorizontal: 20, marginBottom: 8, borderRadius: 12, borderWidth: 1, maxHeight: 160 },
  historyItem: { padding: 10, borderBottomWidth: 1 },
  actionsRow: { maxHeight: 44, marginBottom: 4 },
  actionsContent: { paddingHorizontal: 20, gap: 8 },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  actionText: { fontSize: 13, fontWeight: '600' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },

  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
  featureItem: { width: '45%', padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center', gap: 4 },
  featureIcon: { fontSize: 24 },
  featureLabel: { fontSize: 13, fontWeight: '700' },
  featureDesc: { fontSize: 11, textAlign: 'center' },

  tipText: { fontSize: 12, textAlign: 'center', fontStyle: 'italic', paddingHorizontal: 20 },

  list: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  autoTranslation: { fontSize: 12, fontStyle: 'italic', marginLeft: 16, marginTop: 2, marginBottom: 2 },
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