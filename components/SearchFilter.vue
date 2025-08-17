<template>
    <div />
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

defineEmits(['update:selectedCategory', 'update:searchQuery', 'search']);
</script>
