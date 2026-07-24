import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getLessonByIdRequest } from '../../../services/api/lessons';
import { Lesson } from '../../../types/lesson';
import { Phrase } from '../../../types/phrase';
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useSimilarityScore } from '../../../hooks/useSimilarityScore';
import { useProgress } from '../../../hooks/useProgress';
import { useTheme } from '../../../hooks/useTheme';
import { getIsoCode } from '../../../constants/languages';
import { playLastRecording } from '../../../services/speech/recognition';
import { getDetailedFeedback } from '../../../services/speech/phoneticFeedback';
import { playSuccessSound, playFailSound } from '../../../services/sounds';
import { getMotivationMessage } from '../../../services/motivation';
import PhraseDisplay from '../../../components/practice/PhraseDisplay';
import AudioPlayer from '../../../components/practice/AudioPlayer';
import RecordButton from '../../../components/practice/RecordButton';
import FeedbackDisplay from '../../../components/practice/FeedbackDisplay';
import ScoreDisplay from '../../../components/practice/ScoreDisplay';
import PhoneticFeedback from '../../../components/practice/PhoneticFeedback';
import MotivationMessage from '../../../components/practice/MotivationMessage';
import ProgressIndicator from '../../../components/lesson/ProgressIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function PracticeScreen() {
  const { lessonId, phraseIndex } = useLocalSearchParams<{ lessonId: string; phraseIndex: string }>();
  const currentIndex = Number(phraseIndex);
  const { theme } = useTheme();

  const [lesson, setLesson] = useState<(Lesson & { phrases: Phrase[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const { speak, isSpeaking, rate, setRate } = useSpeechSynthesis();
  const { record, isRecording, transcription, error, volumeLevel, reset } = useSpeechRecognition(getIsoCode(lesson?.language));
  const { saveProgress } = useProgress();

  const currentPhrase = lesson?.phrases[currentIndex];
  const { score, words } = useSimilarityScore(currentPhrase?.text_target || '', transcription);

  const phoneticFeedback = transcription && currentPhrase && lesson
    ? getDetailedFeedback(currentPhrase.text_target, transcription, lesson.language)
    : null;

  useEffect(() => {
    (async () => {
      const res = await getLessonByIdRequest(Number(lessonId));
      setLesson(res.lesson);
      setLoading(false);
    })();
  }, [lessonId]);

  useEffect(() => {
    setShowResult(false);
    reset();
  }, [currentIndex]);

  useEffect(() => {
    if (transcription && currentPhrase) {
      setShowResult(true);
      saveProgress({ phrase_id: currentPhrase.id, lesson_id: Number(lessonId), score, transcription });
      if (score >= 80) playSuccessSound();
      else if (score < 50) playFailSound();
    }
  }, [transcription]);

  function handleNext() {
    if (lesson && currentIndex + 1 < lesson.phrases.length) {
      router.replace(`/practice/${lessonId}/${currentIndex + 1}`);
    } else {
      router.replace(`/(tabs)`);
    }
  }

  function handleRetry() {
    setShowResult(false);
    reset();
  }

  if (loading) return <LoadingSpinner label="Chargement..." />;
  if (!lesson || !currentPhrase) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>
        <ProgressIndicator current={currentIndex + 1} total={lesson.phrases.length} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <PhraseDisplay target={currentPhrase.text_target} translation={currentPhrase.text_translation} />

        <AudioPlayer onPress={() => speak(currentPhrase.text_target, lesson.language)} isSpeaking={isSpeaking} />

        <View style={styles.speedSelector}>
          {[0.6, 0.9, 1.2].map((r) => (
            <TouchableOpacity key={r} onPress={() => setRate(r)}
              style={[styles.speedButton, { backgroundColor: rate === r ? theme.primary : theme.surface }]}>
              <Text style={[styles.speedText, { color: rate === r ? '#fff' : theme.text }]}>
                {r === 0.6 ? 'Lent' : r === 0.9 ? 'Normal' : 'Rapide'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <ErrorMessage message={error} />}

        {!showResult ? (
          <View style={styles.recordZone}>
            <RecordButton onPress={record} isRecording={isRecording} volumeLevel={volumeLevel} />
          </View>
        ) : (
          <View style={styles.resultZone}>
            <ScoreDisplay score={score} />
            <MotivationMessage score={score} message={getMotivationMessage(score)} />
            <FeedbackDisplay words={words} />

            {phoneticFeedback && (
              <PhoneticFeedback
                phoneticTips={phoneticFeedback.phoneticTips}
                missingWords={phoneticFeedback.missingWords}
                extraWords={phoneticFeedback.extraWords}
              />
            )}

            <TouchableOpacity onPress={playLastRecording} style={styles.replayButton}>
              <FontAwesome name="play-circle" size={16} color={theme.primary} />
              <Text style={[styles.replayText, { color: theme.primary }]}>Reecouter ma voix</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {showResult && (
        <View style={[styles.footerButtons, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={handleRetry} style={[styles.retryButton, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]} activeOpacity={0.85}>
            <FontAwesome name="microphone" size={15} color={theme.primary} />
            <Text style={[styles.retryButtonText, { color: theme.primary }]}>Reessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: theme.primary }]} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>Phrase suivante</Text>
            <FontAwesome name="arrow-right" size={15} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  speedSelector: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  speedButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  speedText: { fontSize: 12, fontWeight: '600' },
  recordZone: { alignItems: 'center', marginTop: 20 },
  resultZone: { marginTop: 12 },
  replayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, marginTop: 8 },
  replayText: { fontWeight: '600', fontSize: 14 },
  footerButtons: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1 },
  retryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, height: 56, borderWidth: 1 },
  retryButtonText: { fontSize: 15, fontWeight: '700' },
  nextButton: { flex: 1, flexDirection: 'row', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', gap: 10 },
  nextButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});