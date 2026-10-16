import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme/tokens';
import { useCollectionStore } from '../src/store/collectionStore';

export default function RootLayout() {
  // Load the local collection once at startup; every screen reads the store.
  useEffect(() => {
    void useCollectionStore.getState().load();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="card/[id]" />
        <Stack.Screen name="add-card" />
        <Stack.Screen name="legal" />
      </Stack>
    </SafeAreaProvider>
  );
}
