import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '@/assets/styles/auth.styles';
import { images } from '@/constants/images';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!email || !password)
      return Alert.alert('Error', 'Email and password are required');
    if (password.length < 6)
      return Alert.alert(
        'Error',
        'Password must be at least 6 characters long'
      );

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error.errors?.[0]?.message || 'Failed to create account'
      );
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };
  if (pendingVerification)
    return <Text>&quot;Pending ui will go here&quot;;</Text>;
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={images.cook2}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Create account</Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                authStyles.authButton,
                isLoading && authStyles.buttonDisabled,
              ]}
              disabled={isLoading}
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText} onPress={handleSignUp}>
                {isLoading ? 'Signing up...' : 'Sign up'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Don&apos;t have an account?
                <Text style={authStyles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
