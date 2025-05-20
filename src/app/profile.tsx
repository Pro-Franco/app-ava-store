import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [token, setToken] = useState('');
  const router = useRouter();

  async function saveToken(token: string) {
    await AsyncStorage.setItem('userToken', token);
  }

  async function getToken() {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  }

  async function removeToken() {
    await AsyncStorage.removeItem('userToken');
  }

  function handleLogout() {
    logout();
    removeToken();
    router.replace('/');
  }

  function handleClientes() {
    router.push('/components/clientes');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, {user?.email}</Text>
      <TextInput
        placeholder="digite o token"
        value={token}
        onChangeText={setToken}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Gravar token"
          onPress={async () => {
            await saveToken(token);
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Ler token"
          onPress={async () => {
            const token = await getToken();
            console.log(token);
            alert(token);
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Remover token"
          onPress={async () => {
            await removeToken();
          }}
        />
      </View>

      <Button title="Clientes" onPress={handleClientes} />

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: { fontSize: 20, marginBottom: 20, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: '#333'
  },
  buttonContainer: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    overflow: 'hidden', // importante para aplicar borderRadius
    marginBottom: 10
  }
});
