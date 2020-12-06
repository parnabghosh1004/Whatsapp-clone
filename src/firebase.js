import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCaDP0kbLVEDwpfOaP1c0CFlALOpjvEQ34",
    authDomain: "whatsapp-react-79281.firebaseapp.com",
    databaseURL: "https://whatsapp-react-79281.firebaseio.com",
    projectId: "whatsapp-react-79281",
    storageBucket: "whatsapp-react-79281.appspot.com",
    messagingSenderId: "890399938333",
    appId: "1:890399938333:web:36a077768f1911dd21f3f4",
    measurementId: "G-0KYY0KXL63"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

// db
const db = firebaseApp.firestore()

// google auth
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db;