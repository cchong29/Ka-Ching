import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

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

  const handleSave = () => {
    console.log({ amount, category, date, note });
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
        placeholder="Select Category"
        value={category}
        onChangeText={setCategory}
        style={[styles.input, { borderColor: theme.icon }]}
      />

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
        <ThemedText>{date.toDateString()}</ThemedText>
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
    marginBottom: 10,
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