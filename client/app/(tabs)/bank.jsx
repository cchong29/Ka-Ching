import { View, Image, Pressable, StyleSheet, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

const baseUrl =
  process.env.EXPO_PUBLIC_ENV === 'production'
    ? 'https://ka-ching.onrender.com'
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';

export default function LinkBank() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleConnect = async () => {
    alert('Bank connection flow triggered');
    const tokenRes = await fetch(`${baseUrl}/finverse/token`, {
      method: 'POST',
    });

    const { access_token: customer_token } = await tokenRes.json();
    console.log('Fetched customer_token');

    const linkRes = await fetch(`${baseUrl}/finverse/link-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_token })
    });

    console.log('Generated link-token');
    const { link_url } = await linkRes.json();

    router.push({ pathname: '/finverse', params: { url: link_url } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText title style={styles.title}>Link Bank Account</ThemedText>
          <ThemedText style={styles.description}>
            Connect your bank account to import transactions automatically.
          </ThemedText>

          <Pressable style={styles.connectBtn} onPress={handleConnect}>
            <ThemedText style={styles.connectBtnText}>Connect Bank</ThemedText>
          </Pressable>

          <ThemedText style={styles.infoText}>
            We use Finverse to securely connect your bank. By continuing, you agree to our{' '}
            <ThemedText style={styles.linkText} onPress={() => router.push('/(auth)/t&c')}>Terms of Service</ThemedText> and{' '}
            <ThemedText style={styles.linkText} onPress={() => router.push('/(auth)/privacy')}>Privacy Policy</ThemedText>.
          </ThemedText>

          <ThemedText title style={styles.supportedBanksText}>Supported Banks</ThemedText>

          <View style={styles.bankRow}>
            <Image source={require('@/assets/images/dbs.png')} style={styles.bankLogo} />
            <Image source={require('@/assets/images/ocbc.png')} style={styles.bankLogo} />
            <Image source={require('@/assets/images/scb.png')} style={styles.bankLogo} />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  connectBtn: {
    backgroundColor: '#1F7D43',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  connectBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    marginHorizontal: 12,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#2C7BE5',
  },
  supportedBanksText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bankLogo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
});