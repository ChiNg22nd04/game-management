import { ref, onMounted } from 'vue';
import * as categoryServices from '@/services/categoryServices';

export function useCategories() {
    const categories = ref([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const fetchCategories = async () => {
        try {
            const result = await categoryServices.fetchCategories();
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
