import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import '@/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitle: 'Back',
            }}
          >
            <Stack.Screen name='splash' options={{ headerShown: false }} />
            <Stack.Screen name='home' options={{ headerShown: false }} />
            <Stack.Screen
              name='product/[id]'
              options={{
                title: 'Product Details',
                headerShown: true
              }}
            />
            <Stack.Screen name='transaction' options={{
              title: 'Transaction',
              headerShown: true,
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

