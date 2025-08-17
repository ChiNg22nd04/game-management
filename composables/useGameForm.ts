import { ref } from 'vue';

export function useGameForm(initialData = null) {
    const gameForm = ref(
        initialData || {
            id: '',
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
            const response = await fetch('/api/games/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameForm.value),
            });
            const result = await response.json();
            if (!result.success) {
                error.value = result.error || 'Failed to update game';
            }
        } catch (_err) {
            error.value = 'Error updating game';
        } finally {
            isLoading.value = false;
        }
    }

    return { gameForm, isLoading, error, updateGame };
}
