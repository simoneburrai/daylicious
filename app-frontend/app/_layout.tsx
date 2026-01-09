import { Stack } from 'expo-router';
import "../global.css"

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ presentation: 'modal', headerShown: true, title: 'Dettaglio Ricetta' }} />
    </Stack>
  );
}