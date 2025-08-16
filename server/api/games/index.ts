// server/api/games/index.ts
import { db } from "../../utils/firebase-admin";
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  try {
    // Lấy games
    const gamesSnapshot = await db.collection("games").get();
    const games = gamesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Lấy categories
    const categoriesSnapshot = await db.collection("categories").get();
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Tạo map categoryId -> category object
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Join games + categories
    const gamesWithCategory = games.map((game) => ({
      ...game,
      category: categoryMap.get(game.categoryId) || null,
    }));

    return {
      success: true,
      data: gamesWithCategory,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
