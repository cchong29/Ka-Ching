// app/webview.jsx
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";
import { useEffect } from "react";
import { Linking } from "react-native";

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

  console.log("Linked to Finverse UI");

  // Handle deep link when returning from authentication
  useEffect(() => {
    const handleDeepLink = async (url) => {
      if (url.includes("finverse-success")) {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get("token");

        if (token) {
          await AsyncStorage.setItem("finverse_token", token);
          router.push("/(tabs)/home");
        }
      }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={({ url }) => {
        // Fallback: if the callback doesn't redirect properly,
        // still handle the code in the WebView
        if (url.includes("?code=")) {
          const code = new URL(url).searchParams.get("code");
          console.log("Got code in WebView:", code);

          // You can still use your exchange-code endpoint as backup
          fetch(`${baseUrl}/finverse/exchange-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          })
            .then((res) => res.json())
            .then(async ({ access_token }) => {
              await AsyncStorage.setItem("finverse_token", access_token);
              router.push("/(tabs)/home");
            });
        }
      }}
    />
  );
}
