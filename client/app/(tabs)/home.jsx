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
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

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

  const fetchExpenses = useCallback(async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;

    const { data: expensesData } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(10);

    const { data: incomeData } = await supabase
      .from("income")
      .select("*")
      .eq("user_id", user.id);

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
                  params: { ...item },
                })
              }
            >
              <ThemedView style={styles.activityItem}>
                <View style={styles.activityLeft}>
                  <MaterialIcons
                    name={iconMap[item.category] || "payment"}
                    size={24}
                    color={theme.icon}
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <ThemedText>{item.title || item.category}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: theme.icon }}>
                      {item.category}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <ThemedText>${item.amount.toFixed(2)}</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color={theme.icon} />
                </View>
              </ThemedView>
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