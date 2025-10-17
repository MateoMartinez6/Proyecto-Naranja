import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ref, onValue, push } from 'firebase/database';
import { db } from './.expo/src/config/firebaseconfig.js'; // Tu configuración de Firebase

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PALETTE = {
  beige: '#CDB299',    
  brown: '#4E342E',     
  paper: '#FFFFFF',
  border: '#E3DACF',
  text: '#000000',
};

const w = Dimensions.get('window').width;
const GRID_PADDING = 24;
const GRID_GAP = 16;
const CARD_W = (w - GRID_PADDING * 2 - GRID_GAP) / 2;
const COVER_H = CARD_W * 1.45;

// -------------------- LOGIN --------------------
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const usuariosRef = ref(db, "Usuarios");
      onValue(usuariosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usuariosArray = Object.values(data).filter((item) => item !== null);
          const adaptado = usuariosArray.map((user, index) => ({
            id: index.toString(),
            Apodo: user.Apodo,
            pass: user.Contraseña 
          }));

          const usuarioEncontrado = adaptado.find(
            (user) => user.Apodo === username && user.pass === password
          );
          
          if (usuarioEncontrado) {
            Alert.alert('Bienvenido', "todo salio bien");
          } else {
            Alert.alert('Error', "todo salio bien pero, user o pass incorrectas");
          }
        }
      });
    } catch (e) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Text style={styles.title}>Ingresar</Text>
        <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
        <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
        <Text style={styles.linkText} onPress={() => navigation.navigate('RecuperarContraseña')}>
          Recuperar Contraseña
        </Text>
        <Pressable style={styles.buttons} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Pressable>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>¿Nuevo en Libropedia?</Text>
        <Pressable style={styles.buttons} onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- REGISTRO --------------------
function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

 /* const handleRegister = async () => {
    try {
      const response = await fetch("https://libropedia-f69f8-default-rtdb.firebaseio.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Registro exitoso", data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (e) {
      Alert.alert("Error de red", "No se pudo conectar con el servidor.");
    }
  };*/

    const handleRegister = async () => {
    try {
      const usuariosRef = ref(db, "Usuarios");
      onValue(usuariosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usuariosArray = Object.values(data).filter((item) => item == null);
          const adaptado = usuariosArray.map((user, index) => ({
            id: index.toString(),
            Apodo: user.Apodo,
            pass: user.Contraseña, 
            correo: user.mail
          }));

          const usuarioNoEncontrado = adaptado.set(
            (user) => user.Apodo === username && user.pass === password && user.correo === email
          );
          
          if (usuarioNoEncontrado) {
            Alert.alert('Bienvenido', "todo salio bien");
          } else {
            Alert.alert('Error', "todo salio bien pero, user o pass incorrectas");
          }
        }
      });
    } catch (e) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsername} />
        <TextInput placeholder="Correo electrónico" style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={setPassword} />
        <Text style={styles.advert}>ⓘ La contraseña debe tener mínimo 6 dígitos.</Text>
        <Pressable style={styles.buttons} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- RECUPERAR CONTRASEÑA --------------------
function RecuperarContraseñaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRecover = async () => {
    try {
      const response = await fetch("https://libropedia-f69f8-default-rtdb.firebaseio.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Revisa tu correo", data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (e) {
      Alert.alert("Error de red", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Pressable style={styles.buttons} onPress={handleRecover}>
          <Text style={styles.buttonText}>Enviar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- HOME SCREEN --------------------
function HomeScreen({ navigation }) {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const librosRef = ref(db, "Libros");
    onValue(librosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const librosArray = Object.values(data).filter((item) => item !== null);
        const adaptados = librosArray.map((libro, index) => ({
          id: index.toString(),
          titulo: libro.Titulo || "Sin título",
          autor: libro.Autor || "Autor desconocido",
          cover: libro.cover || "https://via.placeholder.com/150",
          paginas: libro["Cantidad de Paginas"] || "",
          sinopsis: libro.Sinopsis || "",
        }));
        setLibros(adaptados);
      }
    });
  }, []);

  const renderLibro = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("DetalleLibro", { libro: item })}
      style={styles.card}
    >
      <Image source={{ uri: item.cover }} style={styles.cover} resizeMode="cover" />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.titulo}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Libros | Comics | Manga</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: GRID_PADDING, paddingTop: 16 }}>
          <Text style={styles.sectionHeader}>Filtros</Text>
          <Text style={[styles.sectionHeader, { marginTop: 8 }]}>Más Recientes</Text>
        </View>

        <FlatList
          data={libros}
          keyExtractor={(item) => item.id}
          renderItem={renderLibro}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GAP, paddingHorizontal: GRID_PADDING }}
          ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
          scrollEnabled={false}
          contentContainerStyle={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------- DETALLE LIBRO --------------------
function DetalleLibroScreen({ route, navigation }) {
  const { libro } = route.params;
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    const resenasRef = ref(db, "Reseñas");
    onValue(resenasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arrayResenas = Object.values(data)
          .filter(r => r !== null && r["ID Libro"] === libro.id);
        setResenas(arrayResenas);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Image source={{ uri: libro.cover }} style={{ width: 200, height: 300, borderRadius: 8, marginBottom: 16 }} />
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{libro.titulo}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Autor: {libro.autor}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Páginas: {libro.paginas}</Text>
        <Text style={{ marginTop: 12 }}>{libro.sinopsis}</Text>

        <Pressable
          style={{ backgroundColor: "#4E342E", padding: 12, borderRadius: 8, marginTop: 16, alignItems: "center" }}
          onPress={() => navigation.navigate("ResenaScreen", { libro, usuarioId: 1 })}
        >
          <Text style={{ color: "#fff" }}>Escribir reseña</Text>
        </Pressable>

        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 24 }}>Reseñas</Text>
        {resenas.length === 0 && <Text style={{ marginTop: 8 }}>Aún no hay reseñas.</Text>}
        {resenas.map((r, index) => (
          <View key={index} style={{ marginTop: 12, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ccc" }}>
            <Text style={{ fontWeight: "bold" }}>Usuario: {r["ID Usuario"]}</Text>
            <Text>Valoración: {r.Valoracion} ⭐</Text>
            <Text style={{ marginTop: 4 }}>{r.contenido}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
function MasScreen({ route, navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: "bold", 
          textAlign: "center", 
          marginBottom: 20 
        }}>
          Libropedia
        </Text>

        <Pressable
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            alignItems: "center"
          }}
          onPress={() => navigation.navigate("Mas")} // o a donde quieras llevar
        >
          <Ionicons name="settings-outline" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16 }}>Configuración Cuenta</Text>
        </Pressable>

        <Pressable
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            alignItems: "center"
          }}
          onPress={() => Alert.alert("Sesión cerrada", "Has salido de tu cuenta.")}
        >
          <Ionicons name="log-out-outline" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16 }}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )}


  function ConfigCuentaScreen({route, navigation}) {
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [actualPass, setActualPass] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");

  const handleSave = () => {
    Alert.alert("Guardado", "Los cambios fueron actualizados (demo)");
    // acá podrías hacer fetch a tu API para guardar cambios
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          ⚙️ Configuración Cuenta
        </Text>

        {/* Cambiar usuario */}
        <Text style={{ fontSize: 16, marginBottom: 6 }}>Cambiar usuario</Text>
        <TextInput
          placeholder="Ingresar nuevo usuario"
          style={styles.input}
          value={nuevoUsuario}
          onChangeText={setNuevoUsuario}
        />

        {/* Cambiar contraseña */}
        <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 6 }}>
          Cambiar contraseña
        </Text>
        <TextInput
          placeholder="Ingresar contraseña actual"
          secureTextEntry
          style={styles.input}
          value={actualPass}
          onChangeText={setActualPass}
        />
        <TextInput
          placeholder="Ingresar nueva contraseña"
          secureTextEntry
          style={styles.input}
          value={nuevaPass}
          onChangeText={setNuevaPass}
        />

        {/* Cambiar correo */}
        <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 6 }}>
          Cambiar correo electrónico
        </Text>
        <TextInput
          placeholder="Ingresar nuevo correo"
          keyboardType="email-address"
          style={styles.input}
          value={nuevoCorreo}
          onChangeText={setNuevoCorreo}
        />

        <Pressable
          style={[styles.buttons, { marginTop: 30 }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )}






