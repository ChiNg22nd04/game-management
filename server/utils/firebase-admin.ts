// server/utils/firebase-admin.ts
import admin, { ServiceAccount } from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function tryParseServiceAccount(input: string) {
    // Try direct JSON parse
    try {
        return JSON.parse(input) as ServiceAccount;
    } catch (e) {
        // If that fails, try base64 decode then parse
        try {
            const decoded = Buffer.from(input, 'base64').toString('utf8');
            return JSON.parse(decoded) as ServiceAccount;
        } catch (e2) {
            throw new Error(
                'Failed to parse service account from environment variable (not valid JSON or base64 JSON)',
            );
        }
    }
}

// Check if Firebase is already initialized
if (!admin.apps.length) {
    try {
        // Try to get service account from environment variable first
        let serviceAccountEnv = process.env.NUXT_FIREBASE_SERVICE_ACCOUNT;
        let serviceAccountTyped: ServiceAccount | null = null;

        if (serviceAccountEnv) {
            serviceAccountTyped = tryParseServiceAccount(serviceAccountEnv);
        } else {
            // Fallback: try to read local secrets file (useful for local dev or when deploying with file-stored secret)
            const filePath = path.join(process.cwd(), 'server', 'secrets', 'firebase-service-account.json');
            if (fs.existsSync(filePath)) {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                serviceAccountTyped = JSON.parse(fileContents) as ServiceAccount;
                console.log('Using service account from server/secrets/firebase-service-account.json');
            }
        }

        if (!serviceAccountTyped) {
            throw new Error(
                'NUXT_FIREBASE_SERVICE_ACCOUNT environment variable is not set and no local service account file was found',
            );
        }

        // Normalize keys: service account JSON from Firebase uses snake_case,
        // while the TypeScript ServiceAccount type uses camelCase.
        const saAny = serviceAccountTyped as any;
        const normalizedServiceAccount: ServiceAccount = {
            // keep other fields if present
            ...(saAny as ServiceAccount),
            projectId: saAny.project_id || saAny.projectId,
            privateKey: saAny.private_key || saAny.privateKey,
            clientEmail: saAny.client_email || saAny.clientEmail,
        } as ServiceAccount;

        // Some deployment systems escape newlines in the private key as "\\n".
        if (normalizedServiceAccount.privateKey && (normalizedServiceAccount.privateKey as string).includes('\\n')) {
            normalizedServiceAccount.privateKey = (normalizedServiceAccount.privateKey as string).replace(/\\n/g, '\n');
        }

        // Validate required fields
        if (
            !normalizedServiceAccount.projectId ||
            !normalizedServiceAccount.privateKey ||
            !normalizedServiceAccount.clientEmail
        ) {
            throw new Error(
                'Invalid Firebase service account configuration (missing projectId, privateKey or clientEmail)',
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert(normalizedServiceAccount),
        });

        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error instanceof Error ? error.message : error);
        // Re-throw so server API handlers can return 500 and we keep behavior consistent
        throw error;
    }
}

const db = admin.firestore();

export { admin, db };
