import { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, View, Alert, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";

import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

export default function LinkTransactions() {
    const { goal_id } = useLocalSearchParams();
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [selectedTransactions, setSelectedTransactions] = useState(new Set());
    const theme = Colors[useColorScheme() ?? "light"];
    const router = useRouter();
  
    useEffect(() => {
      const fetchIncome = async () => {
        const { data } = await supabase.from("income").select("*");
        setIncomeTransactions(data || []);
      };
      fetchIncome();
    }, []);
  
    const toggleSelect = (id) => {
      setSelectedTransactions((prev) => {
        const copy = new Set(prev);
        if (copy.has(id)) copy.delete(id);
        else copy.add(id);
        return copy;
      });
    };
  
    const linkSelected = async () => {
      if (selectedTransactions.size === 0) {
        Alert.alert("Select Transactions", "Please select at least one transaction to link.");
        return;
      }
  
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Error", "Unable to get user.");
        return;
      }
  
      const inserts = Array.from(selectedTransactions).map((id) => ({
        goal_id,
        income_id: id,
        user_id: user.id,
      }));
  
      const { error } = await supabase.from("linked_transactions").insert(inserts);
  
      if (error) {
        console.error("Insert error:", error);
        Alert.alert("Error", error.message || "Failed to link transactions.");
      } else {
        Alert.alert("Success", "Transactions linked successfully.", [
          { text: "OK", onPress: () => router.push({ pathname: "/goal_details", params: { id: goal_id } }) },
        ]);
      }
    };
  
    // ✅ THIS RETURN MUST BE INSIDE THE FUNCTION
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ThemedView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.icon} />
            </TouchableOpacity>
  
            <ThemedText title style={styles.title}>
              Select Transactions to Link
            </ThemedText>
  
            {incomeTransactions.length === 0 && (
              <ThemedText style={{ fontSize: 14, color: theme.icon, marginTop: 20 }}>
                No income transactions found.
              </ThemedText>
            )}
  
            {incomeTransactions.map((t) => {
              const selected = selectedTransactions.has(t.id);
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => toggleSelect(t.id)}
                  style={[
                    styles.transactionItem,
                    { backgroundColor: selected ? theme.tint : "#eee" },
                  ]}
                >
                  <Text style={{ color: selected ? "#fff" : "#000" }}>
                    {t.description} - ${t.amount.toFixed(2)}
                  </Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color="#fff" />}
                </TouchableOpacity>
              );
            })}
  
            <ThemedButton
              onPress={linkSelected}
              style={[styles.button, { marginTop: 30, backgroundColor: theme.tint }]}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>Link Selected</ThemedText>
            </ThemedButton>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backBtn: { marginTop: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
    transactionItem: {
      padding: 12,
      marginVertical: 6,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    button: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
  });