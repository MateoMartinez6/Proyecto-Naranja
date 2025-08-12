import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

// Importa el módulo de autenticación de Firebase
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const iniciarSesion = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // firestore().collection('usuarios').where('nombreUsuario', '==', nombreUsuario).get();
      // por ejemplo si te queres traer de una tabla podes hacerlo con collection
      // y si queres algo especifico ponele ahi esta por un nombre de usuario concreto lo podes
      // traer con un get

      setIsLoggedIn(true);
      Alert.alert('Éxito', '¡Sesión iniciada!');
    }
  };

  const cerrarSesion = async () => {
    try {
      await auth().signOut();
      setIsLoggedIn(false);
      Alert.alert('Éxito', '¡Sesión cerrada!');
    }
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View>
          <Text style={styles.text}>Estás conectado</Text>
          <Button title="Cerrar Sesión" onPress={cerrarSesion} />
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Inicia Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Iniciar Sesión" onPress={iniciarSesion} />
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
