import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";

export default function AddBudget() {
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Enter a valid budget amount.");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Authentication Error", "You must be logged in.");
      return;
    }

    const { error } = await supabase.from("budgets").insert({
      name,
      amount: parsedAmount,
      category,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      user_id: user.id,
    });

    if (error) {
      console.error("Error saving budget:", error.message);
      alert("Failed to save budget.");
      return;
    }

    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.header}>Add a New Budget</ThemedText>

        <ThemedTextInput
          placeholder="Budget name (e.g. Monthly Groceries)"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <ThemedTextInput
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <ThemedTextInput
          placeholder="Category (optional)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        {/* Start date picker */}
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={[styles.dateInput, { borderColor: theme.icon, backgroundColor: theme.uibackground }]}
        >
          <ThemedText>{`Start: ${startDate.toDateString()}`}</ThemedText>
          <Ionicons name="calendar-outline" size={20} color={theme.icon} />
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End date picker */}
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={[styles.dateInput, { borderColor: theme.icon, backgroundColor: theme.uibackground }]}
        >
          <ThemedText>{`End: ${endDate.toDateString()}`}</ThemedText>
          <Ionicons name="calendar-outline" size={20} color={theme.icon} />
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <ThemedButton onPress={handleSave}>
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
            Save Budget
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 12 },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: { marginBottom: 16 },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});
