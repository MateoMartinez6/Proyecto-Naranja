import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Pressable } from 'react-native';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    const response = await fetch('http://10.10.0.66:5000/login', {
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
      



      <Text style={styles.title}>Ingresar</Text>
      <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <Text style={styles.linkText} onPress={() => navigation.navigate(`RecuperarContraseña`)}> Recuperar Contraseña </Text>
      <Pressable style={styles.buttons} onPress={handleLogin}> <Text style={styles.buttonText}>Iniciar Sesion</Text></Pressable>
      <View style={styles.divider}/>
      <Text style={styles.subtitle}>¿Nuevo en Libropedia?</Text>
      <Pressable style={styles.buttons} onPress={() => navigation.navigate(`Registro`)}> <Text style={styles.buttonText}>Registrarse</Text> </Pressable>
    </View>
  );
}

function RegisterScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');


  const handleRegister = async () => {
    const response = await fetch('http://10.10.0.66:5000/register', {
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
      


      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Correo electrónico" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <Text style={styles.advert}>ⓘ La contraseña debe tener minimo 6 digitos.</Text>
      <Pressable style={styles.buttons} onPress={() => navigation.navigate(`Login`)}> <Text style={styles.buttonText}>Registrarse</Text> </Pressable>
    </View>
  );
}

function RecuperarContraseñaScreen({ navigation }) {
  const [email, setEmail] = React.useState('');

  const handleRecover = async () => {
    const response = await fetch('http://10.10.0.66:5000/recover-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert('Revisa tu correo', data.message);
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.message);
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Enviar" color="#C4AE95" onPress={handleRecover} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 40, fontFamily:`Georgia` },
  title: { fontSize: 18, marginBottom: 20, textAlign: 'left', fontFamily: `Georgia` },
  headerImage: { width: 350, height: 100, alignSelf: 'center', marginBottom: 20 },
  linkText: {color:`#000000`, textDecorationLine:'underline', margingBottom:10, textAlign:'right', fontFamily: `Georgia`},
  subtitle: {textAlign: `center`, fontFamily:`Georgia`},
  buttons: {backgroundColor:(`#4E342E`), paddingVertical:12, paddingHorizontal:20, borderRadius:5, marginVertical:10, alignItems:`center`, justifyContent:`center` },
  buttonText: {color:`#ffffff`, fontFamily:`Georgia`, fontSize: 16},
  divider: {height:1, width:`100%`, marginVertical:20, color:`#000000`},
  advert: {fontSize:12, color: `#a9a9a9`}
});