// server/api/games/index.ts
import { db } from "../../utils/firebase-admin";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    try {
        const gamesCollection = db.collection("games");
        const snapshot = await gamesCollection.get();

        const games = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            success: true,
            data: games,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
