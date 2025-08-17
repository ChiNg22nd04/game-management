import { ref } from 'vue';

export function useCategories() {
    const categories = ref([]);
    const isLoading = ref(true);
    const error = ref(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const result = await response.json();
            if (result.success) {
                categories.value = result.data;
            } else {
                error.value = result.error;
            }
        } catch (_err) {
            error.value = 'Failed to fetch categories';
        } finally {
            isLoading.value = false;
        }
    };

    return { categories, isLoading, error, fetchCategories };
}
