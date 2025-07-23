import { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";

const screenWidth = Dimensions.get("window").width;

const ExpenseItem = ({ expense, onPress }) => (
  <TouchableOpacity onPress={() => onPress(expense)} style={styles.card}>
    <ThemedText style={{ fontWeight: "600" }}>
      {expense.title} - ${expense.amount.toFixed(2)}
    </ThemedText>
    <ThemedText style={{ fontSize: 13 }}>
      {expense.category} | {new Date(expense.date).toDateString()}
    </ThemedText>
  </TouchableOpacity>
);

const ExpensesDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) setExpenses(data);
    };

    fetchExpenses();
  }, []);

  const monthTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    const match = selectedCategory === "All" || expense.category === selectedCategory;
    if (match) acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const currentMonth = new Date().getMonth();
  const currentMonthSpending = monthTotals[currentMonth]?.toFixed(2) || "0.00";
  const runningTotal = expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2);

  const barChartData = {
    labels: [
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
    ],
    datasets: [
      {
        data: Array.from({ length: 12 }, (_, i) => parseFloat((monthTotals[i] || 0).toFixed(2))),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    color: () => theme.tint,
    labelColor: () => theme.text,
    barPercentage: 0.6,
    propsForBackgroundLines: {
      stroke: "transparent",
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          <ThemedText title style={{ fontSize: 20, marginBottom: 8 }}>
            Total Spent: ${runningTotal}
          </ThemedText>
          <ThemedText style={{ marginBottom: 16, color: theme.text }}>
            This Month: ${currentMonthSpending}
          </ThemedText>

          {/* Category Filter */}
          <ThemedView style={styles.filterWrap}>
            {["All", "Food", "Transport", "Shopping", "Travel", "Bills", "Others"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      selectedCategory === cat ? theme.tint : theme.uibackground,
                    borderColor: theme.tint,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: selectedCategory === cat ? "#fff" : theme.text,
                  }}
                >
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>

          <ThemedView
            style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 20, marginTop: 10 }}
          >
            <ThemedView style={{ justifyContent: "space-between", height: 220, paddingBottom: 32 }}>
              {[...Array(5)].map((_, i) => {
                const maxVal = Math.max(...barChartData.datasets[0].data, 10);
                const roundedMax = Math.ceil(maxVal / 10) * 10;
                const yLabel = ((roundedMax / 4) * (4 - i)).toFixed(0);
                return (
                  <Text
                    key={i}
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      paddingRight: 5,
                      color: theme.text,
                    }}
                  >
                    ${yLabel}
                  </Text>
                );
              })}
            </ThemedView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={barChartData}
                width={screenWidth * 1.5}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                fromZero
                showValuesOnTopOfBars
                withVerticalLabels={true}
                withHorizontalLabels={false}
                yAxisLabel=""
                style={{ borderRadius: 12, marginLeft: 0 }}
              />
            </ScrollView>
          </ThemedView>

          <ThemedText title style={{ marginVertical: 16 }}>
            Recent Expenses
          </ThemedText>

          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ExpenseItem
                expense={item}
                theme={theme}
                onPress={(expense) => {
                  router.push({
                    pathname: "/expense_details",
                    params: {
                      id: expense.id,
                      title: expense.title,
                      amount: expense.amount,
                      date: expense.date,
                      category: expense.category,
                      note: expense.note,
                    },
                  });
                }}
              />
            )}
            scrollEnabled={false}
          />
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.push("/add_expense")}
          style={[styles.fab, { backgroundColor: theme.tint, shadowColor: theme.icon }]}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>+ Add Expense</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

export default ExpensesDashboard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  filterWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
  },
  backBtn: {
    marginBottom: 12,
  },
});