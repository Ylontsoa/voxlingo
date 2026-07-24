import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import client from '../../services/api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function QuizScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [initialized, setInitialized] = useState(false); // ✅

  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ✅ Charge une seule fois
  useEffect(() => {
    if (user?.target_language && !initialized) {
      loadQuiz();
      setInitialized(true);
    }
  }, [user?.target_language, initialized]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: questions.length > 0 ? (currentQuestion + 1) / questions.length : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, questions.length]);

  async function loadQuiz() {
    setLoading(true);
    try {
      const { data } = await client.get(`/lessons?language=${user?.target_language}`);
      const allLessons = data.lessons || [];
      const allPhrases: any[] = [];
      for (const lesson of allLessons.slice(0, 5)) {
        const phraseRes = await client.get(`/lessons/${lesson.id}`);
        allPhrases.push(...(phraseRes.data.lesson?.phrases || []));
      }
      if (allPhrases.length < 4) { setQuestions([]); setLoading(false); return; }
      const shuffled = allPhrases.sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(shuffled.map((phrase: any) => {
        const wrong = allPhrases.filter((p: any) => p.id !== phrase.id).sort(() => Math.random() - 0.5).slice(0, 3).map((p: any) => p.text_translation);
        return { question: phrase.text_target, correct: phrase.text_translation, options: [...wrong, phrase.text_translation].sort(() => Math.random() - 0.5) };
      }));
    } catch (err) { console.warn('Erreur quiz:', err); }
    finally { setLoading(false); }
  }

  function handleAnswer(answer: string) {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResult(true);
        }
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }, 800);
  }

  if (loading) return <LoadingSpinner label="Préparation du quiz..." />;
  if (questions.length === 0) return <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}><EmptyState message="Pas assez de phrases. Pratique d'abord quelques leçons !" /></SafeAreaView>;

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <LinearGradient colors={percentage >= 70 ? ['#22C55E', '#16A34A'] : percentage >= 40 ? ['#F59E0B', '#D97706'] : ['#6366F1', '#4F46E5']} style={styles.resultHeader}>
          <Text style={styles.resultEmoji}>{percentage >= 70 ? '🏆' : percentage >= 40 ? '👍' : '💪'}</Text>
          <Text style={styles.resultScore}>{score}/{questions.length}</Text>
          <Text style={styles.resultPercent}>{percentage}%</Text>
        </LinearGradient>
        <View style={styles.resultActions}>
          <Text style={[styles.resultLabel, { color: theme.text }]}>
            {percentage >= 80 ? '🌟 Excellent !' : percentage >= 50 ? '👏 Pas mal !' : '📚 Continue !'}
          </Text>
          <TouchableOpacity onPress={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); loadQuiz(); }} style={[styles.btn, { backgroundColor: theme.primary }]}>
            <FontAwesome name="refresh" size={16} color="#fff" />
            <Text style={styles.btnText}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={[styles.btn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}>
            <Text style={[styles.btnText, { color: theme.text }]}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: theme.primary }]} />
      </View>

      <View style={styles.quizContainer}>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {currentQuestion + 1} / {questions.length}
        </Text>
        <View style={[styles.scoreBadge, { backgroundColor: theme.primaryLight }]}>
          <FontAwesome name="star" size={12} color={theme.primary} />
          <Text style={[styles.scoreText, { color: theme.primary }]}>{score} pts</Text>
        </View>
        <Animated.View style={[styles.questionCard, { backgroundColor: theme.surface, borderColor: theme.border, opacity: fadeAnim, transform: [{ translateX: shakeAnim }, { scale: bounceAnim }] }]}>
          <Text style={[styles.questionLabel, { color: theme.textSecondary }]}>Traduis cette phrase :</Text>
          <Text style={[styles.question, { color: theme.text }]}>{questions[currentQuestion]?.question}</Text>
        </Animated.View>
        <View style={styles.optionsGrid}>
          {questions[currentQuestion]?.options.map((opt: string, i: number) => {
            const isSelected = selectedAnswer === opt;
            const isGood = isSelected && isCorrect;
            const isBad = isSelected && !isCorrect;
            const isRightAnswer = selectedAnswer && opt === questions[currentQuestion].correct;
            return (
              <TouchableOpacity key={i} onPress={() => !selectedAnswer && handleAnswer(opt)} disabled={!!selectedAnswer}
                style={[styles.option, { backgroundColor: isGood ? '#22C55E' : isBad ? '#EF4444' : isRightAnswer ? '#22C55E' : theme.surface, borderColor: isGood ? '#22C55E' : isBad ? '#EF4444' : isRightAnswer ? '#22C55E' : theme.border }, selectedAnswer && !isSelected && !isRightAnswer && { opacity: 0.5 }]}>
                <Text style={[styles.optionText, { color: isGood || isBad || isRightAnswer ? '#fff' : theme.text }]}>{opt}</Text>
                {isGood && <FontAwesome name="check" size={16} color="#fff" style={styles.optionIcon} />}
                {isBad && <FontAwesome name="times" size={16} color="#fff" style={styles.optionIcon} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressBar: { height: 4, width: '100%' },
  progressFill: { height: '100%', borderRadius: 2 },
  quizContainer: { flex: 1, padding: 20, gap: 12 },
  counter: { textAlign: 'center', fontSize: 14 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  scoreText: { fontSize: 13, fontWeight: '700' },
  questionCard: { padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  questionLabel: { fontSize: 13, marginBottom: 8 },
  question: { fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
  optionsGrid: { gap: 10, marginTop: 8 },
  option: { padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 16, textAlign: 'center', flex: 1 },
  optionIcon: { marginLeft: 8 },
  resultHeader: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  resultEmoji: { fontSize: 60 },
  resultScore: { fontSize: 40, fontWeight: '900', color: '#fff', marginTop: 8 },
  resultPercent: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  resultActions: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  resultLabel: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  btn: { flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14, gap: 8, width: '80%', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});