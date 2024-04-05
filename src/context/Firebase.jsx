import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyAxju6GXrr-_NmNGViC1vl0GPlFY9DQh_k",
    authDomain: "bookify-5f4d0.firebaseapp.com",
    projectId: "bookify-5f4d0",
    storageBucket: "bookify-5f4d0.appspot.com",
    messagingSenderId: "788883876129",
    appId: "1:788883876129:web:1ae53701c755a0feb1b660"
};

export const useFirebase = () => useContext(FirebaseContext);


const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) setUser(user);
            else setUser(null);
        })

    }, []);

    const signupUserWithEmailAndPassword = (email, password) =>
        createUserWithEmailAndPassword(firebaseAuth, email, password);

    const signinUserWithEmailAndPass = (email, password) =>
        signInWithEmailAndPassword(firebaseAuth, email, password);

    const signinWithGoogle = async () => {
        console.log(`sign in with google function called`)
        console.log(firebaseConfig)
        return await signInWithPopup(firebaseAuth, googleProvider)
    };

    const handleCreateNewListing = async (name, isbn, price, cover) => {
        const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`);
        const uploadResult = await uploadBytes(imageRef, cover);
        return await addDoc(collection(firestore, "books"), {
            name,
            isbn,
            price,
            imageURL: uploadResult.ref.fullPath,
            userID: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });
    };

    const listAllBooks = () => {
        return getDocs(collection(firestore, "books"));
    };

    const placeOrder = async (bookId, qty) => {
        const collectionRef = collection(firestore, "books", bookId, 'orders');
        const result = await addDoc(collectionRef, {
            userID: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            qty: Number(qty),
        })
        return result;
    };

    const fetchMyBooks = async (userId) => {
        const collectionRef = collection(firestore, "books");
        const q = query(collectionRef, where("userID", '==', user.uid))

        const result = await getDocs(q);
        return result;
    };

    const getBookById = async (id) => {
        const docRef = doc(firestore, 'books', id);
        const result = await getDoc(docRef);
        return result;
    }
    const getImageUrl = (path) => {
        console.log("firebaseImageURL function called")
        return getDownloadURL(ref(storage, path));
    };

    const getOrders = async (bookId) => {
        const collectionRef = collection(firestore, "books", bookId, "orders");
        const result = await getDocs(collectionRef);
        return result;
    };


    const isLoggedIn = user ? true : false;


    return (
        <FirebaseContext.Provider value={{
            signupUserWithEmailAndPassword,
            signinUserWithEmailAndPass,
            signinWithGoogle,
            handleCreateNewListing,
            getImageUrl,
            placeOrder,
            fetchMyBooks,
            getBookById,
            listAllBooks,
            getOrders,
            isLoggedIn,
            user,
        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}