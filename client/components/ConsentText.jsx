// components/ConsentText.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ConsentText() {
  return (
    <View style={styles.container}>
      <Text style={styles.consentText}>
        By clicking continue, you agree to our{' '}
        <Link href="/(auth)/t&c">
          <Text style={styles.link}>Terms of Service</Text>
        </Link>{' '}
        and{' '}
        <Link href="/(auth)/privacy">
          <Text style={styles.link}>Privacy Policy</Text>
        </Link>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  consentText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#828282',
  },
  link: {
    color: '#137547',
    textDecorationLine: 'underline',
  },
});