import { ref } from 'vue';
import * as gameServices from '@/services/gameServices';

export function useGameForm(initialData = null) {
    const gameForm = ref(
        initialData || {
            categoryId: '',
            name: [
                {
                    language: {
                        code: 'EN',
                        value: '',
                    },
                    isDefault: true,
                },
            ],
        },
    );

    console.log('Game form initialized:', gameForm.value);

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function updateGame() {
        isLoading.value = true;
        try {
            const result = await gameServices.updateGame(gameForm.value);
            if (!result.success) {
                error.value = result.error || 'Failed to update game';
            }
        } catch (_err) {
            error.value = 'Error updating game';
        } finally {
            isLoading.value = false;
        }
    }

    async function createGame() {
        isLoading.value = true;
        try {
            const result = await gameServices.createGame(gameForm.value);
            if (!result.success) {
                error.value = result.error || 'Failed to create game';
            }
        } catch (_err) {
            error.value = 'Error creating game';
        } finally {
            isLoading.value = false;
        }
    }

    return { gameForm, isLoading, error, updateGame, createGame };
}
