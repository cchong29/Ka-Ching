import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const iconMap = {
  Food: "food-bank",
  Grocery: "local-grocery-store",
  Transport: "emoji-transportation",
  Travel: "flight",
};

const baseUrl =
  process.env.EXPO_PUBLIC_ENV === "production"
    ? "https://ka-ching.onrender.com"
    : Platform.OS === "android"
    ? "http://10.0.2.2:4000"
    : "http://localhost:4000";

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [recentIncome, setRecentIncome] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [goalSavings, setGoalSavings] = useState(0);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (accessToken) {
        const res = await fetch(`${baseUrl}/user/username`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await res.json();
        setUsername(json.name);
      }
    };
    fetchUserName();
  }, []);

  const fetchHomeData = useCallback(async () => {
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;
  
    // 2. Fetch expenses (latest 10)
    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("id, amount, date, note, category, title")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(10);
  
    // 3. Fetch income (latest 10)
    const { data: incomeData, error: incomeError } = await supabase
      .from("income")
      .select("id, amount, date, note, category, title")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(10);
  
    // 4. Fetch goals (include created_at for month calc)
    const { data: goalsData, error: goalsError } = await supabase
      .from("goals")
      .select("id, monthly_saving, created_at")
      .eq("user_id", user.id);
  
    // 5. Fetch linked transactions (money put into goals)
    // Assuming linked_transactions has created_at or date, and amount comes from income linked
    const { data: linkedTxData, error: linkedTxError } = await supabase
      .from("linked_transactions")
      .select(`
        id,
        goal_id,
        income:income_id (
          amount,
          date,
          note
        ),
        goal:goal_id (
          name
        )
      `)
      .eq("user_id", user.id);
  
    if (expensesError || incomeError || goalsError || linkedTxError) {
      console.error("Error fetching data", {
        expensesError,
        incomeError,
        goalsError,
        linkedTxError,
      });
      return;
    }
  
    // Total expenses and income calculations as before
    const totalExpenses = (expensesData || []).reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = (incomeData || []).reduce((sum, item) => sum + item.amount, 0);
  
    // Sum linked transaction amounts per goal for totalGoalSavings as before
    const linkedTxSums = linkedTxData?.reduce((acc, tx) => {
      acc[tx.goal_id] = (acc[tx.goal_id] || 0) + (tx.income?.amount || 0);
      return acc;
    }, {}) || {};
  
    const now = new Date();
    let totalGoalSavings = 0;
  
    if (goalsData) {
      for (const goal of goalsData) {
        const linkedAmount = linkedTxSums[goal.id] || 0;
  
        let manualSavings = 0;
        if (goal.created_at) {
          const createdDate = new Date(goal.created_at);
          const monthsElapsed = Math.max(
            0,
            (now.getFullYear() - createdDate.getFullYear()) * 12 +
              (now.getMonth() - createdDate.getMonth())
          );
          manualSavings = (goal.monthly_saving || 0) * monthsElapsed;
        }
  
        totalGoalSavings += linkedAmount + manualSavings;
      }
    }
  
    // Combine recent activity: expenses, income, linked transactions (goal savings)
    const allRecentActivity = [
      ...(expensesData || []).map(item => ({
        ...item,
        type: "expense",
        date: item.date, // use this as the datetime for sorting
        id: item.id.toString(),
      })),
      ...(incomeData || []).map(item => ({
        ...item,
        type: "income",
        date: item.date,
        id: item.id.toString(),
      })),
      ...(linkedTxData || []).map(item => ({
        id: item.id.toString(),
        type: "goal_saving",
        amount: item.income?.amount || 0,
        date: item.income?.date,
        note: item.goal?.name || "Goal saving",
        goal_id: item.goal_id,
      })),
    ];
  
    // Sort combined activities by date descending
    const sortedRecentActivity = allRecentActivity
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  
    setExpenses(expensesData || []);
    setRecentIncome(incomeData || []);
    setTotalExpenses(totalExpenses);
    setTotalIncome(totalIncome);
    setGoalSavings(totalGoalSavings);
    setBalance(totalIncome - totalExpenses);
    setRecentActivity(sortedRecentActivity);  // NEW state for combined recent activity
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [fetchHomeData])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <ThemedText title style={styles.welcomeText}>
          Hello {username}!
        </ThemedText>

        <ThemedView style={styles.balanceCard}>
          <View>
            <ThemedText style={styles.labelText}>Total Balance</ThemedText>
            <ThemedText style={[styles.balanceText, { color: Colors.primary }]}>
              ${balance.toFixed(2)}
            </ThemedText>

            <ThemedText style={styles.subLabel}>Available Balance</ThemedText>
            <ThemedText style={[styles.netBalanceText, { color: Colors.primary }]}>
              ${(balance - goalSavings).toFixed(2)}
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddOptions(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </ThemedView>

        <View style={styles.sectionRow}>
          <ThemedView style={styles.smallCard}>
            <TouchableOpacity onPress={() => router.push("/expenses")}>
              <ThemedText style={styles.labelText}>Total Expenses</ThemedText>
              <ThemedText style={{ color: 'red', fontWeight: 'bold', marginTop: 8 }}>
                -${totalExpenses.toFixed(2)}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.smallCard}>
            <TouchableOpacity onPress={() => router.push("/income")}>
              <ThemedText style={styles.labelText}>Total Income</ThemedText>
              <ThemedText style={{ color: Colors.primary, fontWeight: 'bold', marginTop: 8 }}>
                +${totalIncome.toFixed(2)}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.smallCard}>
            <TouchableOpacity onPress={() => router.push("/plan")}>
              <ThemedText style={styles.labelText}>Total Savings</ThemedText>
              <ThemedText style={{ color: '#f99500', fontWeight: 'bold', marginTop: 8 }}>
                ${goalSavings.toFixed(2)}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>

        <ThemedText title style={styles.recentTitle}>
          Recent Activity
        </ThemedText>

        <FlatList
          data={recentActivity}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const iconName =
              item.type === "expense"
                ? iconMap[item.category] || "payment"
                : item.type === "income"
                ? "attach-money"
                : item.type === "goal"
                ? "savings"
                : "track-changes";
          
            const formattedDate = item.date ? new Date(item.date).toLocaleDateString() : "";
          
            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname:
                      item.type === "expense"
                        ? "/expense_details"
                        : item.type === "income"
                        ? "/income_details"
                        : "/goal_details",
                    params: { ...item },
                  })
                }
              >
                <ThemedView style={styles.activityItem}>
                  <View style={styles.activityLeft}>
                    <MaterialIcons
                      name={iconName}
                      size={24}
                      color={theme.icon}
                      style={{ marginRight: 10 }}
                    />
                    <View>
                      <ThemedText style={{ fontWeight: 'bold' }}>
                        {item.title || item.note || item.category || item.type}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 12, color: theme.icon }}>
                        {formattedDate}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.activityRight}>
                    <ThemedText style={{ color: item.type === "income" ? "green" : "red" }}>
                      {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
                    </ThemedText>
                    <Ionicons name="chevron-forward" size={16} color={theme.icon} />
                  </View>
                </ThemedView>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No recent activity found.
            </ThemedText>
          }
        />

        {showAddOptions && (
          <View style={styles.overlay}>
            <ThemedView style={styles.modal}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowAddOptions(false);
                  router.push("/add_expense");
                }}
              >
                <ThemedText>Add Expense</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowAddOptions(false);
                  router.push("/add_income");
                }}
              >
                <ThemedText>Add Income</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddOptions(false)}
                style={styles.modalCancel}
              >
                <ThemedText style={{ color: 'red' }}>Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        )}
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceCard: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12, // Optional for spacing
  },
  smallCard: {
    width: '30%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2, // or shadow props for iOS
  },
  recentTitle: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: 'bold'
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
    alignItems: "center",
  },
  modalBtn: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  modalCancel: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  subLabel: {
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 14,
    color: "gray",
  },
  savingsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  netBalanceText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
});