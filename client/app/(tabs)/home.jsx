import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../../lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";

const iconMap = {
  Food: "food-bank",
  Grocery: "local-grocery-store",
  Transport: "emoji-transportation",
  Travel: "flight",
  // Add more category-to-icon mappings
};

const baseUrl =
  process.env.EXPO_PUBLIC_ENV === "production"
    ? "https://ka-ching.onrender.com"
    : Platform.OS === "android"
    ? "http://10.0.2.2:4000"
    : "http://localhost:4000";

const Home = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter()

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

  // Fetch expenses when focused
  const fetchExpenses = useCallback(async () => {
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user;
  
    if (userError || !user) {
      console.error("User not logged in or error fetching user:", userError);
      return;
    }
  
    // Fetch expenses
    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id);
  
    // Fetch income
    const { data: incomeData, error: incomeError } = await supabase
      .from("income")
      .select("*")
      .eq("user_id", user.id);
  
    if (expensesError || incomeError) {
      console.error("❌ Error fetching transactions:", expensesError?.message, incomeError?.message);
      return;
    }
  
    setExpenses(expensesData || []);
  
    const totalExpenses = (expensesData || []).reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = (incomeData || []).reduce((sum, item) => sum + item.amount, 0);

    setExpenses(expensesData || []);
    setTotalExpenses(totalExpenses);
    setTotalIncome(totalIncome);
    setBalance(totalIncome - totalExpenses);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const containerBg = colorScheme === "dark" ? "#2f2b3d" : "#fff";
  const iconColor = colorScheme === "dark" ? "#FFFFFF" : "#333333";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background}}>
      <ThemedView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ThemedText title style={styles.welcomeText}>
          Hello {username}!
        </ThemedText>

        <View style={[styles.balanceCard, { backgroundColor: containerBg }]}>
          <View>
            <ThemedText style={{ fontWeight: 'bold' }}>Total Balance</ThemedText>
            <ThemedText style={styles.balanceText}>${balance.toFixed(2)}</ThemedText>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddOptions(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <TouchableOpacity
            style={[styles.smallCard, { backgroundColor: containerBg }]}
            onPress={() => router.push("/expenses")}
          >
            <ThemedText style={{ fontWeight: 'bold' }}>Total Expenses</ThemedText>
            <ThemedText style={styles.redText}>-${totalExpenses.toFixed(2)}</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallCard, { backgroundColor: containerBg }]}
            onPress={() => router.push("/income")}
          >
            <ThemedText style={{ fontWeight: 'bold' }}>Total Income</ThemedText>
            <ThemedText style={styles.greenText}>+${totalIncome.toFixed(2)}</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText title style={styles.recentTitle}>
          Recent Activity
        </ThemedText>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/expense_details",
                  params: {
                    id: item.id,
                    title: item.title,
                    amount: item.amount,
                    date: item.date,
                    category: item.category,
                    note: item.note,
                  },
                })
              }
            >
              <View
                style={[styles.activityItem, { backgroundColor: containerBg }]}
              >
                <View style={styles.activityLeft}>
                  <MaterialIcons
                    name={iconMap[item.category] || "payment"} // fallback icon
                    size={24}
                    color={iconColor}
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <ThemedText>{item.title || item.category}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: "gray" }}>
                      {item.category}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <ThemedText>${item.amount.toFixed(2)}</ThemedText>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.icon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No expenses found.
            </ThemedText>
          }
        />
        {showAddOptions && (
  <View style={styles.overlay}>
    <View style={styles.modal}>
      <TouchableOpacity
        style={styles.modalBtn}
        onPress={() => {
          setShowAddOptions(false);
          router.push('/add_expense');
        }}
      >
        <ThemedText>Add Expense</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalBtn}
        onPress={() => {
          setShowAddOptions(false);
          router.push('/add_income');
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
    </View>
  </View>
)}
      </ThemedView>
    </SafeAreaView>
  );
};

export default Home;

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
  redText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
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
    color: Colors.primary,
    marginTop: 5,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  smallCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  greenText: {
    color: Colors.primary,
    fontWeight: "bold",
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 18,
    marginVertical: 15,
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
    backgroundColor: "#fff",
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
  
});
