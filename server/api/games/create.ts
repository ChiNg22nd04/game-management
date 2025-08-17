// server/api/games/create.ts
import { db } from '../../utils/firebase-admin';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { id, ...gameData } = body;
        console.log('Creating game with data:', id, gameData);

        if (!id) {
            return {
                success: false,
                error: 'Game ID is required',
            };
        }

        // Check if game with this ID already exists
        const existingGame = await db.collection('games').doc(id).get();
        if (existingGame.exists) {
            return {
                success: false,
                error: 'A game with this ID already exists',
            };
        }

        // Create the new game document
        await db
            .collection('games')
            .doc(id)
            .set({
                ...gameData,
                createdAt: new Date().toISOString(),
            });

        return {
            success: true,
            message: 'Game created successfully',
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
