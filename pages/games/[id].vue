<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="mb-6 text-2xl font-bold">Game Edit</h1>

        <div v-if="isLoading" class="my-12 flex justify-center">
            <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
        </div>

        <div v-else-if="error" class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {{ error }}
        </div>

        <div v-else>
            <!-- Basic Info Section -->
            <div class="mb-6">
                <h2 class="mb-4 text-lg font-medium">Basic Info</h2>
                <div class="border border-gray-300">
                    <table class="w-full">
                        <tbody>
                            <tr class="border-b border-gray-300">
                                <td class="w-1/4 border-r border-gray-300 bg-gray-50 px-6 py-4">
                                    <label for="gameCategory">Category</label>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative w-48">
                                        <select
                                            v-model="gameForm.categoryId"
                                            class="w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 pr-8"
                                        >
                                            <option value="">Select a language</option>
                                            <option
                                                v-for="category in categories"
                                                :key="category.id"
                                                :value="category.id"
                                            >
                                                {{ category.name }}
                                            </option>
                                        </select>
                                        <span
                                            class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
                                        >
                                            <Icon name="angle-down" class="ml-1 inline-block h-4 w-4 text-black" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="w-1/4 border-r border-gray-300 bg-gray-50 px-6 py-4">
                                    <label for="gameId">ID</label>
                                </td>
                                <td class="px-6 py-4">
                                    <input
                                        id="gameId"
                                        v-model="gameForm.id"
                                        type="text"
                                        class="w-full rounded-sm border border-gray-300 px-3 py-2"
                                        :disabled="true"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Multi-languages Info Section -->
            <div class="mb-6">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-medium">Multi-languages Info</h2>
                </div>
                <div class="border border-gray-300">
                    <div class="flex">
                        <!-- Language List -->
                        <div class="flex w-1/4 flex-col border-r border-gray-300 bg-gray-50 py-4">
                            <div class="border-b border-gray-300 px-6 pb-4 font-medium">Input by Language</div>
                            <div>
                                <div
                                    v-for="language in gameForm.languages"
                                    :key="language.code"
                                    :class="[
                                        'cursor-pointer px-6 py-2',
                                        selectedLanguage === language.code
                                            ? 'flex items-center font-bold text-black'
                                            : 'text-gray-700',
                                        'hover:bg-gray-100',
                                    ]"
                                    @click="selectLanguage(language.code)"
                                >
                                    <span>
                                        {{ language.name }}
                                    </span>
                                    <Icon
                                        icon="fa-angle-right"
                                        v-if="selectedLanguage === language.code"
                                        name="angle-right"
                                        class="ml-2 h-4 w-4 text-black"
                                    />
                                </div>
                            </div>
                            <div class="px-6 pt-4">
                                <button
                                    class="flex w-full items-center rounded-sm border border-gray-300 px-3 py-1 hover:bg-gray-50"
                                    @click="openLanguageModal"
                                >
                                    <Icon name="add" class="mr-1 h-4 w-4 text-black" />
                                    Add language
                                </button>
                            </div>
                        </div>
                        <!-- Language Input & Actions -->
                        <div class="flex-1">
                            <div class="flex items-center justify-between border-b border-gray-300">
                                <div class="flex items-center px-4 py-4">
                                    <input
                                        type="checkbox"
                                        :checked="selectedLanguage && getLanguageByCode(selectedLanguage)?.isDefault"
                                        :disabled="!selectedLanguage"
                                        class="mr-2"
                                        @change="toggleDefaultLanguage"
                                    />
                                    <span>Default Language</span>
                                </div>
                                <button
                                    :disabled="
                                        !selectedLanguage ||
                                        getLanguageByCode(selectedLanguage)?.isDefault ||
                                        gameForm.languages.length <= 1
                                    "
                                    :class="[
                                        'flex items-center border-l border-gray-300 px-4 py-4 text-gray-600',
                                        selectedLanguage &&
                                        !getLanguageByCode(selectedLanguage)?.isDefault &&
                                        gameForm.languages.length > 1
                                            ? 'cursor-pointer hover:text-red-600'
                                            : 'cursor-not-allowed opacity-50',
                                    ]"
                                    @click="deleteSelectedLanguage"
                                >
                                    <Icon name="trash" class="mr-1 h-4 w-4 text-black" />
                                    Delete language
                                </button>
                            </div>
                            <div v-if="selectedLanguage" class="px-4 py-4">
                                <div class="mb-2">
                                    <label class="text-sm font-medium text-gray-700">Name</label>
                                </div>
                                <input
                                    v-model="selectedLanguageObj.nameValue"
                                    type="text"
                                    class="rounded-sm border border-gray-300 px-3 py-2"
                                    placeholder="Enter game name"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Language Modal as component -->
            <AddLanguageModal
                :show="showLanguageModal"
                :available-languages="availableLanguages"
                @close="closeLanguageModal"
                @add="handleAddLanguage"
            />

            <!-- Action Buttons -->
            <div class="flex justify-between">
                <div>
                    <button
                        type="button"
                        class="rounded-sm border border-gray-300 px-4 py-2 hover:bg-gray-100"
                        @click="cancel"
                    >
                        Return To Game List
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        class="rounded-sm border border-gray-300 px-4 py-2 hover:bg-gray-100"
                        @click="updateGame"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AddLanguageModal from '@/components/AddLanguageModal.vue';
