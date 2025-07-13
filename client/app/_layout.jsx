// app/_layout.jsx
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

const linking = {
  prefixes: ["client://"],
  config: {
    screens: {
      "(auth)/changepw": "changepw",
    },
  },
};

// This component connects your custom theme state with React Navigation’s ThemeProvider
function NavigationWrapper({ children }) {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider
      value={theme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme}
    >
      {children}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <NavigationWrapper>
          <Stack linking={linking}>
            <Stack.Screen name="expense_details" options={{ headerShown: false }} />
            <Stack.Screen name="add_budget" options={{ headerShown: false }} />
            <Stack.Screen name="add_goal" options={{ headerShown: false }} />
            <Stack.Screen name="add_income" options={{ headerShown: false }} />
            <Stack.Screen name="edit_expense" options={{ headerShown: false }} />
            <Stack.Screen name="add_expense" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </NavigationWrapper>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});