// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3Im6F3lWgMbJiA7plsDt_Rp9kCLTr6KU",
  authDomain: "kingdom-commerce.firebaseapp.com",
  projectId: "kingdom-commerce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };1