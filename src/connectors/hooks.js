import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, connectAuthEmulator, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, query, orderBy, limit, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

// Init Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "cashberg-fc307.firebaseapp.com",
    projectId: "cashberg-fc307",
    storageBucket: "cashberg-fc307.firebasestorage.app",
    messagingSenderId: "708481398398",
    appId: "1:708481398398:web:117d13a52c7f4130154a2f",
    measurementId: "G-M7HM6ZFJSJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Use Emulators in Dev
if (window.location.hostname === "localhost") {
    // Prevent multiple initializations (Hot Reload safety)
    if (!globalThis._emulatorsConnected) {
        // Use 127.0.0.1 to avoid localhost resolution issues
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
        connectFirestoreEmulator(db, "127.0.0.1", 8080);
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        globalThis._emulatorsConnected = true;
        console.log("🔥 Connected to Firebase Emulators (127.0.0.1)");
    }
}

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google Auth Error:", error);
            throw error;
        }
    };
    const logout = () => signOut(auth);

    return { user, loading, login, loginWithGoogle, logout };
};

export const useIceberg = (uid) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const unsub = onSnapshot(doc(db, `users/${uid}/ledgers/main`), (doc) => {
            if (doc.exists()) {
                setData(doc.data());
            } else {
                setData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("🔥 Iceberg Error:", error);
            setLoading(false);
        });
        return unsub;
    }, [uid]);

    return { data, loading };
};

export const useBuckets = (uid) => {
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const q = query(collection(db, `users/${uid}/buckets`), orderBy('name'));
        const unsub = onSnapshot(q, (snapshot) => {
            setBuckets(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, (error) => {
            console.error("🔥 Buckets Error:", error);
            setLoading(false);
        });
        return unsub;
    }, [uid]);
    return { buckets, loading };
};

export const useTransactions = (uid) => {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const q = query(
            collection(db, `users/${uid}/ledgers/main/transactions`),
            orderBy('timestamp', 'desc'),
            limit(20)
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setTxns(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, (error) => {
            console.error("🔥 Stream Error:", error);
            setLoading(false);
        });
        return unsub;
    }, [uid]);
    return { txns, loading };
};

export const useFunctions = () => {
    return {
        initializeLedger: httpsCallable(functions, 'initializeLedger'),
        meltIceberg: httpsCallable(functions, 'meltIceberg'),
        processPayday: httpsCallable(functions, 'processPayday'),
        transferFunds: httpsCallable(functions, 'transferFunds'),
        reconcileLedger: httpsCallable(functions, 'reconcileLedger'),
        undoTransaction: httpsCallable(functions, 'undoTransaction'),
        createBucket: httpsCallable(functions, 'createBucket'),
        deleteBucket: httpsCallable(functions, 'deleteBucket')
    };
};
