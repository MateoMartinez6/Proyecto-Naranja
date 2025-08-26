import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/config/firebaseConfig.js';

const ListaDeLibros = () => {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const obtenerLibros = async () => {
      const librosRef = collection(db, "libros");
      const snapshot = await getDocs(librosRef);
      const listaLibros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLibros(listaLibros);
    };

    obtenerLibros();
  }, []);

  return (
    <View>
      {libros.map(libro => (
        <Text key={libro.id}>{libro.titulo}</Text>
      ))}
    </View>
  );
};

export default ListaDeLibros;
