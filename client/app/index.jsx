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
} from '@react-native-google-signin/google-signin';
import { View } from 'react-native';
import Login from './(auth)/login';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false,
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

const GoogleLogin = async () => {
  // check if users' device has google play services
  await GoogleSignin.hasPlayServices();

  // initiates signIn process
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

const googleSignIn = async () => {
  try {
    const response = await GoogleLogin();

    // retrieve user data
    const { idToken, user } = response.data ?? {};
    if (idToken) {
      await processUserData(idToken, user); // Server call to validate the token & process the user data for signing In
    }
  } catch (error) {
    console.log('Error', error);
  }
};

export default function index() {
  return (
    <Login promptAsync={googleSignIn}></Login>
  )
}


