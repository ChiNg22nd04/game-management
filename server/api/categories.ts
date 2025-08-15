// server/api/categories.ts
import { db } from "../utils/firebase-admin";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    try {
        const categoriesCollection = db.collection("categories");
        const snapshot = await categoriesCollection.get();

        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            success: true,
            data: categories,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
