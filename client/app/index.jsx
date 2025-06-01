// import "react-native-gesture-handler";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from 'expo-web-browser'
// import Login from "./(auth)/login"; // Login screen
// // import {
// //   GoogleAuthProvider,
// //   onAuthStateChanged, 
// //   signInWithCredential,
// // } from "firebase/auth"; // Allows us to sign in a user with a provider (Google)

// import ThemedText from "@/components/ThemedText";

// // import {auth} from "@/firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Save the information that we are going to be retrieving
// import * as React from "react";
// import { useEffect } from "react";


// WebBrowser.maybeCompleteAuthSession(); // Display the web browser inside the application

// export default function App(){
//   const [userInfo,setUserInfo] = React.useState(null);
//   // promptAsync function starts the signin process
//   const [request,response,promptAsync] = Google.useAuthRequest({ // Load an authorization request and returns a loaded request
//     // DO NOT SHARE THIS WITH ANYONE
//     iosClientId : '584112744657-3sl3ral3534lbamdsnkjor25f4dpi85e.apps.googleusercontent.com',
//     androidClientId : '584112744657-18c09sas36oo0pbfh0jqe1lloo5cmcn6.apps.googleusercontent.com',
//     webClientId : '584112744657-5f7b7m74pf1gvvurmocpb14v497dliea.apps.googleusercontent.com'
//   });

//   // React.useEffect(()=>{
//   //   if (response?.type == "success"){
//   //     const {id_token} = response.params;
//   //     const credential = GoogleAuthProvider.credential(id_token);
//   //     signInWithCredential(auth,credential);
//   //   }
//   // },[response]) // Array of dependencies

//   const getUserInfo = async (token) => {
//     //absent token
//     if (!token) return;
//     //present token
//     try {
//       const response = await fetch(
//         "https://www.googleapis.com/userinfo/v2/me",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const user = await response.json();
//       //store user information  in Asyncstorage
//       await AsyncStorage.setItem("user", JSON.stringify(user));
//       setUserInfo(user);
//     } catch (error) {
//       console.error(
//         "Failed to fetch user data:",
//         response.status,
//         response.statusText
//       );
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       // Attempt to retrieve user information from AsyncStorage
//       const userJSON = await AsyncStorage.getItem("user");
  
//       if (userJSON) {
//         // If user information is found in AsyncStorage, parse it and set it in the state
//         setUserInfo(JSON.parse(userJSON));
//       } else if (response?.type === "success") {
//         // If no user information is found and the response type is "success" (assuming response is defined),
//         // call getUserInfo with the access token from the response
//         getUserInfo(response.authentication.accessToken);
//       }
//     } catch (error) {
//       // Handle any errors that occur during AsyncStorage retrieval or other operations
//       console.error("Error retrieving user data from AsyncStorage:", error);
//     }
//   };
  
//   //add it to a useEffect with response as a dependency 
//   useEffect(() => {
//     signInWithGoogle();
//   }, [response]);
  
//   //log the userInfo to see user details
//   console.log(JSON.stringify(userInfo))

//   return <Login promptAsync={promptAsync}/>;
// }






// import React from "react"
// import { StyleSheet, Text, View, Image, Button } from "react-native"
// import Expo from "expo"

// export default class App extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       signedIn: false,
//       name: "",
//       photoUrl: ""
//     }
//   }
//   signIn = async () => {
//     try {
//       const result = await Expo.Google.logInAsync({
//         androidClientId : '584112744657-18c09sas36oo0pbfh0jqe1lloo5cmcn6.apps.googleusercontent.com',
// iosClientId : '584112744657-3sl3ral3534lbamdsnkjor25f4dpi85e.apps.googleusercontent.com',

//         //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
//         scopes: ["profile", "email"]
//       })

//       if (result.type === "success") {
//         this.setState({
//           signedIn: true,
//           name: result.user.name,
//           photoUrl: result.user.photoUrl
//         })
//       } else {
//         console.log("cancelled")
//       }
//     } catch (e) {
//       console.log("error", e)
//     }
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         {this.state.signedIn ? (
//           <LoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} />
//         ) : (
//           <LoginPage signIn={this.signIn} />
//         )}
//       </View>
//     )
//   }
// }

// const LoginPage = props => {
//   return (
//     <View>
//       <Text style={styles.header}>Sign In With Google</Text>
//       <Button title="Sign in with Google" onPress={() => props.signIn()} />
//     </View>
//   )
// }

// const LoggedInPage = props => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Welcome:{props.name}</Text>
//       <Image style={styles.image} source={{ uri: props.photoUrl }} />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   header: {
//     fontSize: 25
//   },
//   image: {
//     marginTop: 15,
//     width: 150,
//     height: 150,
//     borderColor: "rgba(0,0,0,0.2)",
//     borderWidth: 3,
//     borderRadius: 150
//   }
// })

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