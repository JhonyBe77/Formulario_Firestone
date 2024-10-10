const firebaseConfig = {
  apiKey: "AIzaSyDQXweg-RIGKkSkWFlrghWXOgGbaTJEWfg",
  authDomain: "formdemo-311fa.firebaseapp.com",
  projectId: "formdemo-311fa",
  storageBucket: "formdemo-311fa.appspot.com",
  messagingSenderId: "258720340089",
  appId: "1:258720340089:web:af2ea1b82f06e74acddca8",
  measurementId: "G-4QB6YKF28P"
};

firebase.initializeApp(firebaseConfig);
const formdb = firebase.firestore();


//Create: añade los datos a Firestone
const addData = (contact) => {
  formdb.collection("usuario")
    .add(contact)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      readAll(); // Volver a leer todos los contactos después de añadir uno nuevo
    })
    .catch((error) => console.error("Error adding document: ", error));
};

//Read all
const readAll = () => {
  cleanContactList();

  // Leer todos los documentos de la colección "usuario"
  formdb.collection("usuario")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const contact = doc.data();
        printContact(contact.nombre, contact.email, contact.mensaje, contact.urlImagen, doc.id);
      });
    })
    .catch((error) => console.log('Error reading documents:', error));
};

// Función para limpiar la lista de contactos
const cleanContactList = () => {
  document.getElementById('contactList').innerHTML = "";
};

// Función para mostrar un contacto en la lista
const printContact = (nombre, email, mensaje, urlImagen, id) => {
  const listaDeContactos = document.getElementById("contactList");

  let elementoLista = document.createElement("li");
  let contenidoContacto = "<strong>" + nombre + "</strong> (" + email + ")<br>" + mensaje;

  // Mostrar imagen si existe la URL
  if (urlImagen) {
    contenidoContacto += "<br><img src='" + urlImagen + "' alt='Imagen de contacto' width='50'>";
  }

  elementoLista.innerHTML = contenidoContacto;

  // Crear botón para borrar el contacto
  let botonBorrar = document.createElement("button");
  botonBorrar.textContent = "Borrar";
  botonBorrar.dataset.id = id; // Guardar el ID del documento en el botón

  // Borrar contacto de Firestore al hacer clic
  botonBorrar.addEventListener("click", function () {
    let id = this.dataset.id;
    borrarContacto(id);
  });

  elementoLista.appendChild(botonBorrar);
  listaDeContactos.appendChild(elementoLista);
};

// Función para borrar un contacto de Firestore
const borrarContacto = (id) => {
  formdb.collection("usuario").doc(id).delete()
    .then(() => {
      console.log("Document successfully deleted!");
      readAll(); // Volver a leer los contactos después de borrar uno
    })
    .catch((error) => console.error("Error removing document: ", error));
};

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  let formularioDeContacto = document.getElementById("contactForm");
  let botonBorrarTodos = document.getElementById("clearAll");

  readAll(); // Mostrar los contactos guardados en Firestore al cargar la página

  // Cuando el formulario se envía
  formularioDeContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let mensaje = document.getElementById("mensaje").value;
    let urlImagen = document.getElementById("imageUrl").value;

    addData({ nombre, email, mensaje, urlImagen });
    formularioDeContacto.reset(); // Reiniciar el formulario
  });

  botonBorrarTodos.addEventListener("click", function () {
    formdb.collection("usuario").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
      readAll();
    });
  });
});
