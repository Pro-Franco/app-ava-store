/*import { Stack } from 'expo-router';
import { AuthProvider } from './contexts/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
*/
/*
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
*/

import { Stack } from 'expo-router';
import { AuthProvider } from './contexts/authContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

/*


      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'overview'
          }}
        />
        <Drawer.Screen
          name="user/[id]" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'User',
            title: 'overview'
          }}
        />
      </Drawer>

      */
