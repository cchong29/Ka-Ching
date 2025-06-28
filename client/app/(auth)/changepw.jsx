import { useState } from "react";
import { supabase } from '../../lib/supabase';
import { useEffect } from "react";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login"); // not logged in, redirect
      }
    });
  }, []);

  const handleChange = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Password updated successfully!");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Set your new password</ThemedText>
      <ThemedTextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <ThemedButton title="Change Password" onPress={handleChange}>
        <Text style = {{color: "#FFFFFF"}}>Continue</Text>
        </ThemedButton> 
      {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 60 },
    title: { fontSize: 20, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20 },
    message: { marginTop: 20 },
  });