// -------------------- PANTALLA RESEÑA --------------------
function ResenaScreen({ route, navigation }) {
  const { libro, usuarioId } = route.params;

  const [valoracion, setValoracion] = useState("");
  const [contenido, setContenido] = useState("");

  const handleGuardar = () => {
    if (!valoracion || !contenido) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const nuevaResena = {
      "ID Usuario": usuarioId,
      "Libro Finalizado": true,
      "Valoracion": parseInt(valoracion),
      "contenido": contenido,
      "ID Libro": libro.id
    };

    const resenasRef = ref(db, "Reseñas");
    push(resenasRef, nuevaResena)
      .then(() => {
        Alert.alert("Éxito", "Reseña guardada!");
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert("Error", "No se pudo guardar la reseña");
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Escribir reseña para:</Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>{libro.titulo}</Text>

      <TextInput
        placeholder="Valoración (1-5)"
        style={{ borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 8 }}
        keyboardType="numeric"
        onChangeText={setValoracion}
        value={valoracion}
      />
      <TextInput
        placeholder="Escribe tu reseña..."
        style={{ borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 8, height: 120, textAlignVertical: "top" }}
        multiline
        onChangeText={setContenido}
        value={contenido}
      />

      <Pressable
        style={{ backgroundColor: "#4E342E", padding: 12, borderRadius: 8, alignItems: "center" }}
        onPress={handleGuardar}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Guardar reseña</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// -------------------- STACKS --------------------
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} />
      <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: PALETTE.beige },
        headerTitleStyle: { fontFamily: "Georgia", color: PALETTE.text },
        headerTintColor: PALETTE.text,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DetalleLibro" component={DetalleLibroScreen} options={{ title: "Detalle" }} />
      <Stack.Screen name="ResenaScreen" component={ResenaScreen} options={{ title: "Escribir Reseña" }} />
      <Stack.Screen name="Mas" component={MasScreen}/>
      <Stack.Screen name="ConfigCuenta" component={ConfigCuentaScreen} />
    </Stack.Navigator>
  );
}

// -------------------- TABS --------------------
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: PALETTE.beige,
            height: 68,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarIcon: ({ focused }) => {
            let icon = "home";
            if (route.name === "HomeTab") icon = "home";
            if (route.name === "Cuenta") icon = "person";
            if (route.name === "Mas") icon = "menu";
            return (
              <View style={[styles.tabButton, focused && { opacity: 0.9 }]}>
                <Ionicons name={icon} size={20} color="#ffffffff" />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="Cuenta" component={AuthStack} />
        <Tab.Screen
          name="Mas"
          component={MasScreen}
          options={{ tabBarAccessibilityLabel: "Mas" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}




// -------------------- ESTILOS --------------------
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: PALETTE.paper },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 40,
    fontFamily: "Georgia",
    borderColor: PALETTE.border,
  },
  title: { fontSize: 22, marginBottom: 16, textAlign: "left", fontFamily: "Georgia" },
  linkText: {
    color: PALETTE.text,
    textDecorationLine: "underline",
    marginBottom: 10,
    textAlign: "right",
    fontFamily: "Georgia",
  },
  subtitle: { textAlign: "center", fontFamily: "Georgia", color: "#333" },
  buttons: {
    backgroundColor: PALETTE.brown,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#ffffff", fontFamily: "Georgia", fontSize: 16 },
  divider: { height: 1, width: "100%", marginVertical: 20, backgroundColor: "#00000010" },
  advert: { fontSize: 12, color: "#777" },

  topBar: {
    backgroundColor: PALETTE.beige,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: PALETTE.border,
  },
  topBarText: {
    fontFamily: "Georgia",
    fontSize: 18,
    letterSpacing: 1,
    color: PALETTE.text,
  },

  sectionHeader: { fontFamily: "Georgia", fontSize: 18, color: "#000" },

  card: {
    width: CARD_W,
    alignItems: "center",
  },
  cover: {
    width: CARD_W,
    height: COVER_H,
    borderRadius: 6,
    backgroundColor: "#f1f1f1",
  },
  cardTitle: {
    fontFamily: "Georgia",
    fontSize: 16,
    marginTop: 8,
    color: "#000",
  },

  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.brown,
    alignItems: "center",
    justifyContent: "center",
  },

  
});