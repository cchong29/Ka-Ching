import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import ModalSelector from 'react-native-modal-selector';

import { supabase } from '@/lib/supabase';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import ThemedButton from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';

const AddGoal = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [monthlySaving, setMonthlySaving] = useState('');
  const [priority, setPriority] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    const parsedTarget = parseFloat(targetAmount.replace(/[^0-9.]/g, ''));
    const parsedSaved = parseFloat(savedAmount.replace(/[^0-9.]/g, '') || '0');
    const parsedMonthly = parseFloat(monthlySaving.replace(/[^0-9.]/g, '') || '0');

    if (!name.trim()) {
      Alert.alert('Missing Goal Name', 'Please enter a goal name.');
      return;
    }

    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      Alert.alert('Invalid Target Amount', 'Please enter a valid target amount.');
      return;
    }

    if (!priority) {
      Alert.alert('Missing Priority', 'Please select a priority.');
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert('Authentication Error', 'You must be logged in.');
      return;
    }

    const { error } = await supabase.from('goals').insert([
      {
        name,
        target_amount: parsedTarget,
        saved_amount: parsedSaved,
        monthly_saving: parsedMonthly,
        target_date: targetDate.toISOString(),
        priority,
        note,
        user_id: user.id,
      },
    ]);

    if (error) {
      Alert.alert('Error', 'Failed to save goal.');
      console.error(error);
      return;
    }

    setName('');
    setTargetAmount('');
    setSavedAmount('');
    setMonthlySaving('');
    setPriority('');
    setTargetDate(new Date());
    setNote('');
    setSuccessMessage('✅ Goal saved!');

    setTimeout(() => {
      setSuccessMessage('');
      router.back();
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.icon} />
      </TouchableOpacity>

      <ThemedText title style={styles.header}>Add Goal</ThemedText>

      <ThemedTextInput
        placeholder="Goal Name (e.g. House, Trip, Wedding)"
        value={name}
        onChangeText={setName}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <ThemedTextInput
        placeholder="Target Amount ($)"
        keyboardType="decimal-pad"
        value={targetAmount}
        onChangeText={setTargetAmount}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <ThemedTextInput
        placeholder="Amount Already Saved (optional)"
        keyboardType="decimal-pad"
        value={savedAmount}
        onChangeText={setSavedAmount}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      <ThemedTextInput
        placeholder="Monthly Saving (optional)"
        keyboardType="decimal-pad"
        value={monthlySaving}
        onChangeText={setMonthlySaving}
        style={[styles.input, { borderColor: theme.icon }]}
      />

      {/* Priority Selector */}
      <View style={[styles.dateInput, { backgroundColor: theme.uibackground, borderColor: theme.icon }]}>
        <ModalSelector
          data={[
            { key: 'High', label: 'High' },
            { key: 'Medium', label: 'Medium' },
            { key: 'Low', label: 'Low' },
          ]}
          initValue="Select a priority"
          onChange={(option) => setPriority(option.key)}
          optionTextStyle={{ color: theme.text }}
          optionContainerStyle={{ backgroundColor: theme.background }}
          cancelStyle={{ backgroundColor: theme.background }}
          cancelTextStyle={{ color: theme.text }}
          initValueTextStyle={{ color: priority ? theme.text : '#999999', fontSize: 16 }}
          selectTextStyle={{ color: theme.text, fontSize: 16 }}
          style={{ flex: 1 }}
        >
          <ThemedText>{priority || 'Select a priority'}</ThemedText>
        </ModalSelector>
        <Ionicons name="chevron-down" size={20} color={theme.icon} />
      </View>

      {/* Target Date */}
      <TouchableOpacity
        style={[styles.dateInput, { borderColor: theme.icon, backgroundColor: theme.uibackground }]}
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedText>{targetDate.toDateString()}</ThemedText>
        <Ionicons name="calendar-outline" size={20} color={theme.icon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={targetDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setTargetDate(selectedDate);
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
        <ThemedText style={styles.btnText}>Save Goal</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

export default AddGoal;

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