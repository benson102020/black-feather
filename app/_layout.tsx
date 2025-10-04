import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '../contexts/AppContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ErrorBoundary>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="role-selection" />
          <Stack.Screen name="database-auto-fix" />
          <Stack.Screen name="alternative-setup" />
          <Stack.Screen name="database-constraints-fix" />
          <Stack.Screen name="offline-mode-setup" />
          <Stack.Screen name="system-status" />
          <Stack.Screen name="complete-system-test" />
          <Stack.Screen name="database-fix-helper" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="network-error-handler" />
          <Stack.Screen name="BOSS666-setup" />
          <Stack.Screen name="BOSS666-control" />
          <Stack.Screen name="file-navigator" />
          <Stack.Screen name="icon-test" />
          <Stack.Screen name="error-handler" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="passenger" options={{ presentation: 'modal' }} />
          <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </ErrorBoundary>
  );
}