import React from 'react';
import { Stack } from 'expo-router';
import { AuthContext, useAuthProvider } from '../hooks/useAuth';
import { ThemeProvider } from '../hooks/useTheme';

export default function RootLayout() {
  const auth = useAuthProvider();

  return (
    <ThemeProvider>
      <AuthContext.Provider value={auth}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[id]" />
          <Stack.Screen name="practice/[lessonId]/[phraseIndex]" />
          <Stack.Screen name="review" />
        </Stack>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}