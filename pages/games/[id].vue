<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      Game Register / Edit
    </h1>

    <div
      v-if="isLoading"
      class="flex justify-center my-12"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ error }}
    </div>

    <div v-else>
      <!-- Basic Info Section -->
      <div class="mb-6">
        <h2 class="text-lg font-medium mb-4">
          Basic Info
        </h2>
        <div class="border border-gray-300">
          <table class="w-full">
            <tbody>
              <tr class="border-b border-gray-300">
                <td class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50">
                  <label for="gameCategory">Category</label>
                </td>
                <td class="px-6 py-4">
                  <div class="relative w-48">
                    <select
                      v-model="gameForm.categoryId"
                      class="w-full px-3 py-2 border border-gray-300 rounded-sm appearance-none pr-8"
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <Icon
                        name="angle-down"
                        class="h-4 w-4 inline-block ml-1 text-black"
                      />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50">
                  <label for="gameId">ID</label>
                </td>
                <td class="px-6 py-4">
                  <input
                    id="gameId"
                    v-model="gameForm.id"
                    type="text"
                    class="px-3 py-2 border border-gray-300 rounded-sm w-full"
                    :disabled="true"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Multi-languages Info Section -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">
            Multi-languages Info
          </h2>
        </div>
        <div class="border border-gray-300">
          <div class="flex">
            <!-- Language List -->
            <div class="flex flex-col border-r border-gray-300 w-1/4 bg-gray-50 py-4">
              <div class="px-6 pb-4 font-medium border-b border-gray-300">
                Input by Language
              </div>
              <div>
                <div
                  v-for="language in gameForm.languages"
                  :key="language.code"
                  :class="['px-6 py-2 cursor-pointer', selectedLanguage === language.code ? 'font-bold text-black flex items-center' : 'text-gray-700', 'hover:bg-gray-100']"
                  @click="selectLanguage(language.code)"
                >
                  <span>
                    {{ language.name }}
                    <span v-if="selectedLanguage === language.code">&nbsp;&gt;</span>
                  </span>
                </div>
              </div>
              <div class="px-6 pt-4">
                <button
                  class="border border-gray-300 px-3 py-1 rounded-sm flex items-center hover:bg-gray-50 w-full"
                  @click="openLanguageModal"
                >
                  <Icon
                    name="add"
                    class="h-4 w-4 mr-1 text-black"
                  />
                  Add language
                </button>
              </div>
            </div>
            <!-- Language Input & Actions -->
            <div class="flex-1">
              <div class="flex justify-between items-center border-b border-gray-300">
                <div class="flex items-center px-4 py-4">
                  <input
                    type="checkbox"
                    :checked="selectedLanguage && getLanguageByCode(selectedLanguage)?.isDefault"
                    :disabled="!selectedLanguage"
                    class="mr-2"
                    @change="toggleDefaultLanguage"
                  >
                  <span>Default Language</span>
                </div>
                <button
                  :disabled="!selectedLanguage || getLanguageByCode(selectedLanguage)?.isDefault || gameForm.languages.length <= 1"
                  :class="[
                    'text-gray-600 flex items-center px-4 py-4 border-l border-gray-300',
                    selectedLanguage && !getLanguageByCode(selectedLanguage)?.isDefault && gameForm.languages.length > 1
                      ? 'hover:text-red-600 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed',
                  ]"
                  @click="deleteSelectedLanguage"
                >
                  <Icon
                    name="trash"
                    class="h-4 w-4 mr-1 text-black"
                  />
                  Delete language
                </button>
              </div>
              <div
                v-if="selectedLanguage"
                class="px-4 py-4"
              >
                <div class="mb-2">
                  <label class="text-sm font-medium text-gray-700">Name</label>
                </div>
                <input
                  v-model="selectedLanguageObj.nameValue"
                  type="text"
                  class="px-3 py-2 border border-gray-300 rounded-sm"
                  placeholder="Enter game name"
                >
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
            class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100"
            @click="cancel"
          >
            Return To List Page
          </button>
        </div>
        <div>
          <button
            type="button"
            class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100"
            @click="updateGame"
          >
            Register / Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AddLanguageModal from "@/components/AddLanguageModal.vue";
import { useRouter, useRoute } from "vue-router";
import { useCategories } from "@/composables/useCategories";
import { useGameForm } from "@/composables/useGameForm";
import { LANGUAGES } from "@/composables/languages";
import Icon from "@/components/Icon.vue";

// Component name for ESLint
defineOptions({
  name: 'GameDetail'
});

const router = useRouter();
const route = useRoute();
const gameId = route.params.id;

// Composables
const { categories, fetchCategories } = useCategories();
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

// Add computed property for selected language object
const selectedLanguageObj = computed({
    get() {
        return getLanguageByCode(selectedLanguage.value);
    },
    set(val) {
        if (selectedLanguage.value && val && typeof val.nameValue !== "undefined") {
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

const handleAddLanguage = (languageData) => {
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
        const res = await $fetch(`/api/games/${id}`);
        if (!res.success) {
            error.value = res.error || "Game not found";
            return;
        }

        const languages = (res.data.name || []).map((item) => {
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
            id: res.data.id,
            categoryId: res.data.categoryId,
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
