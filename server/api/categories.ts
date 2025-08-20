// server/api/categories.ts
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        // Dynamic import to handle initialization errors
        const { db } = await import('../utils/firebase-admin');

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

        if (process.env.NODE_ENV === 'development') {
            return {
                success: false,
                error: errorMessage,
                stack: error instanceof Error ? error.stack : undefined,
            };
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: {
                success: false,
                error: 'Failed to fetch categories',
            },
        });
    }
});
