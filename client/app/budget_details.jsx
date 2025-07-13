import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

export default function BudgetDetails() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Error", "Failed to fetch budget");
      } else {
        setBudget(data);
      }
    };

    fetchBudget();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("budgets").delete().eq("id", id);
            if (error) {
              Alert.alert("Error", "Failed to delete budget");
            } else {
              Alert.alert("Deleted", "Budget deleted successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleModify = () => {
    router.push({
      pathname: "/edit_budgets",
      params: {
        id: budget.id,
        name: budget.name,
        category: budget.category,
        amount: budget.amount,
        start_date: budget.start_date,
        end_date: budget.end_date,
      },
    });
  };

  if (!budget) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.title}>
          {budget.name || budget.category}
        </ThemedText>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: theme.uibackground,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <DetailRow label="Category" value={budget.category} />
          <DetailRow label="Amount" value={`$${Number(budget.amount).toFixed(2)}`} />
          <DetailRow label="Start Date" value={new Date(budget.start_date).toDateString()} />
          <DetailRow label="End Date" value={new Date(budget.end_date).toDateString()} />
        </ThemedView>

        <View style={styles.buttonRow}>
          <ThemedButton onPress={handleModify} style={[styles.button, styles.modifyBtn]}>
            <ThemedText style={styles.buttonText}>Edit</ThemedText>
          </ThemedButton>
          <ThemedButton onPress={handleDelete} style={[styles.button, styles.deleteBtn]}>
            <ThemedText style={styles.buttonText}>Delete</ThemedText>
          </ThemedButton>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <ThemedText style={styles.label}>{label}:</ThemedText>
    <ThemedText style={styles.value}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
  },
  modifyBtn: {
    backgroundColor: "#137547",
  },
  deleteBtn: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});