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
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          {/* Goals */}
          <ThemedText title style={styles.sectionTitle}>My Savings Goals</ThemedText>
          {goals.map((goal) => {
            const progress = Math.min(goal.saved_amount / goal.target_amount, 1);
            return (
              <View key={goal.id} style={[styles.card, { backgroundColor: theme.uibackground }]}>
                <ThemedText style={styles.cardTitle}>{goal.name}</ThemedText>
                <ThemedText style={styles.cardSub}>
                  ${goal.saved_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={theme.tint}
                  unfilledColor={"#dcdcdc"}
                  borderWidth={0}
                  width={null}
                  height={10}
                  borderRadius={6}
                  style={{ marginTop: 8 }}
                />
                <ThemedText style={styles.progressLabel}>
                  {progress === 1
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
            <ThemedText style={styles.addBtnText}>+ Add Goal</ThemedText>
          </TouchableOpacity>

          {/* Budgets */}
          <ThemedText title style={styles.sectionTitle}>My Budgets</ThemedText>
          {budgets.map((budget) => {
            const progress = Math.min(budget.spent / budget.limit, 1);
            const isOver = progress >= 1;
            return (
              <View key={budget.id} style={[styles.card, { backgroundColor: theme.uibackground }]}>
                <ThemedText style={styles.cardTitle}>{budget.category}</ThemedText>
                <ThemedText style={styles.cardSub}>
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </ThemedText>
                <Progress.Bar
                  progress={progress}
                  color={isOver ? "#ff4d4f" : "#4caf50"}
                  unfilledColor={"#dcdcdc"}
                  borderWidth={0}
                  width={null}
                  height={10}
                  borderRadius={6}
                  style={{ marginTop: 8 }}
                />
                <ThemedText style={styles.progressLabel}>
                  {isOver
                    ? "⚠️ Over budget!"
                    : `You have $${(budget.limit - budget.spent).toFixed(2)} left`}
                </ThemedText>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: "#4caf50" }]}
            onPress={() => router.push("/add_budget")}
          >
            <ThemedText style={styles.addBtnText}>+ Add Budget</ThemedText>
          </TouchableOpacity>

          {/* Insights */}
          <ThemedText title style={styles.sectionTitle}>Insights</ThemedText>
          <View style={[styles.card, { backgroundColor: theme.uibackground }]}>
            <ThemedText style={styles.insightText}>
              {budgets.some(b => b.spent > b.limit)
                ? "You’ve exceeded one or more budgets this month."
                : "✅ You’re on track with all your budgets!"}
            </ThemedText>
            {goals.map(goal => {
              const monthsLeft = Math.ceil(
                (goal.target_amount - goal.saved_amount) / (goal.monthly_contribution || 1)
              );
              return (
                <ThemedText key={goal.id} style={styles.insightText}>
                  {goal.saved_amount >= goal.target_amount
                    ? `🎉 You've hit your ${goal.name} goal!`
                    : `At this rate, you'll reach your ${goal.name} goal in ${monthsLeft} month(s).`}
                </ThemedText>
              );
            })}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  backBtn: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  cardSub: {
    fontSize: 13,
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  addBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: 10,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  insightText: {
    fontSize: 13,
    marginBottom: 6,
  },
});