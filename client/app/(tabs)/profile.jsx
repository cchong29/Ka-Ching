import { Image, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext'; // ✅

export default function Profile() {
  const [username, setUsername] = useState("");
  const { theme, toggleTheme } = useTheme(); // ✅
  const themeColors = Colors[theme] ?? Colors.light;
  const router = useRouter();

  const baseUrl =
    process.env.EXPO_PUBLIC_ENV === 'production'
      ? 'https://ka-ching.onrender.com'
      : Platform.OS === 'android'
      ? 'http://10.0.2.2:4000'
      : 'http://localhost:4000';

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (accessToken) {
        const res = await fetch(`${baseUrl}/user/username`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const json = await res.json();
        setUsername(json.name);
      }
    };
    fetchUserName();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (err) {
      console.log('Google sign-out failed', err.message);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={{ alignItems: 'center', marginTop: 20 }}>
            <Image
              source={{ uri: 'https://www.gravatar.com/avatar/?d=mp' }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <ThemedText title style={{ fontSize: 20, fontWeight: '600', marginTop: 12 }}>
              {username}
            </ThemedText>
            <ThemedText style={{ marginTop: 4, color: themeColors.icon }}>
              {username}@gmail.com
            </ThemedText>
          </ThemedView>

          {/* Account Settings */}
          <Section title="Account Settings" theme={theme}>
            <Item icon={<Feather name="user" size={20} />} label="Email" theme={theme} />
            <Item icon={<Feather name="lock" size={20} />} label="Change Password" theme={theme} onPress={() => router.push('/changepw')} />
            <Item icon={<Feather name="link" size={20} />} label="Linked Banks" theme={theme} />
            <Item icon={<Feather name="sun" size={20} />} label={`${theme === 'light' ? 'Dark' : 'Light'} Mode`} theme={theme} onPress={toggleTheme} />
          </Section>

          {/* Support and Legal */}
          <Section title="Support and Legal" theme={theme}>
            <Item icon={<Feather name="file-text" size={20} />} label="Terms of Service" theme={theme} onPress={() => router.push('/(auth)/t&c')} />
            <Item icon={<Feather name="shield" size={20} />} label="Privacy Policy" theme={theme} onPress={() => router.push('/(auth)/privacy')} />
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
    </SafeAreaView>
  );
}

function Section({ title, children, theme }) {
  const themeColors = Colors[theme] ?? Colors.light;

  return (
    <ThemedView style={{ marginTop: 30 }}>
      <ThemedText
        style={{
          marginBottom: 12,
          fontWeight: '700',
          fontSize: 18,
          color: themeColors.title,
        }}
      >
        {title}
      </ThemedText>
      <ThemedView>{children}</ThemedView>
    </ThemedView>
  );
}

function Item({ icon, label, onPress, theme }) {
  const themeColors = Colors[theme] ?? Colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.uibackground,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,

        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,

        elevation: 2,
      }}
    >
      <ThemedView style={{ marginRight: 12 }}>
        {React.cloneElement(icon, { color: themeColors.icon })}
      </ThemedView>
      <ThemedText style={{ fontSize: 16 }}>{label}</ThemedText>
      <Ionicons
        name="chevron-forward"
        size={18}
        style={{ marginLeft: 'auto', color: Colors.primary }}
      />
    </TouchableOpacity>
  );
}