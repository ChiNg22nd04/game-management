// server/api/firebase-test.ts
import { db } from "../utils/firebase-admin";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
    try {
        // Try to get a document from Firestore to test the connection
        const testCollection = db.collection("test");
        const testDoc = await testCollection.doc("connection-test").get();

        // If we got here without errors, the connection is working
        return {
            success: true,
            message: "Firebase connection successful",
            exists: testDoc.exists,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        // If there's an error, return it
        return {
            success: false,
            message: "Firebase connection failed",
            error: error instanceof Error ? error.message : String(error),
        };
    }
});
