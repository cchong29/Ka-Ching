import React from "react";
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
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

export default function IncomeDetails() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const params = useLocalSearchParams();
  const router = useRouter();

  const [income, setIncome] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchIncome = async () => {
        const { data, error } = await supabase
          .from("income")
          .select("*")
          .eq("id", params.id)
          .single();


        if (error) {
          console.error("❌ Failed to fetch income:", error.message);
          return;
        }

        setIncome(data);
      };

      fetchIncome();
    }, [params.id])
  );

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this income?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("income")
                .delete()
                .eq("id", params.id);

              if (error) {
                console.error("❌ Delete failed:", error.message);
                Alert.alert("Error", "Could not delete income");
                return;
              }

              Alert.alert("Deleted", "Income has been deleted ✅", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err) {
              console.error("❌ Delete error:", err);
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleModify = () => {
    router.push({
      pathname: "/edit_income",
      params: {
        id: params.id,
        title: params.title,
        amount: params.amount,
        date: params.date,
        category: params.category,
        note: params.note,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        {income ? (
          <>
            <ThemedText title style={styles.title}>
              {income.title}
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
              <DetailRow
                label="Amount"
                value={`$${Number(income.amount).toFixed(2)}`}
              />
              <DetailRow
                label="Date"
                value={new Date(income.date).toDateString()}
              />
              <DetailRow label="Category" value={income.category} />
              <DetailRow label="Note" value={income.note || "—"} />
            </ThemedView>
          </>
        ) : (
          <ThemedText>Loading...</ThemedText>
        )}

        <View style={styles.buttonRow}>
          <ThemedButton
            onPress={handleModify}
            style={[styles.button, styles.modifyBtn]}
          >
            <ThemedText style={styles.buttonText}>Edit</ThemedText>
          </ThemedButton>
          <ThemedButton
            onPress={handleDelete}
            style={[styles.button, styles.deleteBtn]}
          >
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
