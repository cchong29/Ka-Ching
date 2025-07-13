import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
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

export default function EditGoal() {
  const { id } = useLocalSearchParams();
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();

  const [goal, setGoal] = useState(null);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [priority, setPriority] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Error", "Failed to fetch goal.");
        return;
      }

      setGoal(data);
      setName(data.name);
      setTargetAmount(String(data.target_amount));
      setSavedAmount(String(data.saved_amount));
      setPriority(data.priority);
      setTargetDate(new Date(data.target_date));
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async () => {
    const parsedTarget = parseFloat(targetAmount);
    const parsedSaved = parseFloat(savedAmount || "0");

    if (!name || isNaN(parsedTarget) || parsedTarget <= 0) {
      Alert.alert("Invalid input", "Please enter valid goal details.");
      return;
    }

    const progress = parsedSaved / parsedTarget;

    const { error } = await supabase
      .from("goals")
      .update({
        name,
        target_amount: parsedTarget,
        saved_amount: parsedSaved,
        target_date: targetDate.toISOString(),
        priority,
        progress,
      })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", "Failed to update goal.");
    } else {
      router.back();
    }
  };

  if (!goal) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.title}>Edit Goal</ThemedText>

        <ThemedTextInput
          placeholder="Goal name"
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
          placeholder="Amount already saved"
          value={savedAmount}
          onChangeText={setSavedAmount}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: theme.icon, borderWidth: 1 }]}
        />

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
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setTargetDate(date);
            }}
          />
        )}

        <ThemedButton onPress={handleUpdate}>
          <ThemedText style={{ color: "#fff", fontWeight: "bold", textAlign: "center", width: "100%" }}>
            Save Changes
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 12 },
  title: { fontSize: 20, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
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