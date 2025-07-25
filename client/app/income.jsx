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

const IncomeItem = ({ income, theme, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(income)}
    style={[
      styles.card,
      { backgroundColor: theme.uibackground, borderColor: theme.border },
    ]}
  >
    <ThemedText style={{ fontWeight: "600" }}>
      {income.title} + ${income.amount.toFixed(2)}
    </ThemedText>
    <ThemedText style={{ fontSize: 13, color: theme.icon }}>
      {income.category} | {new Date(income.date).toDateString()}
    </ThemedText>
  </TouchableOpacity>
);

const IncomeDashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchIncomes = async () => {
      const { data, error } = await supabase
        .from("income")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) setIncomes(data);
    };

    fetchIncomes();
  }, []);

  const monthTotals = incomes.reduce((acc, income) => {
    const month = new Date(income.date).getMonth();
    const match =
      selectedCategory === "All" || income.category === selectedCategory;
    if (match) acc[month] = (acc[month] || 0) + income.amount;
    return acc;
  }, {});

  const barChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

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
            Total Income: ${totalIncome.toFixed(2)}
          </ThemedText>

          {/* Category Filter */}
          <View style={styles.filterWrap}>
            {["All", "Salary", "Freelance", "Business", "Investments", "Others"].map((cat) => (
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

          {/* Chart + Simulated Y-axis */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                height: 220,
                paddingBottom: 32,
              }}
            >
              {[...Array(5)].map((_, i) => {
                const maxVal = Math.max(...barChartData.datasets[0].data, 10);
                const roundedMax = Math.ceil(maxVal / 10) * 10;
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={barChartData}
                width={screenWidth * 1.5}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                fromZero
                showValuesOnTopOfBars
                withVerticalLabels
                withHorizontalLabels={false}
                yAxisLabel=""
                style={{ borderRadius: 12, marginLeft: 0 }}
              />
            </ScrollView>
          </View>

          {/* Income List */}
          <ThemedText title style={{ marginVertical: 16 }}>
            Recent Income
          </ThemedText>
          <FlatList
            data={incomes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <IncomeItem
                income={item}
                theme={theme}
                onPress={(income) => {
                  router.push({
                    pathname: "/income_details",
                    params: {
                      id: income.id,
                      title: income.title,
                      amount: income.amount,
                      date: income.date,
                      category: income.category,
                      note: income.note,
                    },
                  });
                }}
              />
            )}
            scrollEnabled={false}
          />
        </ScrollView>

        {/* Add Income FAB */}
        <TouchableOpacity
          onPress={() => router.push("/add_income")}
          style={[
            styles.fab,
            { backgroundColor: theme.tint, shadowColor: theme.icon },
          ]}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            + Add Income
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

export default IncomeDashboard;

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
    marginTop: 20,
  },
});