import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyD3gbJ_o0b_Et-Ym8ifiPOOpYo2RqO9yjg",
    authDomain: "andrlee-wireframer-rrf.firebaseapp.com",
    databaseURL: "https://andrlee-wireframer-rrf.firebaseio.com",
    projectId: "andrlee-wireframer-rrf",
    storageBucket: "andrlee-wireframer-rrf.appspot.com",
    messagingSenderId: "428571563833",
    appId: "1:428571563833:web:a32c85e1fb3e7ca9e0fae8",
    measurementId: "G-YV76MVXTSN"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;