<template>
    <div class="overflow-x-auto border border-gray-300">
        <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-200">
                <tr>
                    <th class="border-r border-gray-300 px-6 py-3 text-center">
                        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                    </th>
                    <th class="border-r border-gray-300 px-6 py-3 text-left">ID</th>
                    <th class="border-r border-gray-300 px-6 py-3 text-left">Name</th>
                    <th class="px-6 py-3 text-left">Category</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-300 bg-white">
                <tr v-for="game in paginatedGames" :key="game.id" :class="{ 'bg-gray-100': game.id % 2 === 0 }">
                    <td class="border-r border-gray-300 px-6 py-4 text-center">
                        <input
                            type="checkbox"
                            :value="game.id"
                            :checked="isGameSelected(game.id)"
                            @change="toggleGameSelection(game.id)"
                        />
                    </td>
                    <td
                        class="flex items-center border-r border-gray-300 px-6 py-4"
                        @click="navigateToEditGame(game.id)"
                    >
                        <span class="mr-1">{{ game.id }}</span>
                        <button class="text-gray-400" @click="$emit('edit', game.id)">
                            <Icon icon="arrow-up-right-from-square" class="ml-2 h-4 w-4" />
                        </button>
                    </td>
                    <td class="border-r border-gray-300 px-6 py-4">
                        {{ getGameName(game) }}
                    </td>
                    <td class="px-6 py-4">
                        {{ getCategoryName(game) }}
                    </td>
                </tr>
                <tr v-if="paginatedGames.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center">No games found</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

defineProps({
    paginatedGames: {
        type: Array,
        default: () => [],
    },
    isGameSelected: {
        type: Function,
        default: () => () => false,
    },
    toggleGameSelection: {
        type: Function,
        default: () => () => {},
    },
    isAllSelected: {
        type: Boolean,
        default: false,
    },
    toggleSelectAll: {
        type: Function,
        default: () => () => {},
    },
    getGameName: {
        type: Function,
        default: () => () => 'Unknown',
    },
    getCategoryName: {
        type: Function,
        default: () => () => 'Unknown',
    },
});

defineEmits(['edit']);

function navigateToEditGame(gameId) {
    router.push(`/games/${gameId}`);
}
</script>
