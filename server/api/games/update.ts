// server/api/games/update.ts
import { db } from '../../utils/firebase-admin';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { id, languages, ...data } = body;
        console.log('Updating game with data:', id, languages, data);

        if (!id) {
            return {
                success: false,
                error: 'Game ID is required',
            };
        }

        if (languages) {
            data.name = languages.map((lang: any) => ({
                language: { code: lang.code, value: lang.nameValue || '' },
                isDefault: lang.isDefault || false,
            }));
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
