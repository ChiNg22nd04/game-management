// server/api/categories.ts
import { db } from '../utils/firebase-admin';
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const docRef = db.collection('categories');
        const snapshot = await docRef.get();

        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            success: true,
            data: categories,
        };
    } catch (error) {
        console.error('Error in /api/categories:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return {
            success: false,
            error: errorMessage,
        };
    }
});
