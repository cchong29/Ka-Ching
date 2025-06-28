// app/webview.jsx
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl =
  process.env.EXPO_PUBLIC_ENV === "production"
    ? "https://ka-ching.onrender.com"
    : Platform.OS === "android"
    ? "http://10.0.2.2:4000"
    : "http://localhost:4000";

export default function WebviewScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams();
  console.log(url)
  console.log("Linked to Finverse UI");

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={async ({ url }) => {
        if (url.includes("?code=")) {
          const code = new URL(url).searchParams.get("code");
          console.log('Got code',code)

          const result = await fetch(`${baseUrl}/finverse/exchange-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const { access_token: login_identity_token } = await result.json();
          console.log('Fetched login identity token')
          // Store token for fetching transactions later
          await AsyncStorage.setItem("finverse_token", login_identity_token);
          router.push("/(tabs)/home");
        }
      }}
    />
  );
}
