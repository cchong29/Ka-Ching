import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import * as Progress from "react-native-progress";

export default function GoalDetails() {
  const { id } = useLocalSearchParams();
  const [goal, setGoal] = useState(null);
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      const { data } = await supabase.from("goals").select("*").eq("id", id).single();
      setGoal(data);
    };
    fetchGoal();
  }, [id]);

  if (!goal) return null;

  const progress = Math.min(goal.saved_amount / goal.target_amount, 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.title}>{goal.name}</ThemedText>
        <ThemedText style={{ marginBottom: 10 }}>
          ${goal.saved_amount} of ${goal.target_amount}
        </ThemedText>
        <Progress.Bar progress={progress} color={theme.tint} height={14} />

        <ThemedText title style={styles.subTitle}>Related Transactions</ThemedText>
        {/* you could later filter transactions by a goal_id if you store that on expenses/incomes */}
        <ThemedText style={{ fontSize: 14 }}>No linked transactions yet.</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 12 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  subTitle: { marginTop: 20, marginBottom: 10, fontSize: 16, fontWeight: "bold" },
});
