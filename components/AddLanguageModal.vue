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
                <Icon name="close" class="h-4 w-4 mr-1 text-black" />
            </button>
        </div>
        <div class="p-6">
            <div class="relative">
                <select
                    v-model="selectedNewLanguage"
                    class="w-full flex px-3 py-2 border border-gray-300 appearance-none rounded-sm mb-4"
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
                <span
                    class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                    <Icon
                        name="angle-down"
                        class="h-4 w-4 inline-block ml-1 text-black"
                    />
                </span>
            </div>
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
                    <Icon name="add" class="h-4 w-4 mr-1 text-black" />
                    Add
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
