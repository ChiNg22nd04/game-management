<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">Game Management</h1>

        <SearchFilter
            :categories="categories"
            v-model:searchQuery="searchQuery"
            v-model:selectedCategory="selectedCategory"
            @applyFilters="currentPage = 1"
        />

        <div class="flex justify-between items-center mb-3">
            <h2 class="text-lg font-medium">Game List</h2>
            <div class="flex space-x-2">
                <button
                    v-if="selectedGames.length > 0"
                    @click="confirmDeleteSelected"
                    class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
                >
                    Delete Selected
                </button>
                <button
                    @click="navigateToRegister"
                    class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
                >
                    Register New Game
                </button>
            </div>
        </div>

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

        <GameTable
            :paginatedGames="paginatedGames"
            :isGameSelected="isGameSelected"
            :toggleGameSelection="toggleGameSelection"
            :isAllSelected="isAllSelected"
            :toggleSelectAll="toggleSelectAll"
            :getGameName="getGameName"
            :getCategoryName="getCategoryName"
            @edit="navigateToEditGame"
        />

        <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @prev="prevPage"
            @next="nextPage"
            @goto="goToPage"
        />

        <DeleteModal
            :show="showDeleteModal"
            :message="deleteModalMessage"
            @cancel="closeDeleteModal"
            @confirm="executeDelete"
        />
    </div>
</template>

<script setup>
import { useGames } from "../composables/useGames";
import { useRouter } from "vue-router";

import SearchFilter from "../components/SearchFilter.vue";
import GameTable from "../components/GameTable.vue";
import Pagination from "../components/Pagination.vue";
import DeleteModal from "../components/DeleteModal.vue";

const router = useRouter();
const {
    categories,
    games,
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
    showDeleteModal,
    deleteModalMessage,
    confirmDeleteSelected,
    closeDeleteModal,
    executeDelete,
} = useGames();

const navigateToRegister = () => router.push("/register");
const navigateToEditGame = (id) => router.push(`/games/${id}`);

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToPage = (p) => (currentPage.value = p);
</script>
