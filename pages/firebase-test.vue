<template>
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">Firebase Connection Test</h1>

        <div class="bg-gray-100 p-4 rounded-lg">
            <div v-if="loading" class="text-gray-700">
                Testing Firebase connection...
            </div>
            <div v-else-if="error" class="text-red-600">
                <p class="font-bold">Connection Failed:</p>
                <p>{{ error }}</p>
            </div>
            <div v-else-if="result" class="text-green-600">
                <p class="font-bold">Connection Successful!</p>
                <pre class="bg-gray-200 p-2 mt-2 rounded">{{
                    JSON.stringify(result, null, 2)
                }}</pre>
            </div>
        </div>

        <button
            @click="testConnection"
            class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Test Connection Again
        </button>
    </div>
</template>

<script setup>
const loading = ref(true);
const error = ref(null);
const result = ref(null);

const testConnection = async () => {
    loading.value = true;
    error.value = null;
    result.value = null;

    try {
        const response = await fetch("/api/firebase-test");
        const data = await response.json();

        if (data.success) {
            result.value = data;
        } else {
            error.value = data.error || "Unknown error occurred";
        }
    } catch (err) {
        error.value = err.message || "Failed to test connection";
    } finally {
        loading.value = false;
    }
};

// Test connection on page load
onMounted(() => {
    testConnection();
});
</script>
