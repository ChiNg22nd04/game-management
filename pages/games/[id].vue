<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">Game Register / Edit</h1>

        <div v-if="isLoading" class="flex justify-center my-12">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            ></div>
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
                <h2 class="text-lg font-medium mb-4">Basic Info</h2>
                <div class="border border-gray-300">
                    <table class="w-full">
                        <tbody>
                            <tr class="border-b border-gray-300">
                                <td
                                    class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50"
                                >
                                    <label for="gameCategory">Catetory</label>
                                </td>
                                <td class="px-6 py-4">
                                    <select
                                        id="gameCategory"
                                        v-model="gameForm.categoryId"
                                        class="w-40 px-3 py-2 border border-gray-300 rounded-sm"
                                    >
                                        <option
                                            v-for="category in categories"
                                            :key="category.id"
                                            :value="category.id"
                                        >
                                            {{ category.name }}
                                        </option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    class="px-6 py-4 border-r border-gray-300 w-1/4 bg-gray-50"
                                >
                                    <label for="gameId">ID</label>
                                </td>
                                <td class="px-6 py-4">
                                    <input
                                        id="gameId"
                                        v-model="gameForm.id"
                                        type="text"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-sm"
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
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-medium">Multi-languages Info</h2>
                </div>
                <div class="border border-gray-300">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-300">
                                <th
                                    class="px-6 py-3 text-left border-r border-gray-300 w-1/4 bg-gray-50"
                                >
                                    Input by Language
                                </th>
                                <th
                                    class="px-6 py-3 text-left bg-gray-50 flex justify-between items-center"
                                >
                                    <div class="flex items-center">
                                        <span>Default Language</span>
                                    </div>
                                    <button class="text-gray-600">
                                        Delete language
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(language, index) in gameForm.languages"
                                :key="language.code"
                                class="border-b border-gray-300"
                            >
                                <td
                                    class="px-6 py-4 border-r border-gray-300 bg-gray-50"
                                >
                                    {{ language.name }}
                                    <span
                                        v-if="language.isDefault"
                                        class="text-gray-500"
                                        >></span
                                    >
                                </td>
                                <td class="px-6 py-4">
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <div>
                                            <input
                                                v-model="language.nameValue"
                                                type="text"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-sm"
                                            />
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                v-if="!language.isDefault"
                                                @click="
                                                    setDefaultLanguage(
                                                        language.code
                                                    )
                                                "
                                                class="text-blue-500 hover:underline"
                                            >
                                                Set Default
                                            </button>
                                            <button
                                                v-if="
                                                    !language.isDefault &&
                                                    gameForm.languages.length >
                                                        1
                                                "
                                                @click="
                                                    removeLanguage(
                                                        language.code
                                                    )
                                                "
                                                class="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" class="px-6 py-4">
                                    <button
                                        @click="openLanguageModal"
                                        class="border border-gray-300 px-3 py-1 rounded-sm flex items-center"
                                    >
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
                <div
                    class="flex justify-between items-center border-b border-gray-300 px-6 py-3"
                >
                    <h3 class="font-medium">Add Language</h3>
                    <button @click="closeLanguageModal">✕</button>
                </div>
                <div class="p-6">
                    <select
                        v-model="selectedLanguage"
                        class="w-full px-3 py-2 border border-gray-300 rounded-sm mb-4"
                    >
                        <option value="">Select a language</option>
                        <option
                            v-for="lang in availableLanguages.filter(
                                (l) =>
                                    !gameForm.languages.some(
                                        (gl) => gl.code === l.code
                                    )
                            )"
                            :key="lang.code"
                            :value="lang.code"
                        >
                            {{ lang.name }}
                        </option>
                    </select>
                    <div class="flex justify-center">
                        <button
                            @click="addLanguage"
                            class="border border-gray-300 px-6 py-1 rounded-sm flex items-center"
                        >
                            <span class="mr-1">+</span> Add
                        </button>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between">
                <div>
                    <button
                        type="button"
                        @click="cancel"
                        class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100"
                    >
                        Return To List Page
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        @click="updateGame"
                        class="border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-100"
                    >
                        Register / Edit
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useCategories } from "@/composables/useCategories";
import { useGameForm } from "@/composables/useGameForm";

const router = useRouter();
const route = useRoute();
const gameId = route.params.id;

const {
    categories,
    isLoading: catLoading,
    error: catError,
    fetchCategories,
} = useCategories();
const { gameForm, isLoading, error, updateGame } = useGameForm();

onMounted(async () => {
    await fetchCategories();
    if (gameId) {
        try {
            const response = await fetch(`/api/games/${gameId}`);
            const result = await response.json();
            if (result.success) {
                const languages = (result.data.name || []).map((item) => {
                    const lang = item.language;
                    const code = lang.code;
                    const value = lang.value || "";
                    const isDefault =
                        item.isDefaut === "true" || item.isDefault === true;
                    let name =
                        code === "JA"
                            ? "Japanese"
                            : code === "EN"
                            ? "English"
                            : code === "KO"
                            ? "Korean"
                            : code;
                    return {
                        code,
                        name,
                        isDefault,
                        nameValue: value,
                    };
                });
                gameForm.value = {
                    id: result.data.id,
                    categoryId: result.data.categoryId,
                    languages:
                        languages.length > 0
                            ? languages
                            : [
                                  {
                                      code: "EN",
                                      name: "English",
                                      isDefault: true,
                                      nameValue: "",
                                  },
                              ],
                };
            } else {
                error.value = result.error || "Game not found";
            }
        } catch (err) {
            error.value = "Error loading game data";
        }
    }
});

function cancel() {
    router.push("/games");
}
</script>
