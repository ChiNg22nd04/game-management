<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      Game Management
    </h1>

    <!-- Search and Filter Section -->
    <div class="border border-gray-300 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">
            Category
          </label>
          <div class="relative">
            <select
              v-model="selectedCategory"
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
            <span
              class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              <Icon
                name="angle-down"
                class="h-4 w-4 inline-block ml-1"
              />
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Keyword</label>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm"
          >
        </div>
        <div class="flex items-end">
          <button
            class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm"
            @click="applyFilters"
          >
            <div class="flex items-center">
              <Icon
                name="search"
                class="h-4 w-4 mr-1"
              />
              Search
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Game List Header -->
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-medium">
        Game List
      </h2>
      <div class="flex space-x-2">
        <button
          v-if="selectedGames.length > 0"
          class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
          @click="confirmDeleteSelected"
        >
          <Icon
            name="trash"
            class="h-4 w-4 mr-1"
          />
          Delete Selected
        </button>
        <button
          class="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-sm flex items-center"
          @click="navigateToRegister"
        >
          <Icon
            name="plus"
            class="h-4 w-4 mr-1"
          />
          Register New Game
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center my-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
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
      @close="closeDeleteModal"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useGames } from "@/composables/useGames";
import GameTable from "@/components/GameTable.vue";
import Pagination from "@/components/Pagination.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Icon from "@/components/Icon.vue";

// Component name for ESLint
defineOptions({
  name: 'GamesList'
});

const router = useRouter();
const {
    categories,
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

function navigateToRegister() {
    router.push("/register");
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
