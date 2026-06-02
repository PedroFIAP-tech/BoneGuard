import { Slot } from 'expo-router';
import { Syne_700Bold, useFonts } from '@expo-google-fonts/syne';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Syne_700Bold, DMSans_400Regular, DMSans_500Medium });
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Slot />
    </AuthProvider>
  );
}
