import React from 'react';
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

// LOGIN 
function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.10.0.66:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Bienvenido', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
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

//  REGISTRO 
function RegisterScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch("http://10.10.0.66:5000/register", {
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

// RECUPERAR CONTRASEÑA
function RecuperarContraseñaScreen({ navigation }) {
  const [email, setEmail] = React.useState('');

  const handleRecover = async () => {
    try {
      const response = await fetch("http://10.10.0.66:5000/recover-password", {
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

//  HOME 
function HomeScreen({ navigation }) {
  const libros = [
    {
      id: "1",
      titulo: "La asistenta",
      autor: "Freida McFadden",
      cover: "https://m.media-amazon.com/images/I/71pP8yP1rQL.jpg",
    },
    {
      id: "2",
      titulo: "El puente donde habitan las mariposas",
      autor: "Nazareth Castellanos",
      cover: "https://m.media-amazon.com/images/I/81l8o3m3duL.jpg",
    },
    {
      id: "3",
      titulo: "Siempre nos quedará el verano",
      autor: "Jenny Han",
      cover: "https://m.media-amazon.com/images/I/81z0q3o6s0L.jpg",
    },
    {
      id: "4",
      titulo: "Reino de sombras",
      autor: "Sophie Jordan",
      cover: "https://m.media-amazon.com/images/I/71cR9dKQG5L.jpg",
    },
  ];

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
      {/* BARRA SUPERIOR */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Libros | Comics | Manga</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: GRID_PADDING, paddingTop: 16 }}>
          <Text style={styles.sectionHeader}>Filtros</Text>
          <Text style={[styles.sectionHeader, { marginTop: 8 }]}>Más Recientes</Text>
        </View>

        {/* GRILLA 2x2 */}
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

//  DETALLE LIBRO 
function DetalleLibroScreen({ route }) {
  const { libro } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.paper }}>
      <View style={styles.container}>
        <Image source={{ uri: libro.cover }} style={{ width: 200, height: 300, borderRadius: 8, marginBottom: 16 }} />
        <Text style={styles.title}>{libro.titulo}</Text>
        <Text style={styles.subtitle}>Autor: {libro.autor}</Text>
      </View>
    </SafeAreaView>
  );
}

// STACKS 
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DetalleLibro" component={DetalleLibroScreen} options={{ title: "Detalle" }} />
    </Stack.Navigator>
  );
}

//  TABS PRINCIPALES 
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
                <Ionicons name={icon} size={20} color="#fff" />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="Cuenta" component={AuthStack} />
        <Tab.Screen
          name="Mas"
          component={() => <View style={{ flex: 1, backgroundColor: "#fff" }} />}
          options={{ tabBarAccessibilityLabel: "Más" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//  ESTILOS 
const styles = StyleSheet.create({
  // layout base
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

  // top bar estilo foto
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

  // secciones
  sectionHeader: { fontFamily: "Georgia", fontSize: 18, color: "#000" },

  // tarjetas de grilla
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

  // tab inferior con “botoncitos” redondos
  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.brown,
    alignItems: "center",
    justifyContent: "center",
  },
});
