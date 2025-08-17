<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 class="mb-4 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
            <p class="mb-6 text-gray-600">
                {{ message }}
            </p>
            <div class="flex justify-end space-x-3">
                <button class="rounded-md border px-4 py-2 hover:bg-gray-100" @click="$emit('cancel')">Hủy</button>
                <button class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600" @click="$emit('confirm')">
                    Xóa
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: '',
    },
});
defineEmits(['cancel', 'confirm']);
</script>
