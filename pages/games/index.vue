<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="mb-6 text-2xl font-bold">Game Management</h1>

        <!-- Search and Filter Section -->
        <SearchFilter
            :categories="categories"
            :search-query="searchQuery"
            :selected-category="selectedCategory"
            @update:search-query="updateSearchQuery"
            @update:selected-category="updateSelectedCategory"
            @search="applyFilters"
        />

        <!-- Game List Header -->
        <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-medium">Game List</h2>
            <div class="flex space-x-2">
                <button
                    v-if="selectedGames.length > 0"
                    class="flex items-center rounded-sm border border-gray-300 px-4 py-2 hover:bg-gray-100"
                    @click="confirmDeleteSelected"
                >
                    <Icon name="trash" class="mr-1 h-4 w-4" />
                    Delete Selected
                </button>
                <button
                    class="flex items-center rounded-sm border border-gray-300 px-4 py-2 hover:bg-gray-100"
                    @click="navigateToRegister"
                >
                    <Icon name="plus" class="mr-1 h-4 w-4" />
                    Register New Game
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="my-12 flex justify-center">
            <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {{ error }}
        </div>

        <!-- Games Table -->
        <GameTable
            v-else
            :paginated-games="paginatedGames"
            :get-game-name="getGameName"
            :get-category-name="getCategoryName"
            :is-game-selected="isGameSelected"
            :toggle-game-selection="toggleGameSelection"
            :is-all-selected="isAllSelected"
            :toggle-select-all="toggleSelectAll"
        />

        <!-- Pagination -->
        <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @prev="prevPage"
            @next="nextPage"
            @goto="goToPage"
        />

        <!-- Delete Confirmation Modal -->
        <DeleteModal
            v-if="showDeleteModal"
            :message="deleteModalMessage"
            @cancel="closeDeleteModal"
            @confirm="executeDelete"
        />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGames } from '@/composables/useGames';
import { useCategories } from '@/composables/useCategories';
import GameTable from '@/components/GameTable.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import Icon from '@/components/Icon.vue';
import SearchFilter from '@/components/SearchFilter.vue';

// Component name for ESLint
defineOptions({
    name: 'GamesList',
});

const router = useRouter();
const {
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    currentPage,
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

const { categories } = useCategories();

function navigateToRegister() {
    router.push('/register');
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

function updateSearchQuery(query) {
    searchQuery.value = query;
}

function updateSelectedCategory(category) {
    selectedCategory.value = category;
}
</script>
