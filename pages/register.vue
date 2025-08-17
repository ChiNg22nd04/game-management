<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="mb-6 text-2xl font-bold">Game Register</h1>

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
                                            <option value="">Select a category</option>
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
                                    v-for="item in gameForm.name"
                                    :key="item.language.code"
                                    :class="[
                                        'cursor-pointer px-6 py-2',
                                        selectedLanguage === item.language.code
                                            ? 'flex items-center font-bold text-black'
                                            : 'text-gray-700',
                                        'hover:bg-gray-100',
                                    ]"
                                    @click="selectLanguage(item.language.code)"
                                >
                                    <span>
                                        {{ item.language.code }}
                                    </span>
                                    <Icon
                                        icon="fa-angle-right"
                                        v-if="selectedLanguage === item.language.code"
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
                                        gameForm.name.length <= 1
                                    "
                                    :class="[
                                        'flex items-center border-l border-gray-300 px-4 py-4 text-gray-600',
                                        selectedLanguage &&
                                        !getLanguageByCode(selectedLanguage)?.isDefault &&
                                        gameForm.name.length > 1
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
                                    v-model="selectedLanguageObj.value"
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
                :available-languages="availableLanguages"
                :show="showLanguageModal"
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
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddLanguageModal from '@/components/AddLanguageModal.vue';
import { useRouter } from 'vue-router';
import { useCategories } from '@/composables/useCategories';
import { useGameForm } from '@/composables/useGameForm';
import { LANGUAGES } from '@/composables/languages';
import Icon from '@/components/Icon.vue';

// Component name for ESLint
defineOptions({
    name: 'RegisterGame',
});

const router = useRouter();

// Composables
const { categories } = useCategories();
const { gameForm, isLoading, error, updateGame } = useGameForm();

// Language management state
const selectedLanguage = ref('');
const showLanguageModal = ref(false);
const selectedNewLanguage = ref('');

// Computed properties
const availableLanguages = computed(() => {
    return LANGUAGES.filter((lang) => !gameForm.value.name?.some((item) => item.language.code === lang.code));
});

// Language management functions
const selectLanguage = (code) => {
    selectedLanguage.value = code;
};

const getLanguageByCode = (code) => {
    return gameForm.value.name?.find((item) => item.language.code === code);
};

// Computed để bind v-model cho input name
const selectedLanguageObj = computed({
    get() {
        const item = getLanguageByCode(selectedLanguage.value);
        return item ? item.language : null;
    },
    set(val) {
        const item = getLanguageByCode(selectedLanguage.value);
        if (item && val && typeof val.value !== 'undefined') {
            item.language.value = val.value;
        }
    },
});

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
    console.log('Adding language:', languageData);
    gameForm.value.name.push({
        language: {
            code: languageData.code,
            value: '',
        },
        isDefault: false,
    });
    closeLanguageModal();
};

const cancel = () => router.push('/games');
</script>
