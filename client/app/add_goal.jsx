import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";

export default function AddGoal() {
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState("");

  const handleSave = async () => {
    const parsedTarget = parseFloat(targetAmount);
    const parsedSaved = parseFloat(savedAmount || "0");

    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid target amount.");
      return;
    }

    if (!priority) {
      Alert.alert("Priority Required", "Please select a priority for this goal.");
      return;
    }

    const progress = parsedSaved / parsedTarget;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Authentication Error", "You must be logged in.");
      return;
    }

    const { error } = await supabase.from("goals").insert({
      name,
      user_id: user.id,
      target_amount: parsedTarget,
      saved_amount: parsedSaved,
      progress,
      target_date: targetDate.toISOString(),
      priority,
    });

    if (error) {
      console.error("Error adding goal:", error);
      Alert.alert("Error", "Failed to save goal.");
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

        <ThemedText title style={styles.header}>Add a New Goal</ThemedText>

        <ThemedTextInput
          placeholder="Goal name (e.g. House, Car, Wedding)"
          value={name}
          onChangeText={setName}
          style={[styles.input, { borderColor: theme.icon, borderWidth: 1 }]}
        />

        <ThemedTextInput
          placeholder="Target amount"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: theme.icon, borderWidth: 1 }]}
        />

        <ThemedTextInput
          placeholder="Amount already saved (optional)"
          value={savedAmount}
          onChangeText={setSavedAmount}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: theme.icon, borderWidth: 1 }]}
        />

        {/* Priority Selector */}
        <ModalSelector
          data={[
            { key: "High", label: "High" },
            { key: "Medium", label: "Medium" },
            { key: "Low", label: "Low" },
          ]}
          initValue="Select Priority"
          onChange={(option) => setPriority(option.key)}
          style={[styles.selector, { borderColor: theme.icon, borderWidth: 1 }]}
          initValueTextStyle={{ color: priority ? theme.text : "#999" }}
          selectTextStyle={{ color: theme.text, padding: 10 }}
          optionTextStyle={{ color: theme.text }}
          optionContainerStyle={{ backgroundColor: theme.background }}
          cancelTextStyle={{ color: theme.text }}
        >
          <ThemedText>
            {priority || "Select Priority"}
          </ThemedText>
        </ModalSelector>

        {/* Date Picker */}
        <TouchableOpacity
          style={[styles.dateInput, { borderColor: theme.icon, backgroundColor: theme.uibackground }]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText>{targetDate.toDateString()}</ThemedText>
          <Ionicons name="calendar-outline" size={20} color={theme.icon} />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={targetDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setTargetDate(selectedDate);
            }}
          />
        )}

        <ThemedButton onPress={handleSave}>
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
            Save Goal
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 12 },
  header: { fontSize: 20, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  input: { marginBottom: 16, borderRadius: 6, padding: 16 },
  selector: { marginBottom: 16, borderRadius: 6 },
  dateInput: {
    padding: 18,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
