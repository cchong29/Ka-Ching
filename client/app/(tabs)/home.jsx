import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

const dummyActivities = [
  { id: 1, name: 'Starbucks', amount: 7.8 },
  { id: 2, name: 'Starbucks', amount: 7.8 },
  { id: 3, name: 'Starbucks', amount: 7.8 },
  { id: 4, name: 'Starbucks', amount: 7.8 },
];

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      {/* Top bar */}
        <ThemedText title style={styles.welcomeText}>Hello, John!</ThemedText>

      {/* Total Balance */}
      <View style={styles.balanceCard}>
        <View>
          <ThemedText>Total Balance</ThemedText>
          <ThemedText style={styles.balanceText}>$5,038.24</ThemedText>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Graph & Bills */}
      <View style={styles.sectionRow}>
        <View style={styles.smallCard}>
          <ThemedText>This Month</ThemedText>
          {/* Placeholder line graph */}
          <View style={styles.fakeGraph} />
        </View>
        <View style={styles.smallCard}>
          <ThemedText>Bills Due</ThemedText>
          <ThemedText style={styles.greenText}>3 items</ThemedText>
        </View>
      </View>

      {/* Recent Activity */}
      <ThemedText title style={styles.recentTitle}>Recent Activity</ThemedText>
      <FlatList
        data={dummyActivities}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <View style={styles.dot} />
              <ThemedText>{item.name}</ThemedText>
            </View>
            <View style={styles.activityRight}>
              <ThemedText>${item.amount}</ThemedText>
              <Ionicons name="chevron-forward" size={16} />
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 30,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf : 'center',
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  fakeGraph: {
    height: 40,
    backgroundColor: '#d0f0d0',
    marginTop: 10,
    borderRadius: 5,
  },
  greenText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 18,
    marginVertical: 15,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
});
