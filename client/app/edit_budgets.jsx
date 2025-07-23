import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector";

import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";

export default function EditBudgets() {
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();
  const params = useLocalSearchParams();

  const [name, setName] = useState(params.name || "");
  const [amount, setAmount] = useState(params.amount?.toString() || "");
  const [category, setCategory] = useState(params.category || "");
  const [startDate, setStartDate] = useState(
    params.start_date ? new Date(params.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState(
    params.end_date ? new Date(params.end_date) : new Date()
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid number.");
      return;
    }

    const { error } = await supabase
      .from("budgets")
      .update({
        name,
        amount: parsedAmount,
        category,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .eq("id", params.id);

    if (error) {
      Alert.alert("Error", "Failed to update budget.");
      return;
    }

    setSuccessMessage("✅ Budget updated!");

    setTimeout(() => {
      setSuccessMessage("");
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.header}>Edit Budget</ThemedText>

        <ThemedTextInput
          placeholder="Budget name"
          value={name}
          onChangeText={setName}
          style={[styles.input, { borderColor: theme.icon }]}
        />

        <ThemedTextInput
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          style={[styles.input, { borderColor: theme.icon }]}
        />

        {/* Category Selector */}
        <View style={[styles.dateInput, { backgroundColor: theme.uibackground, borderColor: theme.icon }]}>
          <ModalSelector
            data={[
              { key: "Food", label: "Food" },
              { key: "Transport", label: "Transport" },
              { key: "Shopping", label: "Shopping" },
              { key: "Travel", label: "Travel" },
              { key: "Bills", label: "Bills" },
              { key: "Others", label: "Others" },
            ]}
            initValue="Select a category"
            selectedKey={category}
            onChange={(option) => setCategory(option.key)}
            optionTextStyle={{ color: theme.text }}
            optionContainerStyle={{ backgroundColor: theme.background }}
            cancelStyle={{ backgroundColor: theme.background }}
            cancelTextStyle={{ color: theme.text }}
            initValueTextStyle={{ color: category ? theme.text : "#999999", fontSize: 16 }}
            selectTextStyle={{ color: theme.text, fontSize: 16 }}
            style={{ flex: 1 }}
          >
            <ThemedText>{category || "Select a category"}</ThemedText>
          </ModalSelector>

          <Ionicons name="chevron-down" size={20} color={theme.icon} />
        </View>

        {/* Start Date */}
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
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End Date */}
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
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {successMessage !== "" && (
          <ThemedText style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
            {successMessage}
          </ThemedText>
        )}

        <ThemedButton onPress={handleUpdate}>
          <ThemedText style={styles.btnText}>Update Budget</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
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