import { useRouter, useRoute } from 'vue-router';
import { useCategories } from '@/composables/useCategories';
import { useGameForm } from '@/composables/useGameForm';
import { LANGUAGES } from '@/composables/languages';
import Icon from '@/components/Icon.vue';

// Component name for ESLint
defineOptions({
    name: 'GameDetail',
});

const router = useRouter();
const route = useRoute();
const gameId = route.params.id;

// Composables
const { categories, fetchCategories } = useCategories();
const { gameForm, isLoading, error } = useGameForm();

// Language management state
const selectedLanguage = ref('');
const showLanguageModal = ref(false);
const selectedNewLanguage = ref('');

// Computed properties
const availableLanguages = computed(() => {
    return LANGUAGES.filter((lang) => !gameForm.value.languages?.some((gl) => gl.code === lang.code));
});

// Language management functions
const selectLanguage = (code) => {
    selectedLanguage.value = code;
};

const getLanguageByCode = (code) => {
    return gameForm.value.languages?.find((lang) => lang.code === code);
};

// Add computed property for selected language object
const selectedLanguageObj = computed({
    get() {
        return getLanguageByCode(selectedLanguage.value);
    },
    set(val) {
        if (selectedLanguage.value && val && typeof val.nameValue !== 'undefined') {
            const lang = getLanguageByCode(selectedLanguage.value);
            if (lang) lang.nameValue = val.nameValue;
        }
    },
});

const toggleDefaultLanguage = () => {
    if (!selectedLanguage.value) return;

    const language = getLanguageByCode(selectedLanguage.value);
    if (!language) return;

    // Remove default from all languages
    gameForm.value.languages.forEach((lang) => {
        lang.isDefault = false;
    });

    // Set selected language as default
    language.isDefault = true;
};

const deleteSelectedLanguage = () => {
    if (!selectedLanguage.value) return;

    const language = getLanguageByCode(selectedLanguage.value);
    if (!language || language.isDefault || gameForm.value.languages.length <= 1) return;

    gameForm.value.languages = gameForm.value.languages.filter((lang) => lang.code !== selectedLanguage.value);
    selectedLanguage.value = '';
};

const openLanguageModal = () => {
    showLanguageModal.value = true;
    selectedNewLanguage.value = '';
};

const closeLanguageModal = () => {
    showLanguageModal.value = false;
    selectedNewLanguage.value = '';
};

const handleAddLanguage = (languageData) => {
    if (!languageData) return;
    gameForm.value.languages.push({
        code: languageData.code,
        name: languageData.name,
        isDefault: false,
        nameValue: '',
    });
    closeLanguageModal();
};

const loadGame = async (id) => {
    try {
        const res = await $fetch(`/api/games/${id}`);
        if (!res.success) {
            error.value = res.error || 'Game not found';
            return;
        }

        const languages = (res.data.name || []).map((item) => {
            const lang = item.language;
            const found = LANGUAGES.find((l) => l.code === lang.code);
            return {
                code: lang.code,
                name: found?.name || lang.code,
                isDefault: item.isDefault === 'true' || item.isDefault === true,
                nameValue: lang.value || '',
            };
        });

        gameForm.value = {
            id: res.data.id,
            categoryId: res.data.categoryId,
            languages: languages.length ? languages : [{ ...LANGUAGES[0], isDefault: true, nameValue: '' }],
        };

        // Auto-select first language
        if (gameForm.value.languages?.length > 0) {
            selectedLanguage.value = gameForm.value.languages[0].code;
        }
    } catch {
        error.value = 'Error loading game data';
    }
};

const cancel = () => router.push('/games');
// Override updateGame to format payload before sending
const updateGame = async () => {
    const payload = {
        id: gameForm.value.id,
        categoryId: gameForm.value.categoryId,
        name: gameForm.value.languages.map((lang) => ({
            language: {
                code: lang.code,
                value: lang.nameValue || '',
            },
            isDefault: lang.isDefault,
        })),
    };
    isLoading.value = true;
    try {
        const response = await fetch('/api/games/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!result.success) {
            error.value = result.error || 'Failed to update game';
        }
    } catch (_err) {
        error.value = 'Error updating game';
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    if (gameId) {
        await loadGame(gameId);
    } else {
        // For new games, auto-select first language
        if (gameForm.value.languages?.length > 0) {
            selectedLanguage.value = gameForm.value.languages[0].code;
        }
    }
});
</script>
