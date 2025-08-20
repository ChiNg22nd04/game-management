// server/utils/firebase-admin.ts
import admin, { ServiceAccount } from 'firebase-admin';

// Check if Firebase is already initialized
if (!admin.apps.length) {
    try {
        // Try to get service account from environment variable
        const serviceAccountEnv = process.env.NUXT_FIREBASE_SERVICE_ACCOUNT;

        if (!serviceAccountEnv) {
            throw new Error('NUXT_FIREBASE_SERVICE_ACCOUNT environment variable is not set');
        }

        const serviceAccount = JSON.parse(serviceAccountEnv);
        const serviceAccountTyped = serviceAccount as ServiceAccount;

        // Validate required fields
        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error('Invalid Firebase service account configuration');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountTyped),
        });

        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        throw error;
    }
}

const db = admin.firestore();

export { admin, db };
