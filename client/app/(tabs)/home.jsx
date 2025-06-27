import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from "../../lib/supabase";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';

const iconMap = {
  Food: 'food-bank',
  Grocery: 'local-grocery-store',
  Transport: 'emoji-transportation',
  Travel: 'flight',
  // Add more category-to-icon mappings
};

 const baseUrl =
  process.env.EXPO_PUBLIC_ENV === 'production'
    ? 'https://ka-ching.onrender.com'
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';

    const Home = ({ navigation }) => {
      const [username, setUsername] = useState('');
      const [expenses, setExpenses] = useState([]);
      const colorScheme = useColorScheme();
      const theme = Colors[colorScheme] ?? Colors.light;
    
      useEffect(() => {
        const fetchUserName = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          if (accessToken) {
            const res = await fetch(`${baseUrl}/user/username`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const json = await res.json();
            setUsername(json.name);
          }
        };
    
        fetchUserName();
      }, []);
    
      // Fetch expenses when focused
      const fetchExpenses = useCallback(async () => {
        const { data, error: userError } = await supabase.auth.getUser();
        const user = data?.user;
    
        if (userError || !user) {
          console.error('User not logged in or error fetching user:', userError);
          return;
        }
    
        const { data: expensesData, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
    
        if (error) {
          console.error('❌ Error fetching expenses:', error.message);
        } else {
          setExpenses(expensesData);
        }
      }, []);
    
      useFocusEffect(
        useCallback(() => {
          fetchExpenses();
        }, [fetchExpenses])
      );
      
     

    const containerBg = colorScheme === 'dark' ? '#2f2b3d' : '#fff';
    const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#333333';
      
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
          <ThemedText title style={styles.welcomeText}>Hello {username}!</ThemedText>

          <View style={[styles.balanceCard, { backgroundColor: containerBg }]}>
            <View>
              <ThemedText>Total Balance</ThemedText>
              <ThemedText style={styles.balanceText}>$5,038.24</ThemedText>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
  
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
  
          <ThemedText title style={styles.recentTitle}>Recent Activity</ThemedText>
          <FlatList
            data={expenses}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.activityItem, { backgroundColor: containerBg }]}>
                <View style={styles.activityLeft}>
                  <MaterialIcons
                    name={iconMap[item.category] || 'payment'} // fallback icon
                    size={24}
                    color={iconColor}
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <ThemedText>{item.title || item.category}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: 'gray' }}>{item.category}</ThemedText>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <ThemedText>${item.amount.toFixed(2)}</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color={theme.icon} />
                </View>
              </View>
            )}
            ListEmptyComponent={
              <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
                No expenses found.
              </ThemedText>
            }
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