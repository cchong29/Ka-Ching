import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useWindowDimensions, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Investments() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back & Title */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <ThemedText title style={{ fontSize: 20, fontWeight: '600', marginLeft: 16 }}>
              Investments
            </ThemedText>
          </View>

          {/* Total Portfolio Value */}
          <View style={[styles.card, { backgroundColor: theme.uibackground }]}>
            <ThemedText style={{ color: '#6b7280' }}>Total Portfolio Value</ThemedText>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', color: '#047857' }}>
              $12,450.00
            </ThemedText>
          </View>

          {/* Portfolio Chart */}
          <View style={[styles.card, { backgroundColor: theme.uibackground }]}>
            <ThemedText style={{ fontWeight: '600', marginBottom: 8 }}>
              Portfolio Over Time
            </ThemedText>
            <LineChart
              data={{
                labels: ['Nov 23', '', '', '', '', '', '30'],
                datasets: [{ data: [29000, 30000, 33000, 37000, 39000, 43000, 49000] }],
              }}
              width={width - 40}
              height={200}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: theme.uibackground,
                backgroundGradientFrom: theme.uibackground,
                backgroundGradientTo: theme.uibackground,
                decimalPlaces: 0,
                color: () => `#3b82f6`,
                labelColor: () => theme.text,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#3b82f6',
                },
              }}
              style={{ borderRadius: 12 }}
              bezier
            />
          </View>

          {/* Top Holdings */}
          <ThemedText style={{ fontWeight: '600', marginBottom: 12 }}>Top Holdings</ThemedText>
          <Holding theme={theme} ticker="AAPL" name="$4,500" change="+3.2%" color="#16a34a" icon="logo-apple" />
          <Holding theme={theme} ticker="GOOGL" name="$3,200" change="+1.5%" color="#16a34a" icon="logo-google" />
          <Holding theme={theme} ticker="TSLA" name="$2,300" change="-2.1%" color="#dc2626" icon="car-sport-outline" />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function Holding({ ticker, name, change, color, icon, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.uibackground, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 }]}>
      <Ionicons name={icon} size={24} color={theme.icon} style={{ marginRight: 12 }} />
      <ThemedText style={{ fontWeight: '600', flex: 1 }}>{ticker}</ThemedText>
      <ThemedText style={{ marginRight: 12 }}>{name}</ThemedText>
      <ThemedText style={{ color }}>{change}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginBottom: 10,
    padding: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});