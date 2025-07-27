import { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import * as Progress from "react-native-progress";
import { useFocusEffect } from "expo-router";

import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

export default function GoalDetails() {
  const { id } = useLocalSearchParams();
  const [goal, setGoal] = useState(null);
  const [linkedTransactions, setLinkedTransactions] = useState([]);
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  const fetchGoal = useCallback(async () => {
    const { data, error } = await supabase.from("goals").select("*").eq("id", id).single();
    if (error) {
      Alert.alert("Error", "Failed to fetch goal.");
      return;
    }
    setGoal(data);
  }, [id]);

  const fetchLinkedTransactions = useCallback(async () => {
    const { data, error } = await supabase
      .from("linked_transactions")
      .select("id, income_id, income:income_id(title, amount)")
      .eq("goal_id", id);

    if (!error && data) {
      const formatted = data.map((row) => ({
        id: row.id,
        amount: row.income?.amount || 0,
        title: row.income?.title || "No title",
      }));
      setLinkedTransactions(formatted);
    } else {
      console.error("Fetch error:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchGoal();
      fetchLinkedTransactions();
    }, [fetchGoal, fetchLinkedTransactions])
  );

  if (!goal) return null;

  // Calculate saved amount dynamically: sum linked + manual monthly_saving * months elapsed
  const now = new Date();
  const createdDate = goal.created_at ? new Date(goal.created_at) : now;
  const monthsElapsed = Math.max(
    0,
    (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth())
  );
  const linkedTotal = linkedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const manualAmount = (goal.monthly_saving || 0) * monthsElapsed;
  const savedAmount = linkedTotal + manualAmount;

  const progress =
    goal.target_amount && goal.target_amount > 0 ? Math.min(savedAmount / goal.target_amount, 1) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          {/* Goal Title */}
          <ThemedText title style={styles.title}>
            {goal.name}
          </ThemedText>

          {/* Progress Info */}
          <ThemedText style={styles.subtitle}>
            ${savedAmount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
          </ThemedText>
          <Progress.Bar
            progress={progress}
            color={theme.tint}
            height={14}
            borderRadius={10}
            width={Dimensions.get("window").width - 40} // safe width with padding
            style={{ marginTop: 8 }}
          />
          <ThemedText style={styles.progressLabel}>
            {progress >= 1
              ? "✅ Goal completed!"
              : `You need $${(goal.target_amount - savedAmount).toFixed(2)} more`}
          </ThemedText>

          {/* Goal Details */}
          <View style={styles.detailsBox}>
            <Text style={styles.detailItem}>Target Amount: ${goal.target_amount.toFixed(2)}</Text>
            <Text style={styles.detailItem}>Saved Amount: ${savedAmount.toFixed(2)}</Text>
            <Text style={styles.detailItem}>
              Target Date: {new Date(goal.target_date).toDateString()}
            </Text>
            <Text style={styles.detailItem}>Priority: {goal.priority}</Text>
          </View>

          {/* Edit & Delete Buttons */}
          <View style={styles.buttonRow}>
            <ThemedButton
              onPress={() => router.push({ pathname: "/edit_goal", params: { id: goal.id } })}
              style={[styles.button, styles.modifyBtn]}
            >
              <ThemedText style={styles.buttonText}>Edit</ThemedText>
            </ThemedButton>
            <ThemedButton
              onPress={() =>
                Alert.alert("Confirm Delete", "Are you sure you want to delete this goal?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      const { error } = await supabase.from("goals").delete().eq("id", goal.id);
                      if (!error) {
                        router.back();
                      } else {
                        console.error("Delete failed:", error);
                        Alert.alert("Error", "Failed to delete the goal.");
                      }
                    },
                  },
                ])
              }
              style={[styles.button, styles.deleteBtn]}
            >
              <ThemedText style={styles.buttonText}>Delete</ThemedText>
            </ThemedButton>
          </View>

          {/* Linked Transactions */}
          <ThemedText title style={styles.sectionTitle}>
            Linked Transactions
          </ThemedText>
          {linkedTransactions.length === 0 ? (
            <ThemedText style={{ fontSize: 14, color: theme.icon }}>
              No linked transactions yet.
            </ThemedText>
          ) : (
            linkedTransactions.map((t) => (
              <View key={t.id} style={{ paddingVertical: 6 }}>
                <Text>
                  {t.title} - ${t.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}

          {/* Button to Link More Transactions */}
          <ThemedButton
            onPress={() => router.push({ pathname: "/link_transactions", params: { goal_id: id } })}
            style={[styles.button, { marginTop: 20, backgroundColor: theme.tint }]}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>Link Transactions</ThemedText>
          </ThemedButton>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backBtn: { marginTop: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 6 },
  progressLabel: { marginTop: 8, fontSize: 13, color: "gray" },
  detailsBox: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
  },
  detailItem: {
    marginBottom: 6,
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modifyBtn: {
    backgroundColor: "#137547",
  },
  deleteBtn: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});