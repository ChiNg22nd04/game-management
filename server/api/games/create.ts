// server/api/games/create.ts
import { defineEventHandler, readBody, createError } from 'h3';
import { db } from '../../utils/firebase-admin';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { ...gameData } = body;
        console.log('Game data.name:', gameData.name);

        const validNameItem = gameData.name.find((item: any) => item.language?.value?.trim() !== '');

        if (!validNameItem) {
            return { success: false, error: 'Game name cannot be empty' };
        }

        const docRef = await db.collection('games').add({ ...gameData });

        return {
            success: true,
            id: docRef.id,
            message: 'Game created successfully',
        };
    } catch (error) {
        console.error('Error in /api/games/create:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return {
            success: false,
            error: errorMessage,
        };
    }
});
