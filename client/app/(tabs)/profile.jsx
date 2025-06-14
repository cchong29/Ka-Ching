import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native'; 
import { Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import React from 'react';

export default function Profile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter()
  const baseUrl =
  process.env.EXPO_PUBLIC_ENV === 'production'
    ? 'https://ka-ching.onrender.com'
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';

  const signOut = async () => {
    try {
      // Sign out from Google if applicable
      await GoogleSignin.signOut();
      console.log('Google sign-out successful');
    } catch (err) {
      console.log('Google sign-out failed (non-Google user is fine)', err.message);
    }
  
    try {
      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      const data = await res.json();
      if (data.loggedOut) {
        router.replace('/');
      } else {
        Alert.alert('Logout Failed', 'Please try again.');
      }
    } catch (err) {
      console.log('Error logging out:', err.message);
      Alert.alert('Logout Error', 'Could not log out. Please try again.');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image
            source={{ uri: 'https://www.gravatar.com/avatar/?d=mp' }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <ThemedText title style={{ fontSize: 20, fontWeight: '600', marginTop: 12 }}>
            John Doe
          </ThemedText>
          <ThemedText style={{ marginTop: 4, color: theme.icon }}>
            johndoe@gmail.com
          </ThemedText>
        </View>

        {/* Account Settings */}
        <Section title="Account Settings">
          <Item icon={<Feather name="user" size={20} />} label="Email" />
          <Item icon={<Feather name="lock" size={20} />} label="Change Password" />
          <Item icon={<Feather name="link" size={20} />} label="Linked Banks" />
          <Item icon={<Feather name="bell" size={20} />} label="Notifications" />
          <Item icon={<Feather name="sun" size={20} />} label="Theme" />
        </Section>

        {/* Support and Legal */}
        <Section title="Support and Legal">
          <Item icon={<AntDesign name="questioncircleo" size={20} />} label="Help & Feedback" />
          <Item icon={<Feather name="file-text" size={20} />} label="Terms of Service" onPress={() => router.push('/(auth)/t&c')} />
          <Item icon={<Feather name="shield" size={20} />} label="Privacy Policy" onPress={() => router.push('/(auth)/privacy')} />
        </Section>

        <TouchableOpacity
          onPress={signOut}
          style={{
            backgroundColor: '#047857',
            paddingVertical: 14,
            borderRadius: 8,
            marginTop: 30,
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: 'white', fontWeight: '600' }}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, children }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={{ marginTop: 30 }}>
      <ThemedText
        style={{
          marginBottom: 12,
          fontWeight: '700',
          fontSize: 18,
          color: theme.title,
        }}
      >
        {title}
      </ThemedText>
      <View>{children}</View>
    </View>
  );
}

function Item({ icon, label, onPress }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.uibackground,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,

        // Elevation for Android
        elevation: 2,
      }}
    >
      <View style={{ marginRight: 12 }}>
        {React.cloneElement(icon, { color: theme.icon })}
      </View>
      <ThemedText style={{ fontSize: 16 }}>{label}</ThemedText>
      <Ionicons
        name="chevron-forward"
        size={18}
        style={{ marginLeft: 'auto', color: Colors.primary }}
      />
    </TouchableOpacity>
  );
}
