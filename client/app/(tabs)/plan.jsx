import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";

export default function GoalsAndBudgets() {
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchGoalsAndBudgets = async () => {
      const { data: goalData } = await supabase.from("goals").select("*");
      const { data: budgetData } = await supabase.from("budgets").select("*");
      setGoals(goalData || []);
      setBudgets(budgetData || []);
    };
    fetchGoalsAndBudgets();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          {/* Goals Section */}
          <ThemedText title style={styles.sectionTitle}>My Savings Goals</ThemedText>
          {goals.map(goal => {
            const progress = Math.min(goal.saved_amount / goal.target_amount, 1);
            return (
              <View key={goal.id} style={styles.card}>
                <ThemedText>{goal.name}</ThemedText>
                <ThemedText style={{ fontSize: 13 }}>
                  ${goal.saved_amount} / ${goal.target_amount}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={theme.tint}
                  height={12}
                  style={{ marginTop: 8 }}
                />
                <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                  {progress * 100 >= 100
                    ? "✅ Goal reached!"
                    : `Still need $${(goal.target_amount - goal.saved_amount).toFixed(2)}`}
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
          <ThemedText title style={styles.sectionTitle}>My Budgets</ThemedText>
          {budgets.map(budget => {
            const progress = Math.min(budget.spent / budget.limit, 1);
            return (
              <View key={budget.id} style={styles.card}>
                <ThemedText>{budget.category}</ThemedText>
                <ThemedText style={{ fontSize: 13 }}>
                  ${budget.spent} / ${budget.limit}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={"red"}
                  height={12}
                  style={{ marginTop: 8 }}
                />
                <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                  {progress >= 1
                    ? "⚠️ Over budget!"
                    : `You have $${(budget.limit - budget.spent).toFixed(2)} left`}
                </ThemedText>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: "green" }]}
            onPress={() => router.push("/add_budget")}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>Add Budget</ThemedText>
          </TouchableOpacity>

          {/* Insights / Recommendations */}
          <ThemedText title style={styles.sectionTitle}>Insights</ThemedText>
          <ThemedText style={{ fontSize: 14, marginBottom: 20 }}>
            {budgets.some(b => b.spent > b.limit)
              ? "You have exceeded one or more budgets this month."
              : "You're on track with all your budgets!"}
          </ThemedText>
          {goals.map(goal => {
            const monthsLeft = Math.ceil(
              (goal.target_amount - goal.saved_amount) / (goal.monthly_contribution || 1)
            );
            return (
              <ThemedText key={goal.id} style={{ fontSize: 14 }}>
                {goal.saved_amount >= goal.target_amount
                  ? `🎉 You've hit your ${goal.name} goal!`
                  : `At this rate, you'll reach your ${goal.name} goal in ${monthsLeft} months.`}
              </ThemedText>
            );
          })}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginTop:20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  addBtn: {
    padding: 14,
    borderRadius: 20,
    marginTop: 8,
    alignItems: "center",
  },
});
