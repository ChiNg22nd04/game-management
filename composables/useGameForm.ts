import { ref } from 'vue';

export function useGameForm(initialData = null) {
    const gameForm = ref(
        initialData || {
            id: '',
            name: '',
            languages: [{ code: 'en', name: 'English', isDefault: true, nameValue: '' }],
        },
    );
    const isLoading = ref(false);
    const error = ref(null);

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
