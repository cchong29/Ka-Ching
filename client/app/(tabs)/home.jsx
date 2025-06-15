import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

import { supabase } from "../../lib/supabase";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyActivities = [
  { id: 1, name: 'Starbucks', amount: 7.8, icon: 'food-bank' }, 
  { id: 2, name: 'Fairprice', amount: 53.6, icon: 'local-grocery-store' },
  { id: 3, name: 'Grab', amount: 16.2, icon: 'emoji-transportation' },
  { id: 4, name: 'Airbnb', amount: 658.5, icon: 'flight' }, 
];

const Home = () => {

  const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const email = session?.user?.email;
            if (email) {
                const name = email.split("@")[0];
                setUsername(name);
            }
        };

        fetchUser();
    }, []);

  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const containerBg = colorScheme === 'dark' ? '#2f2b3d' : '#fff'; // your themed container bg
  const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#333333'; // white for dark, black/grey for light

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedText title style={styles.welcomeText}>{username}</ThemedText>

        {/* Total Balance */}
        <View style={[styles.balanceCard, { backgroundColor: containerBg }]}>
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
          <View style={[styles.smallCard, { backgroundColor: containerBg }]}>
            <ThemedText>This Month</ThemedText>
            <View style={[styles.fakeGraph, { backgroundColor: colorScheme === 'dark' ? '#3a3f47' : '#d0f0d0' }]} />
          </View>
          <View style={[styles.smallCard, { backgroundColor: containerBg }]}>
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
            <View style={[styles.activityItem, { backgroundColor: containerBg }]}>
              <View style={styles.activityLeft}>
                <MaterialIcons name={item.icon} size={24} color={iconColor} style={{ marginRight: 10 }} />
                <ThemedText>{item.name}</ThemedText>
              </View>
              <View style={styles.activityRight}>
                <ThemedText>${item.amount.toFixed(2)}</ThemedText>
                <Ionicons name="chevron-forward" size={16} color={theme.icon} />
              </View>
            </View>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  balanceCard: {
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
    gap: 10,
  },
  smallCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  fakeGraph: {
    height: 40,
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});