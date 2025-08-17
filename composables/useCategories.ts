import { ref, onMounted } from 'vue';

export function useCategories() {
    const categories = ref([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const result = await response.json();
            console.log('Fetched categories:', result);
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

    onMounted(async () => {
        console.log('Component mounted, fetching categories...');
        await fetchCategories();
    });

    return { categories, isLoading, error };
}
