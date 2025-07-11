import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import ModalSelector from "react-native-modal-selector";

import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";

export default function EditExpense() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [amount, setAmount] = useState(params.amount);
  const [category, setCategory] = useState(params.category);
  const [date, setDate] = useState(new Date(params.date));
  const [note, setNote] = useState(params.note || "");
  const [title, setTitle] = useState(params.title);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    const cleanAmount = String(amount).replace(/[^0-9.]/g, "");
    const parsedAmount = parseFloat(cleanAmount);
    if (isNaN(parsedAmount)) {
      Alert.alert("Invalid amount", "Please enter a valid number for amount.");
      return;
    }

    const { error } = await supabase
      .from("expenses")
      .update({
        title,
        amount: parsedAmount,
        category,
        date: date.toISOString(),
        note,
      })
      .eq("id", params.id);

    if (error) {
      Alert.alert("Error", "Failed to update expense.");
      console.error("Supabase update error:", error.message);
      return;
    }

    setSuccessMessage("✅ Expense updated!");
    setTimeout(() => {
      setSuccessMessage("");
      router.back();
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.icon} />
      </TouchableOpacity>

      <ThemedText title style={styles.header}>Edit Expense</ThemedText>

      <ThemedTextInput
        placeholder="$0.00"
        keyboardType="decimal-pad"
        value={String(amount)}
        onChangeText={setAmount}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <ThemedTextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <View
        style={[
          styles.dateInput,
          {
            backgroundColor: theme.uibackground,
            borderColor: theme.icon,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <ModalSelector
          data={[
            { key: "Food", label: "Food" },
            { key: "Grocery", label: "Grocery" },
            { key: "Transport", label: "Transport" },
            { key: "Travel", label: "Travel" },
            { key: "Bills", label: "Bills" },
            { key: "Shopping", label: "Shopping" },
            { key: "Others", label: "Others" },
          ]}
          initValue="Select a category"
          selectedKey={category}
          onChange={(option) => setCategory(option.key)}
          animationType="fade"
          optionTextStyle={{ color: theme.text }}
          optionContainerStyle={{
            backgroundColor: theme.background,
            borderRadius: 10,
          }}
          cancelStyle={{ backgroundColor: theme.background }}
          cancelTextStyle={{ color: theme.text }}
          initValueTextStyle={{
            color: category ? theme.text : "#999999",
            fontSize: 16,
          }}
          selectTextStyle={{
            color: theme.text,
            fontSize: 16,
          }}
          style={{ flex: 1 }}
        >
          <ThemedText>{category || "Select a category"}</ThemedText>
        </ModalSelector>

        <Ionicons name="chevron-down" size={20} color={theme.icon} />
      </View>

      <TouchableOpacity
        style={[
          styles.dateInput,
          {
            borderColor: theme.icon,
            backgroundColor: theme.uibackground,
          },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedText>{date.toDateString()}</ThemedText>
        <Ionicons name="calendar-outline" size={20} color={theme.icon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <ThemedTextInput
        placeholder="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
        style={[styles.input, { height: 80, borderColor: theme.icon }]}
      />

      {successMessage !== "" && (
        <ThemedText
          style={{ color: "green", textAlign: "center", marginBottom: 10 }}
        >
          {successMessage}
        </ThemedText>
      )}

      <ThemedButton onPress={handleUpdate}>
        <ThemedText style={styles.btnText}>Update Expense</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 6,
    padding: 18,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
