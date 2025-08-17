<template>
    <div class="mt-4 flex justify-center">
        <div class="flex border border-gray-300">
            <button
                :disabled="currentPage === 1"
                class="border-r border-gray-300 px-3 py-1 hover:bg-gray-100"
                @click="$emit('prev')"
            >
                «
            </button>
            <button
                v-for="page in totalPages"
                :key="page"
                :class="`border-r border-gray-300 px-3 py-1 hover:bg-gray-100 ${
                    currentPage === page ? 'bg-gray-200' : ''
                }`"
                @click="$emit('goto', page)"
            >
                {{ page }}
            </button>
            <button :disabled="currentPage === totalPages" class="px-3 py-1 hover:bg-gray-100" @click="$emit('next')">
                »
            </button>
        </div>
    </div>
</template>

<script setup>
// Component name for ESLint
defineOptions({
    name: 'PaginationComponent',
});

defineProps({
    currentPage: {
        type: Number,
        default: 1,
    },
    totalPages: {
        type: Number,
        default: 1,
    },
});
defineEmits(['prev', 'next', 'goto']);
</script>
