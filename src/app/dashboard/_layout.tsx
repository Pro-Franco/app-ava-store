import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="profile" options={{ drawerLabel: 'Profile' }} />
        <Drawer.Screen name="clientes" options={{ drawerLabel: 'Clientes' }} />
        <Drawer.Screen name="exemplos" options={{ drawerLabel: 'Exemplos' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
