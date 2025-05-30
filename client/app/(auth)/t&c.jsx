import ThemedText from '@/components/ThemedText';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.heading}>Terms and Conditions</ThemedText>
      <ThemedText style={styles.text}>
        By using Ka-Ching!, you agree to the following terms...
      </ThemedText>
      <ThemedText style={styles.subheading}>1. Acceptance</ThemedText>
      <ThemedText style={styles.text}>
        You must accept these terms to use the app.
      </ThemedText>
      <ThemedText style={styles.subheading}>2. Your Data</ThemedText>
      <ThemedText style={styles.text}>
        We do not sell your data. Period.
      </ThemedText>
      {/* add more sections as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
});
