import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
const Stack = createNativeStackNavigator();
function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleLogin = async () => {
    const response = await fetch('http://<10.10.0.66>:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert('Bienvenido', data.message);
    } else {
      Alert.alert('Error', data.message);
    }
  };

  return (
    <View style={styles.container}>
       <img src="header.png"/>
      <Text style={styles.title}>Iniciar Sesion</Text>
      <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <Button title="Iniciar sesión" backgroundcolor="#C4AE95" onPress={handleLogin} />
      <Text> ¿Nuevo en Libropedia? </Text>
      <Button title="Registrarse" backgroundcolor="#C4AE95" onPress={() => navigation.navigate('Registro')} />
    </View>
  );
}
function RegisterScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleRegister = async () => {
    const response = await fetch('http://<10.10.0.66>:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert('Registro exitoso', data.message);
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.message);
    }
  };

  return (
    <View style={styles.container}>
      <img src="header.png"/>
      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <Button title="Registrarse" backgroundcolor="#C4AE95" onPress={handleRegister} />
    </View>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 40 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' }
});
