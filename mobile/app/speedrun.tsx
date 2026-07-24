import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useLessons } from '../hooks/useLessons';
import { useAuth } from '../hooks/useAuth';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getIsoCode } from '../constants/languages';

export default function SpeedRunScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { lessons } = useLessons({ language: user?.target_language || undefined }); // ✅ Corrigé
  const [phrases, setPhrases] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // ✅ Corrigé

  const { record, isRecording, transcription } = useSpeechRecognition(getIsoCode(user?.target_language)); // ✅ Corrigé

  useEffect(() => {
    if (lessons.length > 0) {
      const all = lessons.flatMap((l: any) => l.phrases?.map((p: any) => p.text_target) || []);
      setPhrases(all.sort(() => Math.random() - 0.5).slice(0, 5));
    }
  }, [lessons]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  useEffect(() => {
    if (transcription && !isRecording) {
      if (current + 1 < phrases.length) {
        setCurrent(current + 1);
      } else {
        setPlaying(false);
        setFinished(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }
  }, [transcription]);

  function start() {
    setPlaying(true);
    setCurrent(0);
    setTimer(0);
    setFinished(false);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>⚡ Speed Run</Text>
        <Text style={[styles.timer, { color: theme.primary }]}>{timer}s</Text>

        {finished ? (
          <View style={styles.resultBox}>
            <Text style={{ fontSize: 50 }}>🎉</Text>
            <Text style={[styles.resultText, { color: theme.text }]}>Terminé en {timer} secondes !</Text>
            <TouchableOpacity onPress={start} style={[styles.btn, { backgroundColor: theme.primary }]}>
              <Text style={styles.btnText}>Rejouer</Text>
            </TouchableOpacity>
          </View>
        ) : playing ? (
          <View style={styles.gameBox}>
            <Text style={[styles.phrase, { color: theme.text }]}>{phrases[current]}</Text>
            <Text style={[styles.counter, { color: theme.textSecondary }]}>{current + 1}/{phrases.length}</Text>
            <TouchableOpacity onPress={record} style={[styles.micBtn, { backgroundColor: isRecording ? '#EF4444' : theme.primary }]}>
              <FontAwesome name="microphone" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={start} style={[styles.startBtn, { backgroundColor: theme.primary }]}>
            <Text style={styles.btnText}>Commencer</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 24 },
  title: { fontSize: 28, fontWeight: '800' },
  timer: { fontSize: 48, fontWeight: '900' },
  resultBox: { alignItems: 'center', gap: 16 },
  resultText: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  gameBox: { alignItems: 'center', gap: 20 },
  phrase: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  counter: { fontSize: 14 },
  micBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  startBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16 },
  btn: { paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});