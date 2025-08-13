import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { images } from '@/constants/images';
import { COLORS } from '@/constants/colors';

const VerifyEmailScreen = ({ email, onBack }) => {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;
    // if (!code) return Alert.alert('Error', 'Verification code is required');
    setIsLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === 'complete') {
        Alert.alert('Success', 'Email verified successfully');
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        Alert.alert(
          'Verification failed',
          'Please check your code and try again.'
        );
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error.errors?.[0]?.message || 'An unknown error occurred.'
      );
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={images.cook3}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Verify your email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}. Please enter it
            below.
          </Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[
                authStyles.authButton,
                isLoading && authStyles.buttonDisabled,
              ]}
              disabled={isLoading}
              onPress={handleVerifyEmail}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText} onPress={handleVerifyEmail}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmailScreen;
