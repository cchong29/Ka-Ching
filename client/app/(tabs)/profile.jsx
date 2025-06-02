import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter()
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
          <ThemedText style={{ marginTop: 4, color: '#6B7280' }}>
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
          <Item icon={<Feather name="shield" size={20} />} label="Privacy Policy" />
        </Section>

        <TouchableOpacity
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
  return (
    <View style={{ marginTop: 30 }}>
      <ThemedText style={{ marginBottom: 12, fontWeight: '600' }}>{title}</ThemedText>
      <View style={{ backgroundColor: '#f1f5f9', borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

function Item({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
      }}
    >
      <View style={{ marginRight: 12 }}>{icon}</View>
      <ThemedText style={{ fontSize: 16 }}>{label}</ThemedText>
      <Ionicons name="chevron-forward" size={18} style={{ marginLeft: 'auto', color: Colors.primary }} />
    </TouchableOpacity>
  );
}
