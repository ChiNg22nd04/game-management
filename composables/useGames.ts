import { ref, computed, onMounted } from 'vue';
import * as gameServices from '@/services/gameServices';
import { navigateTo } from 'nuxt/app';

export function useGames() {
    const games = ref<any[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const searchQuery = ref('');
    const selectedCategory = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const selectedGames = ref<string[]>([]);

    const displayedGames = ref<any[]>([]);

    const showDeleteModal = ref(false);
    const deleteModalMessage = ref('');
    const pendingDeleteIds = ref<string[]>([]);

    // Fetch games
    const fetchGames = async () => {
        try {
            isLoading.value = true;
            const result = await gameServices.fetchGames();
            console.log('Games fetched:', result);

            if (result.success) {
                games.value = result.data || [];
                error.value = null; // Clear any previous errors
            } else {
                error.value = result.error || 'Unknown error occurred';
                games.value = [];
            }
        } catch (err) {
            console.error('Error fetching games:', err);
            error.value = 'Failed to connect to server. Please try again later.';
            games.value = [];
        } finally {
            isLoading.value = false;
            filteredGames();
        }
    };

    const getGameName = (game: any): string => {
        console.log('Getting game name for:', game.name);
        if (!Array.isArray(game.name) || game.name.length === 0) return '';
        const defaultLang = game.name.find((n: any) => n.isDefault === 'true' || n.isDefault === true);
        console.log('Default language found:', defaultLang);
        return defaultLang?.language?.value || game.name[0]?.language?.value || '';
    };

    const getCategoryName = (game: any): string => {
        return game?.category?.name || 'Không có danh mục';
    };

    // Filtering
    const filteredGames = () => {
        console.log('Filtering games');
        if (!games.value || games.value.length === 0) {
            displayedGames.value = [];
            return;
        }

        displayedGames.value = games.value.filter((game) => {
            const gameName = getGameName(game).toLowerCase();
            const searchText = searchQuery.value.toLowerCase();

            const matchesSearch = gameName.includes(searchText);
            const matchesCategory = !selectedCategory.value || game.categoryId === selectedCategory.value;

            console.log(matchesSearch && matchesCategory);

            return matchesSearch && matchesCategory;
        });
    };

    // Pagination
    const totalPages = computed(() => Math.ceil(displayedGames.value.length / itemsPerPage.value));

    const paginatedGames = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const pageData = displayedGames.value.slice(start, start + itemsPerPage.value);

        console.log(`Paginated games (page ${currentPage.value}):`, pageData);

        return pageData;
    });

    const isGameSelected = (id: string) => {
        console.log('Checking if game is selected for id:', id, 'Current selected:', selectedGames.value);
        return selectedGames.value.includes(id);
    };

    const toggleGameSelection = (id: string) => {
        console.log('Toggling game with id:', id);
        if (isGameSelected(id)) {
            selectedGames.value = selectedGames.value.filter((gid) => gid !== id);
        } else {
            selectedGames.value.push(id);
        }
        console.log('Now selected:', selectedGames.value);
    };

    const isAllSelected = computed(
        () => paginatedGames.value.length > 0 && paginatedGames.value.every((g) => isGameSelected(g.id)),
    );

    const toggleSelectAll = () => {
        if (isAllSelected.value) {
            selectedGames.value = selectedGames.value.filter((id) => !paginatedGames.value.some((g) => g.id === id));
        } else {
            paginatedGames.value.forEach((g) => {
                if (!isGameSelected(g.id)) selectedGames.value.push(g.id);
            });
        }
    };

    const clearSelection = () => {
        selectedGames.value = [];
        console.log('Selection cleared');
    };

    // Delete functions
    const confirmDeleteSelected = () => {
        pendingDeleteIds.value = [...selectedGames.value];
        deleteModalMessage.value = `Are you sure you want to delete the selected ${selectedGames.value.length}?`;
        showDeleteModal.value = true;
        console.log('Confirm delete for ids:', pendingDeleteIds.value);
    };

    const closeDeleteModal = () => {
        showDeleteModal.value = false;
        pendingDeleteIds.value = [];
        console.log('Delete modal closed');
    };

    const executeDelete = async () => {
        if (pendingDeleteIds.value.length === 0) return;
        try {
            console.log('Deleting games with ids:', pendingDeleteIds.value);
            const result = await gameServices.deleteGames(pendingDeleteIds.value);
            if (result.success) {
                games.value = games.value.filter((g) => !pendingDeleteIds.value.includes(g.id));
                selectedGames.value = selectedGames.value.filter((id) => !pendingDeleteIds.value.includes(id));
                if (paginatedGames.value.length === 0 && currentPage.value > 1) currentPage.value--;
                navigateTo('/games');
            } else {
                console.error('Delete failed:', result.error);
            }
        } catch (err) {
            console.error('Error deleting games:', err);
        } finally {
            closeDeleteModal();
        }
        await fetchGames();
    };

    onMounted(async () => {
        console.log('Component mounted, fetching games...');
        await fetchGames();
    });

    return {
        games,
        isLoading,
        error,
        searchQuery,
        filteredGames,
        displayedGames,
        selectedCategory,
        currentPage,
        itemsPerPage,
        selectedGames,
        paginatedGames,
        totalPages,
        getGameName,
        getCategoryName,
        isGameSelected,
        toggleGameSelection,
        isAllSelected,
        toggleSelectAll,
        clearSelection,
        showDeleteModal,
        deleteModalMessage,
        confirmDeleteSelected,
        closeDeleteModal,
        executeDelete,
    };
}
