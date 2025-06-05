// app/webview.jsx
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function WebviewScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams();

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={async ({ url }) => {
        if (url.includes('?code=')) {
          const code = new URL(url).searchParams.get('code');
          const result = await fetch(`${YOUR_BACKEND}/finverse/exchange-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          const { access_token: login_identity_token } = await result.json();
          // Store token for fetching transactions later
          await AsyncStorage.setItem('finverse_token', login_identity_token);
          router.push('/(tabs)/home'); // or wherever next
        }
      }}
    />
  );
}
