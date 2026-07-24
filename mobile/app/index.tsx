import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Chargement..." />;

  if (!user) return <Redirect href="/(auth)/login" />;
  if (!user.target_language) return <Redirect href="/(auth)/language-select" />;

  return <Redirect href="/(tabs)" />;
}