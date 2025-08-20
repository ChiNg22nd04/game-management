// server/api/games/create.ts
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        // Dynamic import to handle initialization errors
        const { db } = await import('../../utils/firebase-admin');

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
                error: 'Failed to create game',
            },
        });
    }
});
