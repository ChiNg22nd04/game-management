<template>
    <div class="border border-gray-300 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-200">
                <tr>
                    <th class="px-6 py-3 text-center border-r border-gray-300">
                        <input
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                        />
                    </th>
                    <th class="px-6 py-3 text-left border-r border-gray-300">
                        ID
                    </th>
                    <th class="px-6 py-3 text-left border-r border-gray-300">
                        Name
                    </th>
                    <th class="px-6 py-3 text-left">Category</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-300">
                <tr
                    v-for="game in paginatedGames"
                    :key="game.id"
                    :class="{ 'bg-gray-100': game.id % 2 === 0 }"
                >
                    <td class="px-6 py-4 text-center border-r border-gray-300">
                        <input
                            type="checkbox"
                            :checked="isGameSelected(game.id)"
                            @change="toggleGameSelection(game.id)"
                        />
                    </td>
                    <td
                        class="px-6 py-4 border-r border-gray-300 flex items-center"
                    >
                        <span class="mr-1">{{ game.id }}</span>
                        <button
                            @click="$emit('edit', game.id)"
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
                    <td class="px-6 py-4 border-r border-gray-300">
                        {{ getGameName(game) }}
                    </td>
                    <td class="px-6 py-4">
                        {{ getCategoryName(game.categoryId) }}
                    </td>
                </tr>
                <tr v-if="paginatedGames.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center">
                        No games found
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    paginatedGames: Array,
    isGameSelected: Function,
    toggleGameSelection: Function,
    isAllSelected: Boolean,
    toggleSelectAll: Function,
    getGameName: Function,
    getCategoryName: Function,
});
defineEmits(["edit"]);

console.log("GameTable component loaded");
</script>
