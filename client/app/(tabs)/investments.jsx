import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useWindowDimensions } from 'react-native';

export default function Investments() {
  const { width } = useWindowDimensions();

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back & Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <ThemedText title style={{ fontSize: 20, fontWeight: '600', marginLeft: 16 }}>
            Investments
          </ThemedText>
        </View>

        {/* Total Portfolio Value */}
        <View
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <ThemedText style={{ color: '#6b7280' }}>Total Portfolio Value</ThemedText>
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold', color: '#047857' }}>
            $12,450.00
          </ThemedText>
        </View>

        {/* Portfolio Chart */}
        <View
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
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
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => `#3b82f6`,
              labelColor: () => '#9ca3af',
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
        <Holding ticker="AAPL" name="$4,500" change="+3.2%" color="#16a34a" icon="logo-apple" />
        <Holding ticker="GOOGL" name="$3,200" change="+1.5%" color="#16a34a" icon="logo-google" />
        <Holding ticker="TSLA" name="$2,300" change="-2.1%" color="#dc2626" icon="car-sport-outline" />
      </ScrollView>
    </ThemedView>
  );
}

function Holding({ ticker, name, change, color, icon }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
      }}
    >
      <Ionicons name={icon} size={24} style={{ marginRight: 12 }} />
      <ThemedText style={{ fontWeight: '600', flex: 1 }}>{ticker}</ThemedText>
      <ThemedText style={{ marginRight: 12 }}>{name}</ThemedText>
      <ThemedText style={{ color }}>{change}</ThemedText>
    </View>
  );
}
