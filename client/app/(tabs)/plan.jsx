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

const tips = [
  "Track your spending daily for better control.",
  "Set realistic goals to stay motivated.",
  "Review your budget weekly and adjust accordingly.",
  "Automate savings to build discipline.",
  "Avoid impulse purchases by planning ahead.",
];

export default function Plan() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyAvgExpenses, setMonthlyAvgExpenses] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      setLoading(false);
      return;
    }

    const [goalsResponse, budgetsResponse, incomeResponse, expensesResponse] = await Promise.all([
      supabase.from("goals").select("*").eq("user_id", user.id),
      supabase.from("budgets").select("*").eq("user_id", user.id),
      supabase.from("income").select("amount").eq("user_id", user.id),
      supabase.from("expenses").select("amount, category, date").eq("user_id", user.id),
    ]);

    const goalsData = goalsResponse.data || [];
    const budgetsData = budgetsResponse.data || [];
    const incomeData = incomeResponse.data || [];
    const expensesData = expensesResponse.data || [];

    // Calculate total income and total expenses
    const totalIncome = incomeData.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.amount, 0);

    const computedBalance = totalIncome - totalExpenses;
    setTotalBalance(computedBalance);

    // Calculate spent amount for each budget
    const updatedBudgets = budgetsData.map((budget) => {
      const start = new Date(budget.start_date);
      const end = new Date(budget.end_date);

      const spent_amount = expensesData
        .filter(exp =>
          exp.category === budget.category &&
          new Date(exp.date) >= start &&
          new Date(exp.date) <= end
        )
        .reduce((sum, exp) => sum + exp.amount, 0);

      return { ...budget, spent_amount };
    });

    // Calculate average monthly expenses (for emergency fund)
    let expensesByMonth = {};
    expensesData.forEach((exp) => {
      const dt = new Date(exp.date);
      const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
      expensesByMonth[key] = (expensesByMonth[key] || 0) + exp.amount;
    });
    const monthsCount = Object.keys(expensesByMonth).length || 1;
    const avgMonthly = Object.values(expensesByMonth).reduce((a, b) => a + b, 0) / monthsCount;
    setMonthlyAvgExpenses(avgMonthly);

    setGoals(goalsData);
    setBudgets(updatedBudgets);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Progress summary calculations
  const activeGoalsCount = goals.length;
  const completedGoalsCount = goals.filter(g => g.saved_amount >= g.target_amount).length;
  const avgProgress =
    activeGoalsCount > 0
      ? goals.reduce((sum, g) => sum + (g.saved_amount / g.target_amount || 0), 0) /
        activeGoalsCount
      : 0;

  let motivationalQuote = "Let's get started!";
  if (avgProgress > 0.25 && avgProgress <= 0.5) motivationalQuote = "Making great progress!";
  else if (avgProgress > 0.5 && avgProgress <= 0.75) motivationalQuote = "You're over halfway there!";
  else if (avgProgress > 0.75 && avgProgress < 1) motivationalQuote = "You're almost there!";
  else if (avgProgress >= 1) motivationalQuote = "Goal achieved! 🎉";

  // Tip of the Day (random)
  const tipOfTheDay = tips[Math.floor(Math.random() * tips.length)];

  // Emergency Fund calculations
  const emergencyTarget = monthlyAvgExpenses * 3; // avg monthly expenses * 3
  const emergencyProgress = emergencyTarget ? Math.min(totalBalance / emergencyTarget, 1) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          {/* Page Heading */}
          <ThemedText title style={styles.pageHeading}>
            My Savings
          </ThemedText>

          {/* Progress Summary Cards */}
          <ThemedView style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <ThemedView style={[styles.summaryCard, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
              <ThemedText style={styles.summaryNumber}>{activeGoalsCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Active Goals</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.summaryCard, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
              <ThemedText style={styles.summaryNumber}>{completedGoalsCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Completed Goals</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.summaryCard, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
              <ThemedText style={styles.summaryNumber}>{Math.round(avgProgress * 100)}%</ThemedText>
              <ThemedText style={styles.summaryLabel}>Average Progress</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Motivational Quote */}
          <ThemedText style={{ fontStyle: "italic", fontSize: 16, marginBottom: 12, color: theme.tint, textAlign: "center" }}>
            {motivationalQuote}
          </ThemedText>

          {/* Goals Section */}
          <ThemedText title style={styles.sectionTitle}>My Goals</ThemedText>
          {goals.length === 0 && (
            <ThemedText style={{ textAlign: "center", marginBottom: 12, color: theme.text }}>
              No goals yet. Tap “+ Add Goal” to create one.
            </ThemedText>
          )}
          {goals.map(g => {
            const progress = g.target_amount ? Math.min(g.saved_amount / g.target_amount, 1) : 0;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => router.push({ pathname: "/goal_details", params: { id: g.id } })}
              >
                <View style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
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

                  {g.monthly_saving && g.monthly_saving > 0 && progress < 1 && (
                    <>
                      <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                        Currently saving ${g.monthly_saving}/month. You have {Math.ceil((g.target_amount - g.saved_amount) / g.monthly_saving)} months left!
                      </ThemedText>
                      {g.created_at && (
                        <ThemedText style={{ fontSize: 12, color: theme.icon, marginTop: 4 }}>
                          Estimated completion: {new Date(new Date(g.created_at).getTime() + Math.ceil((g.target_amount - g.saved_amount) / g.monthly_saving) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </ThemedText>
                      )}
                    </>
                  )}
                </View>
            </TouchableOpacity>
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
              <TouchableOpacity
                key={b.id}
                onPress={() => router.push({ pathname: "/budget_details", params: { id: b.id } })}
              >
                <View style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
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
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.tint, marginBottom: 40 }]}
            onPress={() => router.push("/add_budget")}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>+ Add Budget</ThemedText>
          </TouchableOpacity>

          {/* Emergency Fund Section */}
          <ThemedText title style={[styles.sectionTitle]}>Emergency Fund</ThemedText>
          <View style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
            <ThemedText>Total Balance:</ThemedText>
            <ThemedText style={{ fontWeight: "bold", fontSize: 18, marginVertical: 8 }}>
              ${totalBalance.toFixed(2)}
            </ThemedText>

            <ThemedText>Recommended Emergency Fund:</ThemedText>
            <ThemedText style={{ fontWeight: "bold", fontSize: 18, marginVertical: 8 }}>
              ${emergencyTarget.toFixed(2)}
            </ThemedText>

            <Progress.Bar
              progress={emergencyProgress}
              color={theme.tint}
              width={Dimensions.get("window").width - 80}
              height={12}
              style={{ borderRadius: 6 }}
            />

            <ThemedText style={{ marginTop: 8, fontSize: 14 }}>
              {emergencyProgress >= 1
                ? "Great! Your emergency fund goal is met! 🎉"
                : `You're ${(emergencyProgress * 100).toFixed(1)}% there!`}
            </ThemedText>
          </View>

          {/* Tip of the Day */}
          <ThemedText title style={[styles.sectionTitle, { marginTop: 40 }]}>Tip of the Day</ThemedText>
          <ThemedView style={[styles.card, { backgroundColor: theme.uibackground, borderColor: theme.border }]}>
            <ThemedText style={{ fontStyle: "italic", fontSize: 15, color: theme.tint }}>
              "{tipOfTheDay}"
            </ThemedText>
          </ThemedView>

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
  pageHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});