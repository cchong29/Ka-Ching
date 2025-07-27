import React, { useEffect, useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';
import Login from './(auth)/login';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function Index() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true); // ✅

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: process.env.EXPO_PUBLIC_WEB_ID,
    });

    // ✅ Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(tabs)/home');
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo?.data?.idToken;
      if (!idToken) throw new Error('No ID token present');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      console.log('Google login result:', { data, error });
      if (!error) router.replace('/(tabs)/home');
    } catch (error) {
      console.log('Google Sign-In Error:', error);
    }
  };

  const appleSignin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) throw new Error('No identityToken.');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (!error) router.replace('/(tabs)/home');
    } catch (e) {
      console.log('Apple Sign-In Error:', e);
    }
  };

  // ✅ Don’t render login screen if already checking session
  if (checkingSession) return null;

  return <Login promptAsync={googleSignin} apple={appleSignin} />;
}
