import firebase from 'firebase';

require('@firebase/firestore');
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBYts0TiMrRAUSvjY5KYtUyaKeBaJ6ImYw",
    authDomain: "book-santa-6b791.firebaseapp.com",
    databaseURL: "https://book-santa-6b791.firebaseio.com",
    projectId: "book-santa-6b791",
    storageBucket: "book-santa-6b791.appspot.com",
    messagingSenderId: "862900327866",
    appId: "1:862900327866:web:156d2d9ed486f6f893f983"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
export default firebase.firestore();