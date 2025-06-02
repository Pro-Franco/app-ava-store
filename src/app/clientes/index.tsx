import { View } from 'react-native';
import Clientes from '../dashboard/clientes'; // ou o caminho correto

export default function ClientesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Clientes />
    </View>
  );
}
