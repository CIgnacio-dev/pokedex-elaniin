import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push, get, remove, set } from "firebase/database";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8vyoPR8HgGI2WW1l765LRFJPRc0_7_1s",
  authDomain: "pokedex-elaniin-fa60c.firebaseapp.com",
  projectId: "pokedex-elaniin-fa60c",
  storageBucket: "pokedex-elaniin-fa60c.appspot.com",
  messagingSenderId: "19176150784",
  appId: "1:19176150784:web:25977f53b121c4650f05e5",
};

// Inicialización
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const logout = () => signOut(auth);

export const userObserver = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Guardar equipo en Firebase
export const saveTeamToFirebase = (team, userName, region) => {
  const newTeam = {
    user: userName,
    region: region,
    pokemons: team,
    createdAt: new Date().toISOString(),
  };

  return push(ref(db, "teams"), newTeam);
};


export const getTeamsFromFirebase = async () => {
    const teamsRef = ref(db, "teams");  // <- ruta correcta
  
    try {
      const snapshot = await get(teamsRef);
  
      if (!snapshot.exists()) {
        return [];
      }
  
      const data = snapshot.val();
  
      // ahora trae el id (key) de cada equipo
      return Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
  
    } catch (error) {
      console.error("Error al obtener equipos de Firebase:", error);
      return [];
    }
  };
  
 
  

  export const deleteTeamFromFirebase = async (id) => {
    try {
      await remove(ref(db, `teams/${id}`));  
      alert("Equipo eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando equipo:", error);
      alert("Hubo un error al eliminar el equipo");
    }
  };
  
  