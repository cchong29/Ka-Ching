import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform, useColorScheme, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import ThemedButton from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';

const AddExpense = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    const parsedAmount = parseFloat(cleanAmount);
    if (isNaN(parsedAmount)) {
      Alert.alert('Invalid amount', 'Please enter a valid number for amount.');
      return;
    }
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      Alert.alert('Authentication Error', 'You must be logged in.');
      return;
    }
  
    const { error } = await supabase.from('expenses').insert([
      {
        title,
        amount: parsedAmount,
        category,
        date: date.toISOString(),
        note,
        user_id: user.id,
      },
    ]);
  
    if (error) {
      Alert.alert('Error', 'Failed to save expense.');
      console.error('Supabase insert error:', error.message);
      return;
    }
  
    setAmount('');
    setCategory('');
    setDate(new Date());
    setNote('');
    setTitle('');
    setSuccessMessage('✅ Expense saved!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.icon} />
      </TouchableOpacity>

      <ThemedText title style={styles.header}>Add Expense</ThemedText>

      <ThemedTextInput
        placeholder="$0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <ThemedTextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      
      <View style={[styles.dateInput, { backgroundColor: theme.uibackground, borderColor: theme.icon, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <ModalSelector
          data={[
            { key: 'Food', label: 'Food' },
            { key: 'Grocery', label: 'Grocery' },
            { key: 'Transport', label: 'Transport' },
            { key: 'Travel', label: 'Travel' },
            { key: 'Bills', label: 'Bills' },
            { key: 'Shopping', label: 'Shopping' },
            { key: 'Others', label: 'Others' },
          ]}
          initValue="Select a category"
          onChange={(option) => setCategory(option.key)}
          animationType="fade"
          optionTextStyle={{ color: theme.text }}
          optionContainerStyle={{ backgroundColor: theme.background, borderRadius: 10, }}
          cancelStyle={{ backgroundColor: theme.background }}
          cancelTextStyle={{ color: theme.text }}
          initValueTextStyle={{
            color: category ? theme.text : '#999999', 
            fontSize: 16,
          }}
          selectTextStyle={{
            color: theme.text,
            fontSize: 16,
          }}
          style={{ flex: 1 }}
        >
          <ThemedText>{category || 'Select a category'}</ThemedText>
        </ModalSelector>

        <Ionicons name="chevron-down" size={20} color={theme.icon} />
      </View>

      <TouchableOpacity
        style={[
          styles.dateInput,
          {
            borderColor: theme.icon,
            backgroundColor: theme.uibackground,
          },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toDateString()}</Text>
        <Ionicons name="calendar-outline" size={20} color={theme.icon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <ThemedTextInput
        placeholder="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
        style={[styles.input, { height: 80, borderColor: theme.icon }]}
      />

      {successMessage !== '' && (
        <ThemedText style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>
          {successMessage}
        </ThemedText>
      )}

      <ThemedButton onPress={handleSave}>
        <ThemedText style={styles.btnText}>Save Expense</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 6,
    padding: 18,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});