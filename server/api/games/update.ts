// server/api/games/update.ts
import { db } from '../../utils/firebase-admin';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { id, ...data } = body;
        console.log('Updating game with data:', data);
        console.log('Updating game with id:', id);

        if (!id) {
            return {
                success: false,
                error: 'Game ID is required',
            };
        }

        await db.collection('games').doc(id).set(data, { merge: true });

        return {
            success: true,
            message: 'Game updated successfully',
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
