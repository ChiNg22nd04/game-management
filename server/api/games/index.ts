// server/api/games/index.ts
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        // Dynamic import to handle initialization errors
        const { db } = await import('../../utils/firebase-admin');

        // Lấy categories
        const catesDoc = await db.collection('categories').get();
        const categories = catesDoc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const gamesDoc = await db.collection('games').get();

        const gamesWithCategory = gamesDoc.docs.map((doc) => {
            const game = doc.data();
            const category = categories.find((c) => c.id === game.categoryId) || null;

            return {
                id: doc.id,
                ...game,
                category,
            };
        });

        return {
            success: true,
            data: gamesWithCategory,
        };
    } catch (error) {
        console.error('Error in /api/games:', error);

        // Return structured error response
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // For development, return detailed error
        if (process.env.NODE_ENV === 'development') {
            return {
                success: false,
                error: errorMessage,
                stack: error instanceof Error ? error.stack : undefined,
            };
        }

        // For production, return generic error but log details
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: {
                success: false,
                error: 'Failed to fetch games',
            },
        });
    }
});
