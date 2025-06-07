import ThemedText from '@/components/ThemedText';
import { ScrollView, StyleSheet } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.heading}>Terms and Conditions</ThemedText>

      <ThemedText style={styles.subheading}>1. Acceptance</ThemedText>
      <ThemedText style={styles.text}>
        By using Ka-Ching!, you agree to these terms and conditions in full. If you disagree with any part, do not use the app.
      </ThemedText>

      <ThemedText style={styles.subheading}>2. Use of the App</ThemedText>
      <ThemedText style={styles.text}>
        You must use the app only for lawful purposes. Misuse of the app may result in access restrictions or bans.
      </ThemedText>

      <ThemedText style={styles.subheading}>3. Account Security</ThemedText>
      <ThemedText style={styles.text}>
        You are responsible for maintaining the confidentiality of your account information and password.
      </ThemedText>

      <ThemedText style={styles.subheading}>4. Intellectual Property</ThemedText>
      <ThemedText style={styles.text}>
        All content on Ka-Ching! is owned by the app developers unless otherwise stated. Unauthorized use is prohibited.
      </ThemedText>

      <ThemedText style={styles.subheading}>5. Limitation of Liability</ThemedText>
      <ThemedText style={styles.text}>
        We are not liable for any direct or indirect damages arising from the use of this app.
      </ThemedText>

      <ThemedText style={styles.subheading}>6. Changes to Terms</ThemedText>
      <ThemedText style={styles.text}>
        We reserve the right to update these terms at any time. Continued use of the app implies acceptance of the changes.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subheading: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  text: { fontSize: 14, lineHeight: 22 },
});