<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">Game Management</h1>

        <!-- Search and Filter Section -->
        <div class="border border-gray-300 p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1"
                        >Category</label
                    >
                    <select
                        v-model="selectedCategory"
                        class="w-full px-3 py-2 border border-gray-300 rounded-sm"
                    >
                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1"
                        >Keyword</label
                    >
                    <input
                        type="text"
                        v-model="searchQuery"
                        class="w-full px-3 py-2 border border-gray-300 rounded-sm"
                    />
                </div>
                <div class="flex items-end">
                    <button
                        @click="applyFilters"
                        class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm"
                    >
                        <div class="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            Search
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Game List Header -->
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-lg font-medium">Game List</h2>
            <div class="flex space-x-2">
                <button
                    v-if="selectedGames.length > 0"
                    @click="confirmDeleteSelected"
                    class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    Delete Selected
                </button>
                <button
                    @click="navigateToRegister"
                    class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    Register New Game
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center my-12">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            ></div>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
            {{ error }}
        </div>

        <!-- Games Table -->
        <div v-else class="border border-gray-300 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-center text-xs font-medium tracking-wider border-r border-gray-300"
                        >
                            <input
                                type="checkbox"
                                :checked="isAllSelected"
                                @change="toggleSelectAll"
                                class="h-4 w-4 border-gray-300"
                            />
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium tracking-wider border-r border-gray-300"
                        >
                            ID
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium tracking-wider border-r border-gray-300"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium tracking-wider"
                        >
                            Category
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-300">
                    <tr
                        v-for="game in paginatedGames || []"
                        :key="game.id"
                        :class="{ 'bg-gray-100': game.id % 2 === 0 }"
                    >
                        <td
                            class="px-6 py-4 whitespace-nowrap border-r border-gray-300 text-center"
                        >
                            <input
                                type="checkbox"
                                :checked="isGameSelected(game.id)"
                                @change="toggleGameSelection(game.id)"
                                class="h-4 w-4 border-gray-300"
                            />
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap border-r border-gray-300 flex items-center"
                        >
                            <span class="mr-1">{{ game.id }}</span>
                            <button
                                @click="navigateToEditGame(game.id)"
                                class="text-gray-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                                    />
                                </svg>
                            </button>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap border-r border-gray-300"
                        >
                            {{ getGameName(game) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ getCategoryName(game.categoryId) }}
                        </td>
                    </tr>
                    <!-- Empty state -->
                    <tr v-if="paginatedGames && paginatedGames.length === 0">
                        <td colspan="4" class="px-6 py-4 text-center">
                            No games found
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
            <div class="flex border border-gray-300">
                <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                >
                    «
                </button>
                <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="`px-3 py-1 border-r border-gray-300 hover:bg-gray-100 ${
                        currentPage === page ? 'bg-gray-200' : ''
                    }`"
                >
                    {{ page }}
                </button>
                <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 hover:bg-gray-100"
                >
                    »
                </button>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    Xác nhận xóa
                </h3>
                <p class="text-gray-600 mb-6">
                    {{ deleteModalMessage }}
                </p>
                <div class="flex justify-end space-x-3">
                    <button
                        @click="closeDeleteModal"
                        class="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        @click="executeDelete"
                        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useGames } from "@/composables/useGames";
import GameTable from "@/components/GameTable.vue";
import Pagination from "@/components/Pagination.vue";
import DeleteModal from "@/components/DeleteModal.vue";

const router = useRouter();
const {
    games,
    categories,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    currentPage,
    itemsPerPage,
    selectedGames,
    paginatedGames,
    totalPages,
    getGameName,
    getCategoryName,
    isGameSelected,
    toggleGameSelection,
    isAllSelected,
    toggleSelectAll,
    clearSelection,
    showDeleteModal,
    deleteModalMessage,
    confirmDeleteSelected,
    closeDeleteModal,
    executeDelete,
} = useGames();

function navigateToRegister() {
    router.push("/register");
}
function navigateToEditGame(gameId) {
    router.push(`/games/${gameId}`);
}
function applyFilters() {
    currentPage.value = 1;
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}
function goToPage(page) {
    currentPage.value = page;
}
</script>
