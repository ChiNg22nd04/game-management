<template>
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">Firebase CRUD Test</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Data Section -->
            <div class="bg-white p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-2">Current Data</h2>
                <div v-if="loading" class="text-gray-700">Loading...</div>
                <div v-else-if="error" class="text-red-600 mb-4">
                    <p class="font-bold">Error:</p>
                    <p>{{ error }}</p>
                </div>
                <div v-else>
                    <div
                        v-if="currentData.exists === false"
                        class="text-yellow-600"
                    >
                        No document exists yet. Create one first.
                    </div>
                    <pre
                        v-else-if="currentData.data"
                        class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"
                        >{{ JSON.stringify(currentData.data, null, 2) }}</pre
                    >
                </div>

                <button
                    @click="readData"
                    class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    :disabled="operationLoading"
                >
                    Refresh Data
                </button>
            </div>

            <!-- Operations Section -->
            <div class="bg-white p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-2">Operations</h2>

                <!-- Create/Update Form -->
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2"
                        >Data Content:</label
                    >
                    <textarea
                        v-model="formData"
                        class="w-full p-2 border rounded"
                        rows="3"
                        placeholder="Enter data to save..."
                    ></textarea>
                </div>

                <!-- Operation Buttons -->
                <div class="flex flex-wrap gap-2">
                    <button
                        @click="createData"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        :disabled="operationLoading"
                    >
                        Create
                    </button>

                    <button
                        @click="updateData"
                        class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        :disabled="operationLoading"
                    >
                        Update
                    </button>

                    <button
                        @click="deleteData"
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        :disabled="operationLoading"
                    >
                        Delete
                    </button>
                </div>

                <!-- Operation Result -->
                <div v-if="operationResult" class="mt-4">
                    <h3 class="font-semibold">Last Operation Result:</h3>
                    <pre
                        class="bg-gray-100 p-3 rounded text-sm overflow-x-auto mt-2"
                        >{{ JSON.stringify(operationResult, null, 2) }}</pre
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const loading = ref(true);
const error = ref(null);
const currentData = ref({});
const formData = ref('{"message": "Test data from Nuxt app"}');
const operationLoading = ref(false);
const operationResult = ref(null);

// Read data from Firebase
const readData = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await fetch("/api/firebase-crud-test");
        const data = await response.json();

        if (data.success) {
            currentData.value = data;
        } else {
            error.value = data.error || "Failed to read data";
        }
    } catch (err) {
        error.value = err.message || "An error occurred while reading data";
    } finally {
        loading.value = false;
    }
};

// Create data in Firebase
const createData = async () => {
    await performOperation("POST");
};

// Update data in Firebase
const updateData = async () => {
    await performOperation("PUT");
};

// Delete data from Firebase
const deleteData = async () => {
    await performOperation("DELETE");
};

// Generic operation handler
const performOperation = async (method) => {
    operationLoading.value = true;
    operationResult.value = null;

    try {
        let options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method === "POST" || method === "PUT") {
            try {
                // Parse JSON input or use as string if not valid JSON
                const parsedData = JSON.parse(formData.value);
                options.body = JSON.stringify({ data: parsedData });
            } catch (e) {
                options.body = JSON.stringify({ data: formData.value });
            }
        }

        const response = await fetch("/api/firebase-crud-test", options);
        const result = await response.json();

        operationResult.value = result;

        // Refresh data after successful operation
        if (result.success) {
            await readData();
        }
    } catch (err) {
        operationResult.value = {
            success: false,
            error: err.message || "Operation failed",
        };
    } finally {
        operationLoading.value = false;
    }
};

// Load data on page mount
onMounted(() => {
    readData();
});
</script>
