import { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";

export default function EditBudgets() {
  const [budgets, setBudgets] = useState([]);
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchBudgets = async () => {
      const { data } = await supabase.from("budgets").select("*");
      setBudgets(data || []);
    };
    fetchBudgets();
  }, []);

  const handleSave = async () => {
    for (let b of budgets) {
      await supabase.from("budgets").update({ limit: b.limit }).eq("id", b.id);
    }
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.title}>Edit Budgets</ThemedText>
        {budgets.map((b, i) => (
          <View key={b.id} style={styles.card}>
            <ThemedText>{b.category}</ThemedText>
            <ThemedTextInput
              placeholder="$0.00"
              keyboardType="decimal-pad"
              value={String(b.limit)}
              onChangeText={(text) => {
                const newBudgets = [...budgets];
                newBudgets[i].limit = parseFloat(text || 0);
                setBudgets(newBudgets);
              }}
            />
          </View>
        ))}

        <ThemedButton onPress={handleSave}>
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>Save Changes</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 12 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  card: { marginBottom: 16 },
});
