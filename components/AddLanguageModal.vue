<template>
    <div v-if="show" class="border border-gray-300 mb-6">
        <div
            class="flex justify-between items-center border-b border-gray-300 px-6 py-3"
        >
            <h3 class="font-medium">Add Language</h3>
            <button
                @click="$emit('close')"
                class="text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>
        </div>
        <div class="p-6">
            <select
                v-model="selectedNewLanguage"
                class="w-full px-3 py-2 border border-gray-300 rounded-sm mb-4"
            >
                <option value="">Select a language</option>
                <option
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    :value="lang.code"
                >
                    {{ lang.name }}
                </option>
            </select>
            <div class="flex justify-center">
                <button
                    @click="addLanguage"
                    :disabled="!selectedNewLanguage"
                    :class="[
                        'border border-gray-300 px-6 py-1 rounded-sm flex items-center',
                        selectedNewLanguage
                            ? 'hover:bg-gray-50'
                            : 'opacity-50 cursor-not-allowed',
                    ]"
                >
                    <span class="mr-1">+</span> Add
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { LANGUAGES } from "@/composables/languages";

const props = defineProps({
    show: Boolean,
    availableLanguages: Array,
});
const emit = defineEmits(["close", "add"]);

const selectedNewLanguage = ref("");

watch(
    () => props.show,
    (val) => {
        if (!val) selectedNewLanguage.value = "";
    }
);

const addLanguage = () => {
    if (!selectedNewLanguage.value) return;
    const languageData = LANGUAGES.find(
        (lang) => lang.code === selectedNewLanguage.value
    );
    if (!languageData) return;
    emit("add", languageData);
    selectedNewLanguage.value = "";
};
</script>
