// server/api/games/index.ts
import { defineEventHandler, createError } from 'h3';
import { db } from '../../utils/firebase-admin';

export default defineEventHandler(async (event) => {
    try {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return {
            success: false,
            error: errorMessage,
        };
    }
});
