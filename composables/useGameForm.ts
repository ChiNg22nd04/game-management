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

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function updateGame() {
        // Validate trước khi gửi
        if (!gameForm.value.name.some((n) => n.isDefault)) {
            error.value = 'Please select a default language';
            return;
        }
        if (gameForm.value.name.some((n) => !n.language.nameValue)) {
            error.value = 'All languages must have a name';
            return;
        }

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
