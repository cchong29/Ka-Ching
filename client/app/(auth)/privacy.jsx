import ThemedText from "@/components/ThemedText";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function PrivacyPolicy() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.icon} />
      </TouchableOpacity>
      <ThemedText style={styles.heading}>Privacy Policy</ThemedText>

      <ThemedText style={styles.text}>
        We respect your privacy and are committed to protecting your personal
        data.
      </ThemedText>

      <ThemedText style={styles.subheading}>
        1. Information We Collect
      </ThemedText>
      <ThemedText style={styles.text}>
        We collect information you provide directly (such as email) and usage
        data to improve the app experience.
      </ThemedText>

      <ThemedText style={styles.subheading}>2. How We Use Data</ThemedText>
      <ThemedText style={styles.text}>
        Your data is used solely to operate and enhance Ka-Ching!. We do not
        sell or share your data with third parties.
      </ThemedText>

      <ThemedText style={styles.subheading}>3. Cookies</ThemedText>
      <ThemedText style={styles.text}>
        Cookies may be used to remember login sessions and user preferences.
      </ThemedText>

      <ThemedText style={styles.subheading}>4. Your Rights</ThemedText>
      <ThemedText style={styles.text}>
        You may request to access, update, or delete your data at any time by
        contacting us.
      </ThemedText>

      <ThemedText style={styles.subheading}>5. Changes to Policy</ThemedText>
      <ThemedText style={styles.text}>
        We may update this privacy policy occasionally. Changes will be
        communicated via the app.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subheading: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  text: { fontSize: 14, lineHeight: 22 },
  backBtn: { marginTop:20}
});
