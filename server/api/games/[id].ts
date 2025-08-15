// server/api/games/[id].ts
import { db } from "../../utils/firebase-admin";
import { defineEventHandler, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
    try {
        const gameId = getRouterParam(event, "id");

        if (!gameId) {
            return {
                success: false,
                error: "Game ID is required",
            };
        }

        const gameDoc = await db.collection("games").doc(gameId).get();

        if (!gameDoc.exists) {
            return {
                success: false,
                error: "Game not found",
            };
        }

        return {
            success: true,
            data: {
                id: gameDoc.id,
                ...gameDoc.data(),
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
