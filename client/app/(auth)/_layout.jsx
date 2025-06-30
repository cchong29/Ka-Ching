import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="t&c" options={{ headerShown: false }} />
      <Stack.Screen name="feedback" options={{ headerShown: false }} />
      <Stack.Screen name="resetpw" options={{ headerShown: false }} />
      <Stack.Screen name="changepw" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
    </Stack>
  );
}
