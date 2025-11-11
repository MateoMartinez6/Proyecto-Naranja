import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, onValue, push, get, child } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
//import { db } from './.expo/src/config/firebaseconfig.js'; // Tu configuración de Firebase
import { db, auth } from "./firebase-config";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
//import { PALETTE } from '@/constants/theme';
import { PALETTE } from "./theme";
//import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const w = Dimensions.get("window").width;
const GRID_PADDING = 24;
const GRID_GAP = 16;
const CARD_W = (w - GRID_PADDING * 2 - GRID_GAP) / 2;
const COVER_H = CARD_W * 1.45;

// -------------------- LOGIN --------------------
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const usuariosRef = ref(db, "Usuarios");
      onValue(usuariosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          //const usuariosArray = Object.values(data).filter((item) => item !== null);
          //const usuariosArray = Object.values(data).filter((item) => item == null);
          const usuariosArray = Object.values(data).filter(
            (item) => item != null
          );
          const adaptado = usuariosArray.map((user, index) => ({
            id: index.toString(),
            Apodo: user.Apodo,
            pass: user.Contraseña,
          }));

          const usuarioEncontrado = adaptado.find(
            (user) => user.Apodo === username && user.pass === password
          );

          if (usuarioEncontrado) {
            Alert.alert("Bienvenido", "todo salio bien");
          } else {
            Alert.alert("Error", "Usuario o contraseña incorrectas");
          }
        }
      });
    } catch (e) {
      Alert.alert("Error de red", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Text style={styles.title}>Ingresar</Text>
        <TextInput
          placeholder="Usuario"
          style={styles.input}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("RecuperarContraseña")}
        >
          Recuperar Contraseña
        </Text>
        <Pressable style={styles.buttons} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Pressable>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>¿Nuevo en Libropedia?</Text>
        <Pressable
          style={styles.buttons}
          onPress={() => navigation.navigate("Registro")}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- REGISTRO --------------------
function RegisterScreen({ navigation }) {
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const usuariosRef = ref(db, "Usuarios/");
      await push(usuariosRef, {
        id: uid,
        Apodo: user,
        mail: email,
        Contraseña: password,
      });

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  // const handleRegister = async () => {
  //   const auth = getAuth();
  //   try {
  //     console.log ('test:',user,'password',password);
  //   await createUserWithEmailAndPassword(auth, email, password);
  //   navigation.navigate('Login');
  //   const usuariosRef = ref(db, "Usuarios");
  //     onValue(usuariosRef, (snapshot) => {
  //       const data = snapshot.val();
  //       if (data) {
  //         const usuariosArray = Object.values(data).filter((item) => item == null);
  //         const adaptado = usuariosArray.map((user, index) => ({
  //           id: index.toString(),
  //           Apodo: user.Apodo,
  //           correo: user.mail,
  //           pass: user.Contraseña
  //         }));
  //       }
  //       Alert.alert('Éxito', 'Usuario registrado correctamente');
  //   });
  //   } catch (error) {
  //   Alert.alert('Error', error.message);
  //   }
  // };

  /*const auth = createUserWithEmailAndPassword(auth, email, password)
  .then((userCredentuial) => {
    const user = userCredentuial.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  })*/

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          placeholder="Usuario"
          style={styles.input}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        <Text style={styles.advert}>
          ⓘ La contraseña debe tener mínimo 6 dígitos.
        </Text>
        <Pressable style={styles.buttons} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- RECUPERAR CONTextTRASEÑA --------------------
function RecuperarContraseñaScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    console.log("handleRecover called, email=", email);
    const mail = (email || "").trim();
    if (!mail) {
      Alert.alert("Error", "Ingrese su correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      const usuariosRef = ref(db, "Usuarios");
      const snapshot = await get(usuariosRef);
      console.log("snapshot.exists=", snapshot.exists());
      if (!snapshot.exists()) {
        Alert.alert("Error", "No hay usuarios registrados.");
        return;
      }

      const data = snapshot.val();
      const usuariosArray = Object.values(data).filter((u) => u != null);
      const usuario = usuariosArray.find((u) => {
        return (
          (u.mail && u.mail.toLowerCase() === mail.toLowerCase()) ||
          (u.Apodo && u.Apodo.toLowerCase() === mail.toLowerCase())
        );
      });

      if (!usuario) {
        Alert.alert("Error", "No existe una cuenta con ese correo.");
        return;
      }

      const contraseña = usuario.Contraseña ?? usuario.password ?? usuario.pass;
      if (!contraseña) {
        Alert.alert("Error", "La contraseña no está almacenada.");
        return;
      }

      Alert.alert("Contraseña", String(contraseña));
    } catch (error) {
      console.log("handleRecover error:", error);
      Alert.alert("Error", error?.message || String(error));
    } finally {
      setLoading(false);
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
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={styles.buttons}
          onPress={handleRecover}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar"}
          </Text>
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
        const adaptados = librosArray.map((libro, index) => {
          // extraer campo de imagen (ajustar nombre si tu campo es otro)
          let coverRaw =
            libro.cover || libro.imagen || libro.imagenBase64 || "";

          // Si es base64 puro sin prefijo, añadimos prefijo data URI (asumimos jpeg, cambia si usas png)
          let cover = coverRaw;
          if (
            coverRaw &&
            !coverRaw.startsWith("http") &&
            !coverRaw.startsWith("data:")
          ) {
            cover = `data:image/jpeg;base64,${coverRaw}`;
          }

          // fallback si no hay imagen
          if (!cover) {
            cover = "https://via.placeholder.com/300x450?text=No+Image";
          }

          return {
            id: index.toString(),
            titulo: libro.Titulo || "Sin título",
            autor: libro.Autor || "Autor desconocido",
            cover,
            paginas: libro["Cantidad de Paginas"] || "",
            sinopsis: libro.Sinopsis || "",
          };
        });
        setLibros(adaptados);
      } else {
        setLibros([]);
      }
    });
  }, []);

  const renderLibro = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("DetalleLibro", { libro: item })}
      style={styles.card}
    >
      <Image
        source={{ uri: item.cover }}
        style={styles.cover}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.titulo}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "5%",
          }}
        >
          Libropedia
        </Text>
        <Text style={styles.topBarText}>Libros | Comics | Manga</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id}
          renderItem={renderLibro}
          numColumns={2}
          columnWrapperStyle={{
            gap: GRID_GAP,
            paddingHorizontal: GRID_PADDING,
          }}
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
        const arrayResenas = Object.values(data).filter(
          (r) => r !== null && r["ID Libro"] === libro.id
        );
        setResenas(arrayResenas);
      }
    });
  }, []);
  // asegurar que la uri esté en formato data: o http
  let imgUri = libro.cover || "";
  if (imgUri && !imgUri.startsWith("http") && !imgUri.startsWith("data:")) {
    imgUri = `data:image/jpeg;base64,${imgUri}`;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        {/* 🔹 Imagen del libro */}
        <Image
          source={{
            uri: libro.cover,
          }}
          style={{
            width: 200,
            height: 300,
            borderRadius: 8,
            marginBottom: 16,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
        />

        {/* 🔹 Datos del libro */}
        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
          {libro.titulo}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Autor: {libro.autor}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>
          Páginas: {libro.paginas}
        </Text>
        <Text style={{ marginTop: 12, textAlign: "justify" }}>
          {libro.sinopsis}
        </Text>

        {/* 🔹 Botón para escribir reseña */}
        <Pressable
          style={{
            backgroundColor: "#4E342E",
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            alignItems: "center",
            width: "100%",
          }}
          onPress={() =>
            navigation.navigate("ResenaScreen", { libro, usuarioId: 1 })
          }
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Escribir reseña
          </Text>
        </Pressable>

        {/* 🔹 Sección de reseñas */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 24,
            alignSelf: "flex-start",
          }}
        >
          Reseñas
        </Text>

        {resenas.length === 0 && (
          <Text style={{ marginTop: 8 }}>Aún no hay reseñas.</Text>
        )}

        {resenas.map((r, index) => (
          <View
            key={index}
            style={{
              marginTop: 12,
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#ccc",
              width: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Usuario: {r["ID Usuario"]}
            </Text>
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
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Libropedia
        </Text>

        <Pressable
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() =>
            Alert.alert("Sesión cerrada", "Has salido de tu cuenta.")
          }
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16 }}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// -------------------- CONFIGURACION DE CUENTA --------------------
function ConfigCuentaScreen({ route, navigation }) {
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
  );
}

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
      Valoracion: parseInt(valoracion),
      contenido: contenido,
      "ID Libro": libro.id,
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
      <Text style={{ fontSize: 22, marginBottom: 12 }}>
        Escribir reseña para:
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        {libro.titulo}
      </Text>

      <TextInput
        placeholder="Valoración (1-5)"
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
        }}
        keyboardType="numeric"
        onChangeText={setValoracion}
        value={valoracion}
      />
      <TextInput
        placeholder="Escribe tu reseña..."
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
          height: 120,
          textAlignVertical: "top",
        }}
        multiline
        onChangeText={setContenido}
        value={contenido}
      />

      <Pressable
        style={{
          backgroundColor: "#4E342E",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
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
      <Stack.Screen
        name="RecuperarContraseña"
        component={RecuperarContraseñaScreen}
      />
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleLibro"
        component={DetalleLibroScreen}
        options={{ title: "Detalle" }}
      />
      <Stack.Screen
        name="ResenaScreen"
        component={ResenaScreen}
        options={{ title: "Escribir Reseña" }}
      />
      <Stack.Screen name="Mas" component={MasScreen} />
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: PALETTE.paper,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 40,
    fontFamily: "Georgia",
    borderColor: PALETTE.border,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: "left",
    fontFamily: "Georgia",
  },
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
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 20,
    backgroundColor: "#00000010",
  },
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
    width: 35,
    height: 35,
    borderRadius: 22,
    backgroundColor: PALETTE.brown,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "25%",
  },
});
