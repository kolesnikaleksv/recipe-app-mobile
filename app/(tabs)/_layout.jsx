import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const Tabslayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href={'/(auth)/sign-in'} />;
  return <Stack />;
};

export default Tabslayout;
