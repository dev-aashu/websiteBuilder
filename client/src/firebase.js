// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsVD3145JFB7AVsqAjAHr_mzwiVJDGfZs",
  authDomain: "genwebai-b9834.firebaseapp.com",
  projectId: "genwebai-b9834",
  storageBucket: "genwebai-b9834.firebasestorage.app",
  messagingSenderId: "781059036551",
  appId: "1:781059036551:web:7ec5074276489168d9af22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
