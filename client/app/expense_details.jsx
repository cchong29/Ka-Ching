import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedView from "@/components/ThemedView";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function ExpenseDetails() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const params = useLocalSearchParams();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", params.id);

      if (error) {
        console.error("❌ Delete failed:", error.message);
        Alert.alert("Error", "Could not delete expense");
        return;
      }

      Alert.alert("Deleted", "Expense has been deleted ✅", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("❌ Delete error:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleModify = () => {
    console.log(params);
    router.push({
      pathname: "/edit_expense",
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
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.icon} />
      </TouchableOpacity>
      <ThemedText style={styles.title}>{params.title}</ThemedText>

      <View style={styles.detailsCard}>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Amount:</ThemedText>
          <ThemedText style={styles.value}>
            ${Number(params.amount).toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Date:</ThemedText>
          <ThemedText style={styles.value}>{params.date}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Category:</ThemedText>
          <ThemedText style={styles.value}>{params.category}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Note:</ThemedText>
          <ThemedText style={styles.value}>{params.note || "—"}</ThemedText>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <ThemedButton onPress={handleModify} style={styles.modifyBtn}>
          <ThemedText style={{ color: "white", alignSelf: "center" }}>
            Modify
          </ThemedText>
        </ThemedButton>
        <ThemedButton onPress={handleDelete} style={styles.deleteBtn}>
          <ThemedText style={{ color: "white", alignSelf: "center" }}>
            Delete
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  detailsCard: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
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
  modifyBtn: {
    flex: 1,
    backgroundColor: "#4caf50",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#f44336",
  },
  backBtn:{
    marginTop:20,
  }
});
