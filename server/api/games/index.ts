// server/api/games/index.ts
import { db } from '../../utils/firebase-admin';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
    try {
        // Lấy categories
        const categoriesSnapshot = await db.collection('categories').get();
        const categories = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const categoryMap = new Map(categories.map((c) => [c.id, c]));

        // Lấy games
        const gamesSnapshot = await db.collection('games').get();
        const gamesWithCategory = gamesSnapshot.docs.map((doc) => {
            const gameData = doc.data();
            return {
                id: doc.id,
                ...gameData,
                category: categoryMap.get(gameData.categoryId) || null,
            };
        });

        return {
            success: true,
            data: gamesWithCategory,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
