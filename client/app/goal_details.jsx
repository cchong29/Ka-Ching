import { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, View, Alert, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import * as Progress from "react-native-progress";

import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

export default function GoalDetails() {
  const { id } = useLocalSearchParams();
  const [goal, setGoal] = useState(null);
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

      setGoal(data);
    };

    const handleDelete = async () => {
      const confirm = window.confirm?.("Are you sure you want to delete this goal?") || 
                      Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
                        { text: "Cancel", style: "cancel" },
                        { text: "Delete", style: "destructive", onPress: async () => {
                          const { error } = await supabase.from("goals").delete().eq("id", goal.id);
                          if (error) {
                            console.error("Error deleting goal:", error);
                            Alert.alert("Error", "Failed to delete goal.");
                          } else {
                            router.back();
                          }
                        }},
                      ]);
    };

    fetchGoal();
  }, [id]);

  if (!goal) return null;

  const progress = Math.min(goal.saved_amount / goal.target_amount, 1);

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
            ${goal.saved_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
          </ThemedText>
          <Progress.Bar
            progress={progress}
            color={theme.tint}
            height={14}
            borderRadius={10}
            width={null}
            style={{ marginTop: 8 }}
          />
          <ThemedText style={styles.progressLabel}>
            {progress >= 1
              ? "✅ Goal completed!"
              : `You need $${(goal.target_amount - goal.saved_amount).toFixed(2)} more`}
          </ThemedText>

          {/* Goal Details */}
          <View style={styles.detailsBox}>
            <Text style={styles.detailItem}>Target Amount: ${goal.target_amount.toFixed(2)}</Text>
            <Text style={styles.detailItem}>Saved Amount: ${goal.saved_amount.toFixed(2)}</Text>
            <Text style={styles.detailItem}>Target Date: {new Date(goal.target_date).toDateString()}</Text>
            <Text style={styles.detailItem}>Priority: {goal.priority}</Text>
          </View>

          {/* Edit & Delete Buttons */}
          <View style={styles.buttonRow}>
            <ThemedButton onPress={() => router.push({ pathname: "/edit_goal", params: { id: goal.id } })} style={[styles.button, styles.modifyBtn]}>
              <ThemedText style={styles.buttonText}>Edit</ThemedText>
            </ThemedButton>
            <ThemedButton
              onPress={() =>
                Alert.alert(
                  "Confirm Delete",
                  "Are you sure you want to delete this goal?",
                  [
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
                  ]
                )
              }
              style={[styles.button, styles.deleteBtn]}
            >
              <ThemedText style={styles.buttonText}>Delete</ThemedText>
            </ThemedButton>
          </View>

          {/* Linked Transactions Placeholder */}
          <ThemedText title style={styles.sectionTitle}>Linked Transactions</ThemedText>
          <ThemedText style={{ fontSize: 14, color: theme.icon }}>
            No linked transactions yet.
          </ThemedText>
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