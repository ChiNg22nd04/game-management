<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">Game Register / Edit</h1>

        <div v-if="isLoading" class="flex justify-center my-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ error }}
        </div>

        <div v-else>
            <!-- Basic Info Section -->
            <div class="mb-6">
                <h2 class="text-lg font-medium mb-4">Basic Info</h2>
                <div class="border border-gray-300">
                    <table class="w-full">
                        <tbody>
                            <tr class="border-b border-gray-300">
                                <td class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50">
                                    <label for="gameCategory">Category</label>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative w-48">
                                        <select v-model="gameForm.categoryId" class="w-full px-3 py-2 border border-gray-300 rounded-sm appearance-none pr-8">
                                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                                {{ category.name }}
                                            </option>
                                        </select>
                                        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                            <Icon name="angle-down" class="h-4 w-4 inline-block ml-1 text-black" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50">
                                    <label for="gameId">ID</label>
                                </td>
                                <td class="px-6 py-4">
                                    <input id="gameId" v-model="gameForm.id" type="text" class="px-3 py-2 border border-gray-300 rounded-sm w-48" :disabled="true" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Multi-languages Info Section -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-medium">Multi-languages Info</h2>
                </div>
                <div class="border border-gray-300">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-300">
                                <th class="px-6 py-3 text-left border-r border-gray-300 w-1/4 bg-gray-50">Input by Language</th>
                                <th class="px-6 py-3 text-left bg-gray-50">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center justify-center flex-1">
                                            <input
                                                type="checkbox"
                                                :checked="selectedLanguage && getLanguageByCode(selectedLanguage)?.isDefault"
                                                @change="toggleDefaultLanguage"
                                                :disabled="!selectedLanguage"
                                                class="mr-2"
                                            />
                                            <span>Default Language</span>
                                        </div>
                                        <button
                                            @click="deleteSelectedLanguage"
                                            :disabled="!selectedLanguage || getLanguageByCode(selectedLanguage)?.isDefault || gameForm.languages.length <= 1"
                                            :class="[
                                                'text-gray-600 flex items-center',
                                                selectedLanguage && !getLanguageByCode(selectedLanguage)?.isDefault && gameForm.languages.length > 1
                                                    ? 'hover:text-red-600 cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed',
                                            ]"
                                        >
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                ></path>
                                            </svg>
                                            Delete language
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(language, index) in gameForm.languages"
                                :key="language.code"
                                :class="['border-b border-gray-300 cursor-pointer hover:bg-gray-50', selectedLanguage === language.code ? 'bg-blue-50' : '']"
                                @click="selectLanguage(language.code)"
                            >
                                <td class="px-6 py-4 border-r border-gray-300 bg-gray-50">
                                    {{ language.name }}
                                    <span v-if="language.isDefault" class="text-gray-500"> ></span>
                                </td>
                                <td class="px-6 py-4">
                                    <div v-if="selectedLanguage === language.code">
                                        <div class="mb-2">
                                            <label class="text-sm font-medium text-gray-700">Name</label>
                                        </div>
                                        <input v-model="language.nameValue" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-sm" placeholder="Enter game name" />
                                    </div>
                                    <div v-else class="text-gray-400 text-sm italic">Click to edit</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" class="px-6 py-4">
                                    <button @click="openLanguageModal" class="border border-gray-300 px-3 py-1 rounded-sm flex items-center hover:bg-gray-50">
                                        <span class="mr-1">+</span> Add language
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Add Language Modal -->
            <div v-if="showLanguageModal" class="border border-gray-300 mb-6">
                <div class="flex justify-between items-center border-b border-gray-300 px-6 py-3">
                    <h3 class="font-medium">Add Language</h3>
                    <button @click="closeLanguageModal" class="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div class="p-6">
                    <select v-model="selectedNewLanguage" class="w-full px-3 py-2 border border-gray-300 rounded-sm mb-4">
                        <option value="">Select a language</option>
                        <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                            {{ lang.name }}
                        </option>
                    </select>
                    <div class="flex justify-center">
                        <button
                            @click="addLanguage"
                            :disabled="!selectedNewLanguage"
                            :class="['border border-gray-300 px-6 py-1 rounded-sm flex items-center', selectedNewLanguage ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed']"
                        >
                            <span class="mr-1">+</span> Add
                        </button>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between">
                <div>
                    <button type="button" @click="cancel" class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100">Return To List Page</button>
                </div>
                <div>
                    <button type="button" @click="updateGame" class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100">Register / Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCategories } from "@/composables/useCategories";
import { useGameForm } from "@/composables/useGameForm";
import { LANGUAGES } from "@/composables/languages";
import Icon from "@/components/Icon.vue";

const router = useRouter();
const route = useRoute();
const gameId = route.params.id;

// Composables
const { categories, isLoading: catLoading, error: catError, fetchCategories } = useCategories();
const { gameForm, isLoading, error, updateGame } = useGameForm();

// Language management state
const selectedLanguage = ref("");
const showLanguageModal = ref(false);
const selectedNewLanguage = ref("");

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
    selectedLanguage.value = "";
};

const openLanguageModal = () => {
    showLanguageModal.value = true;
    selectedNewLanguage.value = "";
};

const closeLanguageModal = () => {
    showLanguageModal.value = false;
    selectedNewLanguage.value = "";
};

const addLanguage = () => {
    if (!selectedNewLanguage.value) return;

    const languageData = LANGUAGES.find((lang) => lang.code === selectedNewLanguage.value);
    if (!languageData) return;

    gameForm.value.languages.push({
        code: languageData.code,
        name: languageData.name,
        isDefault: false,
        nameValue: "",
    });

    closeLanguageModal();
};

const loadGame = async (id) => {
    try {
        const res = await fetch(`/api/games/${id}`);
        const result = await res.json();
        if (!result.success) {
            error.value = result.error || "Game not found";
            return;
        }

        const languages = (result.data.name || []).map((item) => {
            const lang = item.language;
            const found = LANGUAGES.find((l) => l.code === lang.code);
            return {
                code: lang.code,
                name: found?.name || lang.code,
                isDefault: item.isDefaut === "true" || item.isDefault === true,
                nameValue: lang.value || "",
            };
        });

        gameForm.value = {
            id: result.data.id,
            categoryId: result.data.categoryId,
            languages: languages.length ? languages : [{ ...LANGUAGES[0], isDefault: true, nameValue: "" }],
        };

        // Auto-select first language
        if (gameForm.value.languages?.length > 0) {
            selectedLanguage.value = gameForm.value.languages[0].code;
        }
    } catch {
        error.value = "Error loading game data";
    }
};

const cancel = () => router.push("/games");

onMounted(async () => {
    await fetchCategories();
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
