import { db } from '../../utils/firebase-admin';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const ids = body.ids;
    console.log('Received request to delete game with ID:', ids);

    if (!ids) {
        return { success: false, error: 'Game ID is required' };
    }

    try {
        const batch = db.batch();
        ids.forEach((id: string) => {
            const docRef = db.collection('games').doc(id);
            console.log('Preparing to delete game with ID:', id, docRef);
            batch.delete(docRef);
        });
        await batch.commit();
        return { success: true, message: 'Game deleted successfully' };
    } catch (error) {
        console.error('Error deleting game:', error);
        return { success: false, error: 'Failed to delete game' };
    }
});
