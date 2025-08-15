<template>
    <div class="mt-4 flex justify-center">
        <div class="flex border border-gray-300">
            <button
                @click="$emit('prev')"
                :disabled="currentPage === 1"
                class="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
            >
                «
            </button>
            <button
                v-for="page in totalPages"
                :key="page"
                @click="$emit('goto', page)"
                :class="`px-3 py-1 border-r border-gray-300 hover:bg-gray-100 ${
                    currentPage === page ? 'bg-gray-200' : ''
                }`"
            >
                {{ page }}
            </button>
            <button
                @click="$emit('next')"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 hover:bg-gray-100"
            >
                »
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    currentPage: Number,
    totalPages: Number,
});
defineEmits(["prev", "next", "goto"]);
</script>
