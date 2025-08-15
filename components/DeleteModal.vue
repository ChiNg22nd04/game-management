<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa</h3>
            <p class="text-gray-600 mb-6">{{ message }}</p>
            <div class="flex justify-end space-x-3">
                <button
                    @click="$emit('cancel')"
                    class="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                    Hủy
                </button>
                <button
                    @click="$emit('confirm')"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Xóa
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ show: Boolean, message: String });
defineEmits(["cancel", "confirm"]);
</script>
