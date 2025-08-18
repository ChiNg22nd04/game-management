<template>
    <div class="mb-6 border border-gray-300 p-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
                <label class="mb-1 block text-sm font-medium"> Category </label>
                <div class="relative">
                    <select
                        :value="selectedCategory"
                        class="w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 pr-8"
                        @change="$emit('update:selected-category', $event.target.value)"
                    >
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform">
                        <Icon name="angle-down" class="ml-1 inline-block h-4 w-4" />
                    </span>
                </div>
            </div>
            <div>
                <label class="mb-1 block text-sm font-medium">Keyword</label>
                <input
                    :value="searchQuery"
                    class="w-full rounded-sm border border-gray-300 px-3 py-2"
                    type="text"
                    @input="$emit('update:search-query', $event.target.value)"
                />
            </div>
            <div class="flex items-end">
                <button class="rounded-sm border border-gray-300 px-4 py-2 hover:bg-gray-100" @click="$emit('search')">
                    <div class="flex items-center">
                        <Icon name="search" class="mr-1 h-4 w-4" />
                        Search
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Icon from './Icon.vue';
defineProps({
    categories: {
        type: Array,
        default: () => [],
    },
    searchQuery: {
        type: String,
        default: '',
    },
    selectedCategory: {
        type: [String, Number, null],
        default: '',
    },
});

defineEmits(['update:selected-category', 'update:search-query', 'search']);
</script>
