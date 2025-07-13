// components/ThemedText.js
import { Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext'; // or useColorScheme
import { Colors } from '@/constants/Colors';

const ThemedText = ({ style, ...props }) => {
  const { theme } = useTheme(); // ✅ switchable theme from context
  const themeColors = Colors[theme] ?? Colors.light;

  return (
    <Text
      style={[{ color: themeColors.text }, style]} // ✅ updates text color
      {...props}
    />
  );
};

export default ThemedText;