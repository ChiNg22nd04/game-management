// server/utils/firebase-admin.ts
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../secrets/firebase-service-account.json";

const serviceAccountTyped = serviceAccount as ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountTyped),
});

const db = admin.firestore();

export { admin, db };
