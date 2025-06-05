import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { View, Alert, Platform } from 'react-native';
import Login from './(auth)/login';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ['profile', 'email'],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

export default function Index() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signInInProgress = useRef(false);

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const initializeGoogleSignIn = async () => {
    try {
      console.log('Initializing Google Sign-In...');
      await GoogleSignin.signOut();
      console.log('Google Sign-In initialized successfully');
    } catch (error) {
      console.log('Error initializing Google Sign-In:', error);
    }
  };

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const userInfo = await GoogleSignin.signIn();
      console.log('Google sign-in successful - Full response:', JSON.stringify(userInfo, null, 2));
      return userInfo;
    } catch (error) {
      console.log('GoogleLogin error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
        Alert.alert('Sign In Cancelled', 'You cancelled the Google sign-in process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
        Alert.alert('Sign In In Progress', 'Google sign-in is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
        Alert.alert('Google Play Services', 'Google Play Services is not available on this device.');
      } else {
        console.log('Other error:', error);
        Alert.alert('Sign In Error', 'An error occurred during Google sign-in. Please try again.');
      }
      
      throw error;
    }
  };

  const googleSignIn = async () => {
    if (isSigningIn || signInInProgress.current) {
      console.log('Sign-in already in progress, ignoring...');
      return;
    }

    try {
      setIsSigningIn(true);
      signInInProgress.current = true;
      
      console.log('Starting Google sign-in process...');
      
      try {
        await GoogleSignin.signOut();
        console.log('Successfully signed out previous session');
      } catch (signOutError) {
        console.log('Sign out error (this is usually fine):', signOutError.message);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const userInfo = await GoogleLogin();
      
      // Debug: Log the entire response structure
      console.log('Complete userInfo structure:', JSON.stringify(userInfo, null, 2));
      
      // The correct way to access the data depends on the response structure
      // Try different possible structures:
      let idToken, user;
      
      if (userInfo.idToken) {
        // Structure: { idToken, user: { email, ... } }
        idToken = userInfo.idToken;
        user = userInfo.user;
      } else if (userInfo.data) {
        // Structure: { data: { idToken, user: { email, ... } } }
        idToken = userInfo.data.idToken;
        user = userInfo.data.user;
      } else {
        // Log what we actually got
        console.log('Unexpected userInfo structure:', Object.keys(userInfo));
        Alert.alert('Authentication Error', 'Unexpected response structure from Google Sign-In');
        return;
      }
      
      console.log('Extracted data:', { 
        email: user?.email, 
        name: user?.name,
        idToken: !!idToken,
        idTokenLength: idToken?.length 
      });

      if (idToken) {
        console.log('Sending request to backend...');
        
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
        
        const res = await fetch(`${baseUrl}/auth/google-login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        console.log('Backend response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log('Backend error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const data = await res.json();
        console.log('Backend response data:', data);

        if (data.loggedIn) {
          console.log('Login successful, navigating to home...');
          router.push('/(tabs)/home');
        } else {
          Alert.alert('Login Failed', data.status || 'Unknown error occurred');
        }
      } else {
        console.log('No idToken found in response');
        Alert.alert('Authentication Error', 'No ID token received from Google');
      }
    } catch (error) {
      console.log('Google sign-in error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in already in progress');
        Alert.alert('Please Wait', 'Sign-in is already in progress. Please wait...');
      } else if (error.message && error.message.includes('Network request failed')) {
        Alert.alert('Connection Error', 'Unable to connect to server. Please check your internet connection and try again.');
      } else {
        Alert.alert('Sign In Error', 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
      signInInProgress.current = false;
    }
  };

  return <Login promptAsync={googleSignIn} isSigningIn={isSigningIn} />;
}