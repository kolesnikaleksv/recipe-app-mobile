import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import SafeScreenArea from '@/components/SafeScreenArea';

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreenArea>
        <Slot />
      </SafeScreenArea>
    </ClerkProvider>
  );
}
