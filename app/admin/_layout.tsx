import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="driver-applications" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="drivers" />
      <Stack.Screen name="users" />
      <Stack.Screen name="passengers" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="support" />
    </Stack>
  );
}