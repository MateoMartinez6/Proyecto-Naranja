import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAtC2wTrNHLc7aCW-cj2Ksg2q2RPQApHZs",
  authDomain: "libropedia-f69f8.firebaseapp.com",
  databaseURL: "https://libropedia-f69f8-default-rtdb.firebaseio.com",
  projectId: "libropedia-f69f8",
  storageBucket: "libropedia-f69f8.appspot.com",
  messagingSenderId: "",
  appId: "1:103020737380:android:ef1199a77261f52cfd8071"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


{
  "Libros"; [
    null,
    {
      "Cantidad de Paginas": 344,
      "Fecha de Publicacion": "12/5/2023",
      "Formatos": [
        "Fisico",
        "Digital",
        "Audiolibro"
      ],
      "Sinopsis": "A",
      "Titulo": "La Asistenta"
  
    },
    {
      "Cantidad de Paginas": "",
      "Fecha de Publicacion": "",
      "Formatos": [
        "",
        ""
      ],
      "Sinopsis": "",
      "Titulo": ""
    },
    {
      "Cantidad de Paginas": 280,
      "Fecha Publicacion": "",
      "Formatos": [
        "Fisico",
        "",
        ""
      ],
      "Sinopsis": "El cerebro es un órgano plástico, que puede ser esculpido con la intención y la voluntad como herramientas. Conocer su capacidad para aprender y adaptarse al entorno es descubrir aquello que nos construye desde fuera. Pero, paradójicamente, es esa misma plasticidad neuronal la que nos brinda la oportunidad de transformarnos desde dentro.",
      "Titulo": "El Puente Donde Habitan Las Mariposas"
    },
    {
      "Cantidad de Paginas": 288,
      "Fecha de Publicacion": "26/4/2011",
      "Formatos": [
        "Fisico",
        "Digital",
        ""
      ],
      "Sinopsis": "Belly solo ha querido a dos chicos en su vida. Y ambos se apellidan Fisher. Tras salir con Jeremiah durante los últimos dos años, está casi segura de que es su alma gemela. En cambio, Conrad no ha superado el error de haberla dejado escapar, así que cuando Belly y Jere deciden dar un paso más en su relación, sabe que ha llegado el momento de hablar ahora o callar para siempre. Decida lo que decida, Belly deberá enfrentarse a lo inevitable: tendrá que romperle el corazón a uno de los dos.",
      "Titulo": "Siempre nos Quedara el Verano"
    }
  ],
  "Playlist"; [
    null,
    {
      "ID Usuario": 1,
      "Libros": {
        "ID Libro": 2
      },
      "Nombre": "Favoritos"
    }
  ],
  "Reseñas"; [
    null,
    {
      "ID Usuario": 1,
      "Libro Finalizado": true,
      "Valoracion": 4,
      "contenido": "Muy bueno......"
    }
  ],
  "Usuarios"; [
    null,
    {
      "Apodo": "Juan123",
      "Contraseña": "123456",
      "Creacion de Cuenta": "12/9/2025",
      "mail": ""
    },
    {
      "Apodo": "Citrik",
      "Contraseña": "Proyecto2025",
      "Creacion de Cuenta": "23/9/2025",
      "mail": "citrikstudio.proyecto@gmail.com"
    }
  ]
}
