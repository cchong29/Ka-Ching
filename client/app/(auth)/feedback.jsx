import { View, SafeAreaView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HelpFeedback() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ThemedText title style={styles.title}>Help & Feedback</ThemedText>

        <ThemedText style={styles.description}>
          Got questions or feedback? We're here to help. Reach out through the options below.
        </ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('mailto:celestechongel@gmail.com')}
        >
          <ThemedText style={styles.buttonText}>📧 Email Support</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://ka-ching.notion.site/FAQ')}
        >
          <ThemedText style={styles.buttonText}>📚 View FAQs</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://ka-ching.notion.site/Feature-Requests')}
        >
          <ThemedText style={styles.buttonText}>💡 Suggest a Feature</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.footer}>
          Thank you for helping us improve Ka-Ching!
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backBtn: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    color: '#555',
  },
  button: {
    backgroundColor: '#2C7BE5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});
