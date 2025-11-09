

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCQ2nYoHGlQSwUDUwQljwxWJ-gAEhDeHJU",
    authDomain: "data-belisario.firebaseapp.com",
    databaseURL: "https://data-belisario-default-rtdb.firebaseio.com",
    projectId: "data-belisario",
    storageBucket: "data-belisario.firebasestorage.app",
    messagingSenderId: "228714867759",
    appId: "1:228714867759:web:79c53008669ca7223feada"
  };

// Inicializar Firebase con versión compat
firebase.initializeApp(firebaseConfig);

// Referencia global a la Realtime Database
var db = firebase.database();