import { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector";

import { supabase } from "@/lib/supabase";
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
  const [priority, setPriority] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    const parsedTarget = parseFloat(targetAmount);
    const parsedSaved = parseFloat(savedAmount || "0");

    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter a goal name.");
      return;
    }

    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      Alert.alert("Invalid Target Amount", "Please enter a valid target amount.");
      return;
    }

    if (!priority) {
      Alert.alert("Priority Required", "Please select a priority for this goal.");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Authentication Error", "You must be logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("goals")
      .insert({
        name,
        user_id: user.id,
        target_amount: parsedTarget,
        saved_amount: parsedSaved,
        target_date: targetDate.toISOString(),
        priority,
      })
      .select()
      .single(); // fetch inserted row with ID

      if (error) {
        Alert.alert("Error", "Failed to save goal.");
        return;
      }
      
      // Navigate directly to the new goal
      router.push({
        pathname: "/goal_details",
        params: { id: data.id },
      });

    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setPriority("");
    setTargetDate(new Date());
    setSuccessMessage("✅ Goal saved!");

    setTimeout(() => {
      setSuccessMessage("");
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.header}>Add Goal</ThemedText>

        <ThemedTextInput
          placeholder="Goal name (e.g. House, Car, Wedding)"
          value={name}
          onChangeText={setName}
          style={[styles.input, { borderColor: theme.icon }]}
        />

        <ThemedTextInput
          placeholder="Target amount"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: theme.icon }]}
        />

        <ThemedTextInput
          placeholder="Amount already saved (optional)"
          value={savedAmount}
          onChangeText={setSavedAmount}
          keyboardType="decimal-pad"
          style={[styles.input, { borderColor: theme.icon }]}
        />

        {/* Priority Selector */}
        <View style={[styles.selectorWrapper, { backgroundColor: theme.uibackground, borderColor: theme.icon }]}>
          <ModalSelector
            data={[
              { key: "High", label: "High" },
              { key: "Medium", label: "Medium" },
              { key: "Low", label: "Low" },
            ]}
            initValue="Select Priority"
            onChange={(option) => setPriority(option.key)}
            optionTextStyle={{ color: theme.text }}
            optionContainerStyle={{ backgroundColor: theme.background }}
            cancelStyle={{ backgroundColor: theme.background }}
            cancelTextStyle={{ color: theme.text }}
            initValueTextStyle={{ color: priority ? theme.text : "#999999", fontSize: 16 }}
            selectTextStyle={{ color: theme.text, fontSize: 16 }}
            style={{ flex: 1 }}
          >
            <ThemedText>{priority || "Select Priority"}</ThemedText>
          </ModalSelector>

          <Ionicons name="chevron-down" size={20} color={theme.icon} />
        </View>

        {/* Target Date Picker Touchable */}
        <TouchableOpacity
          style={[styles.dateInput, { borderColor: theme.icon, backgroundColor: theme.uibackground }]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText>{targetDate.toDateString()}</ThemedText>
          <Ionicons name="calendar-outline" size={20} color={theme.icon} />
        </TouchableOpacity>

        {/* Helper Text */}
        <ThemedText style={{ fontSize: 12, color: theme.icon, marginBottom: 12 }}>
          Choose the date by which you want to reach this savings goal.
        </ThemedText>

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

        {successMessage !== "" && (
          <ThemedText style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
            {successMessage}
          </ThemedText>
        )}

        <ThemedButton onPress={handleSave}>
          <ThemedText style={styles.btnText}>Save Goal</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backBtn: { marginBottom: 10 },
  header: { fontSize: 22, textAlign: "center", fontWeight: "bold", marginBottom: 20 },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 6,
    padding: 18,
  },
  selectorWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
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