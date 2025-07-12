import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import * as Progress from "react-native-progress";

import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export default function Plan() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Fetch from Supabase
  const fetchData = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) return;
  
    // Fetch budgets and goals for user
    const [{ data: goalsData }, { data: budgetsData }] = await Promise.all([
      supabase.from("goals").select("*").eq("user_id", user.id),
      supabase.from("budgets").select("*").eq("user_id", user.id),
    ]);
  
    // Fetch all expenses for user
    const { data: expensesData } = await supabase.from("expenses").select("*").eq("user_id", user.id);
  
    // Calculate spent_amount per budget by summing expenses matching budget category & within budget timeframe
    const updatedBudgets = budgetsData.map((budget) => {
      // Parse dates from budget
      const start = new Date(budget.start_date);
      const end = new Date(budget.end_date);
  
      // Sum expenses amount matching category and date range
      const spent_amount = expensesData
        .filter(exp => 
          exp.category === budget.category &&
          new Date(exp.date) >= start &&
          new Date(exp.date) <= end
        )
        .reduce((sum, exp) => sum + exp.amount, 0);
  
      return { ...budget, spent_amount };
    });
  
    setGoals(goalsData || []);
    setBudgets(updatedBudgets || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          {/* Goals Section */}
          <ThemedText title style={styles.sectionTitle}>My Savings Goals</ThemedText>
          {goals.length === 0 && (
            <ThemedText style={{ textAlign: "center", marginBottom: 12, color: theme.text }}>
              No goals yet. Tap “+ Add Goal” to create one.
            </ThemedText>
          )}
          {goals.map(g => {
            const progress = g.target_amount ? Math.min(g.saved_amount / g.target_amount, 1) : 0;
            return (
              <View key={g.id} style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
                <ThemedText style={{ fontWeight: "600" }}>{g.name}</ThemedText>
                <ThemedText style={{ fontSize: 13, color: theme.icon }}>
                  ${g.saved_amount.toFixed(2)} / ${g.target_amount.toFixed(2)}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={theme.tint}
                  width={Dimensions.get("window").width - 80}
                  height={10}
                  style={{ marginTop: 8, borderRadius: 5 }}
                />
                <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                  {progress >= 1
                    ? "✅ Goal reached!"
                    : `You need $${(g.target_amount - g.saved_amount).toFixed(2)} more`}
                </ThemedText>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.tint }]}
            onPress={() => router.push("/add_goal")}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>+ Add Goal</ThemedText>
          </TouchableOpacity>

          {/* Budgets Section */}
          <ThemedText title style={[styles.sectionTitle, { marginTop: 30 }]}>My Budgets</ThemedText>
          {budgets.length === 0 && (
            <ThemedText style={{ textAlign: "center", marginBottom: 12, color: theme.text }}>
              No budgets yet. Tap “+ Add Budget” to create one.
            </ThemedText>
          )}
          {budgets.map(b => {
            const spent = b.spent_amount || 0;
            const limit = b.amount;
            const progress = limit ? Math.min(spent / limit, 1) : 0;
            return (
              <View key={b.id} style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
                <ThemedText style={{ fontWeight: "600" }}>{b.name}</ThemedText>
                <ThemedText style={{ fontSize: 13, color: theme.icon }}>
                  ${spent.toFixed(2)} / ${limit.toFixed(2)}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={progress >= 1 ? "red" : theme.tint}
                  width={Dimensions.get("window").width - 80}
                  height={10}
                  style={{ marginTop: 8, borderRadius: 5 }}
                />
                <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                  {progress >= 1
                    ? "⚠️ Over budget!"
                    : `You have $${(limit - spent).toFixed(2)} remaining`}
                </ThemedText>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.tint }]}
            onPress={() => router.push("/add_budget")}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>+ Add Budget</ThemedText>
          </TouchableOpacity>

        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backBtn: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
  },
  addBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
});