import { db } from '../../utils/firebase-admin';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const gameId = body.id;

    if (!gameId) {
        return { status: 400, body: { error: 'Game ID is required' } };
    }

    try {
        await db.collection('games').doc(gameId).delete();
        return { status: 200, body: { message: 'Game deleted successfully' } };
    } catch (error) {
        console.error('Error deleting game:', error);
        return { status: 500, body: { error: 'Failed to delete game' } };
    }
});
