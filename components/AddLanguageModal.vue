<template>
    <div v-if="show" class="mb-6 border border-gray-300">
        <div class="flex items-center justify-between border-b border-gray-300 px-6 py-3">
            <h3 class="font-medium">Add Language</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="handleClose">
                <Icon name="close" class="mr-1 h-4 w-4 text-black" />
            </button>
        </div>
        <div class="p-6">
            <div class="relative">
                <select
                    v-model="selectedNewLanguage"
                    class="mb-4 flex w-full appearance-none rounded-sm border border-gray-300 px-3 py-2"
                >
                    <option value="">Select a language</option>
                    <option v-for="lang in availableLanguages" :key="lang.code" :value="lang">
                        {{ lang.name }}
                    </option>
                </select>
                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <Icon name="angle-down" class="ml-1 inline-block h-4 w-4 text-black" />
                </span>
            </div>
            <div class="flex justify-center">
                <button
                    :disabled="!selectedNewLanguage"
                    :class="[
                        'flex items-center rounded-sm border border-gray-300 px-6 py-1',
                        selectedNewLanguage ? 'hover:bg-gray-50' : 'cursor-not-allowed opacity-50',
                    ]"
                    @click="$emit('add', selectedNewLanguage)"
                >
                    <Icon name="add" class="mr-1 h-4 w-4 text-black" />
                    Add
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    availableLanguages: Array,
});
const emit = defineEmits(['close', 'add']);

const selectedNewLanguage = ref('');

function handleClose() {
    selectedNewLanguage.value = '';
    emit('close');
}
</script>
