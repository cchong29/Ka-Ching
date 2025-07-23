import { View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext'; // 👈 use our context

const ThemedView = ({ style, ...props }) => {
  const { theme } = useTheme();
  const themeColors = Colors[theme] ?? Colors.light;

  return (
    <View
      style={[{ backgroundColor: themeColors.background }, style]}
      {...props}
    />
  );
};

export default ThemedView;