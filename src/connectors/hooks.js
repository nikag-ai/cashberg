import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, connectAuthEmulator, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Use Emulators in Dev
if (window.location.hostname === "localhost") {
    // Prevent multiple initializations (Hot Reload safety)
    // We attach a flag to the auth object or global to track connection
    // But since auth/db might be new objects if module reloads, we need to be careful.
    // However, if getApps() returns the existing app, auth/db should be the same instances?
    // Actually, getAuth(app) returns the singleton for that app.

    // We can use a global flag or check `auth.emulatorConfig` (internal)

    if (!globalThis._emulatorsConnected) {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
        connectFunctionsEmulator(functions, "localhost", 5001);
        globalThis._emulatorsConnected = true;
        console.log("🔥 Connected to Firebase Emulators (localhost)");
    }
}

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety timeout: If Firebase doesn't respond in 2s, assume loading finished (likely logged out or offline)
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth listener timed out, defaulting to logged out state.");
                setLoading(false);
            }
        }, 2000);

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            clearTimeout(timeout);
            setUser(u);
            setLoading(false);
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        }
    }, []);

    const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
    const signup = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
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

    return { user, loading, login, signup, loginWithGoogle, logout };
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
        deleteBucket: httpsCallable(functions, 'deleteBucket'),
        editBucket: httpsCallable(functions, 'editBucket')
    };
};
