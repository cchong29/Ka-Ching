import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { BarChart } from "react-native-chart-kit";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const router = useRouter();

const ExpenseItem = ({ expense }) => (
  <ThemedView style={{ marginBottom: 10 }}>
    <ThemedText>
      {expense.title} - ${expense.amount.toFixed(2)}
    </ThemedText>
    <ThemedText style={{ fontSize: 12 }}>
      {expense.category} | {new Date(expense.date).toDateString()}
    </ThemedText>
  </ThemedView>
);

const ExpensesDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"] ?? Colors.light;

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) {
        setExpenses(data);
      }
      setLoading(false);
    };

    fetchExpenses();
  }, []);

  // calculate totals per month
  const monthTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    const match =
      selectedCategory === "All" || expense.category === selectedCategory;
    if (match) {
      acc[month] = (acc[month] || 0) + expense.amount;
    }
    return acc;
  }, {});

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const barChartData = {
    labels: monthNames,
    datasets: [
      {
        data: Array.from({ length: 12 }, (_, i) => monthTotals[i] || 0),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    color: (opacity = 1) => `rgba(19, 117, 71, ${opacity})`, // your primary green
    labelColor: (opacity = 1) => theme.text,
    barPercentage: 0.6,
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText title style={{ fontSize: 20, marginBottom: 10 }}>
        Total Spent: ${totalSpent.toFixed(2)}
      </ThemedText>

      {/* category filter */}
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}
      >
        {[
          "All",
          "Food",
          "Transport",
          "Shopping",
          "Travel",
          "Bills",
          "Others",
        ].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              backgroundColor:
                selectedCategory === cat ? theme.tint : theme.uibackground,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
              margin: 4,
            }}
          >
            <Text style={{ color: theme.text }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* bar chart */}
      <BarChart
        data={barChartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        withInnerLines
        fromZero
        showValuesOnTopOfBars
      />

      {/* expense list */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        style={{ marginTop: 20 }}
      />
      <TouchableOpacity
        onPress={() => router.push("/expenses")}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: theme.tint,
          borderRadius: 30,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>+ Add Expense</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ExpensesDashboard;
