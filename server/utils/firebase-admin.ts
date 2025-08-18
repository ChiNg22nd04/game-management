// server/utils/firebase-admin.ts
import admin, { ServiceAccount } from 'firebase-admin';
// import serviceAccount from '../secrets/firebase-service-account.json';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
// const serviceAccountTyped = serviceAccount as ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { admin, db };
