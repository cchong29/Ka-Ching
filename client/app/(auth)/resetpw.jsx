import { useState } from "react";
import { supabase } from '../../lib/supabase';
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { StyleSheet } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter()

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "client://changepw", 
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Reset link sent to your email!");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24}  />
          </TouchableOpacity>

      <ThemedText style={styles.title}>Reset your password</ThemedText>
      <ThemedTextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <ThemedButton onPress={handleReset}> 
        <Text style = {{color : "#FFFFFF"}}>
            Continue
        </Text>
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
    backBtn:{marginTop:10},
  });