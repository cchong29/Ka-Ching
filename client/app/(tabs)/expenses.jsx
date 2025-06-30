import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
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

const ExpenseItem = ({ expense, theme, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(expense)}
    style={[
      styles.card,
      { backgroundColor: theme.uibackground, borderColor: theme.border },
    ]}
  >
    <ThemedText style={{ fontWeight: "600" }}>
      {expense.title} - ${expense.amount.toFixed(2)}
    </ThemedText>
    <ThemedText style={{ fontSize: 13, color: theme.icon }}>
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
    const match =
      selectedCategory === "All" || expense.category === selectedCategory;
    if (match) acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

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
        data: Array.from({ length: 12 }, (_, i) =>
          parseFloat((monthTotals[i] || 0).toFixed(2))
        ),
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

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          <ThemedText title style={{ fontSize: 20, marginBottom: 16 }}>
            Total Spent: ${totalSpent.toFixed(2)}
          </ThemedText>

          {/* Category Filter */}
          <View style={styles.filterWrap}>
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
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      selectedCategory === cat
                        ? theme.tint
                        : theme.uibackground,
                    borderColor: theme.tint,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedCategory === cat ? "#fff" : theme.text,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            {/* Simulated Y-axis */}
            <View
              style={{
                justifyContent: "space-between",
                height: 220,
                paddingBottom: 32,
              }}
            >
              {[...Array(5)].map((_, i) => {
                const maxVal = Math.max(...barChartData.datasets[0].data, 10); // avoid 0
                const roundedMax = Math.ceil(maxVal / 10) * 10; // round to nearest 10
                const yLabel = ((roundedMax / 4) * (4 - i)).toFixed(0);
                return (
                  <Text
                    key={i}
                    style={{
                      color: theme.text,
                      fontSize: 12,
                      textAlign: "right",
                      paddingRight: 5,
                    }}
                  >
                    ${yLabel}
                  </Text>
                );
              })}
            </View>

            {/* Scrollable Bar Chart */}
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
                withHorizontalLabels={false} // hide default Y-axis
                yAxisLabel=""
                style={{ borderRadius: 12, marginLeft: 0 }} // removed left margin
              />
            </ScrollView>
          </View>

          {/* Expense List */}
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

        {/* Add Expense FAB */}
        <TouchableOpacity
          onPress={() => router.push("/add_expense")}
          style={[
            styles.fab,
            { backgroundColor: theme.tint, shadowColor: theme.icon },
          ]}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            + Add Expense
          </Text>
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
