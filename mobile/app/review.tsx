import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useReview } from '../hooks/useReview';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSimilarityScore } from '../hooks/useSimilarityScore';
import { useProgress } from '../hooks/useProgress';
import { getIsoCode } from '../constants/languages';
import { useTheme } from '../hooks/useTheme';
import PhraseDisplay from '../components/practice/PhraseDisplay';
import AudioPlayer from '../components/practice/AudioPlayer';
import RecordButton from '../components/practice/RecordButton';
import FeedbackDisplay from '../components/practice/FeedbackDisplay';
import ScoreDisplay from '../components/practice/ScoreDisplay';
import Confetti from '../components/practice/Confetti';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function ReviewScreen() {
  const { theme } = useTheme();
  const { phrases, loading, fetchReview } = useReview();
  const { saveProgress } = useProgress();
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentPhrase = phrases[index];
  const isoLang = getIsoCode(currentPhrase?.Lesson?.language);

  const { speak, isSpeaking } = useSpeechSynthesis();
  const { record, isRecording, transcription, error, volumeLevel } = useSpeechRecognition(isoLang);
  const { score, words } = useSimilarityScore(currentPhrase?.text_target || '', transcription);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  useEffect(() => {
    if (transcription && currentPhrase) {
      setShowResult(true);
      saveProgress({
        phrase_id: currentPhrase.id,
        lesson_id: currentPhrase.lesson_id,
        score,
        transcription,
      });
    }
  }, [transcription]);

  function handleNext() {
    setShowResult(false);
    if (index + 1 < phrases.length) {
      setIndex(index + 1);
    } else {
      router.back();
    }
  }

  if (loading) return <LoadingSpinner label="Chargement des révisions..." />;

  if (phrases.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
            <FontAwesome name="times" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconWrap, { backgroundColor: theme.primaryLight }]}>
            <FontAwesome name="check-circle" size={32} color={theme.primary} />
          </View>
          <EmptyState message="Aucune phrase à réviser pour le moment. Continue à pratiquer !" />
        </View>
      </SafeAreaView>
    );
  }

  const progress = (index + (showResult ? 1 : 0)) / phrases.length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <Confetti trigger={showResult && score >= 80} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>

        <View style={[styles.reviewBadge, { backgroundColor: theme.primaryLight }]}>
          <FontAwesome name="refresh" size={12} color={theme.primary} />
          <Text style={[styles.reviewBadgeText, { color: theme.primary }]}>
            Révision {index + 1}/{phrases.length}
          </Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* 📊 Barre de progression de la session */}
      <View style={[styles.progressTrack, { backgroundColor: theme.surface }]}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${Math.max(progress * 100, 4)}%` }]}
        />
      </View>

      <View style={styles.content}>
        <View style={[styles.phraseCard, { backgroundColor: theme.surface }]}>
          <PhraseDisplay target={currentPhrase.text_target} translation={currentPhrase.text_translation} />
          <AudioPlayer onPress={() => speak(currentPhrase.text_target, currentPhrase.Lesson.language)} isSpeaking={isSpeaking} />
        </View>

        <View style={styles.interactionZone}>
          {!showResult ? (
            <RecordButton onPress={record} isRecording={isRecording} volumeLevel={volumeLevel} />
          ) : (
            <>
              <View style={[styles.resultCard, { backgroundColor: theme.surface }]}>
                <ScoreDisplay score={score} />
                <FeedbackDisplay words={words} />
              </View>

              <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={styles.nextButtonWrap}>
                <LinearGradient colors={['#6366F1', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>
                    {index + 1 < phrases.length ? 'Suivant' : 'Terminer'}
                  </Text>
                  <FontAwesome name="arrow-right" size={15} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  reviewBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  reviewBadgeText: { fontSize: 12, fontWeight: '700' },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  progressTrack: {
    height: 6, marginHorizontal: 20, borderRadius: 3, overflow: 'hidden', marginBottom: 20,
  },
  progressFill: { height: 6, borderRadius: 3 },

  content: { flex: 1, paddingHorizontal: 20 },

  phraseCard: {
    borderRadius: 20, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },

  interactionZone: { flex: 1, justifyContent: 'center' },

  resultCard: {
    borderRadius: 20, padding: 18, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },

  nextButtonWrap: { borderRadius: 16, marginTop: 16 },
  nextButton: {
    flexDirection: 'row', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
});