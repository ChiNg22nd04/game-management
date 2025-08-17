import { ref, computed, onMounted } from "vue";

export function useGames() {
    const games = ref<any[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const searchQuery = ref("");
    const selectedCategory = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const selectedGames = ref<string[]>([]);

    const showDeleteModal = ref(false);
    const deleteModalMessage = ref("");
    const pendingDeleteIds = ref<string[]>([]);

    // Fetch games
    const fetchGames = async () => {
        try {
            isLoading.value = true;
            const res = await fetch("/api/games");
            const result = await res.json();

            console.log("Games fetched:", result);

            if (result.success) {
                games.value = result.data || [];
            } else {
                error.value = result.error || "Unknown error";
            }
        } catch (err) {
            error.value = "Failed to fetch games";
            console.error("Error fetching games:", err);
        } finally {
            isLoading.value = false;
        }
    };

    const getGameName = (game: any): string => {
        console.log("Getting game name for:", game);
        if (!Array.isArray(game.name) || game.name.length === 0) return "";
        const defaultLang = game.name.find((n: any) => n.isDefaut === "true");
        return (
            defaultLang?.language?.value ||
            game.name[0]?.language?.value ||
            ""
        );
    };

    const getCategoryName = (game: any): string => {
        return game?.category?.name || "Không có danh mục";
    };

    // Filtering
    const filteredGames = computed(() => {
        return (games.value || []).filter((game) => {
            const name = getGameName(game);
            const matchesSearch = name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());

            const matchesCategory =
                !selectedCategory.value ||
                game.categoryId === selectedCategory.value;

            return matchesSearch && matchesCategory;
        });
    });

    // Pagination
    const totalPages = computed(() =>
        Math.ceil(filteredGames.value.length / itemsPerPage.value)
    );

    const paginatedGames = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const pageData = filteredGames.value.slice(
            start,
            start + itemsPerPage.value
        );

        console.log(`Paginated games (page ${currentPage.value}):`, pageData);

        return pageData;
    });

    // Selection logic
    const isGameSelected = (id: string) => selectedGames.value.includes(id);

    const toggleGameSelection = (id: string) => {
        if (isGameSelected(id)) {
            selectedGames.value = selectedGames.value.filter((gid) => gid !== id);
        } else {
            selectedGames.value.push(id);
        }
    };

    const isAllSelected = computed(
        () =>
            paginatedGames.value.length > 0 &&
            paginatedGames.value.every((g) => isGameSelected(g.id))
    );

    const toggleSelectAll = () => {
        if (isAllSelected.value) {
          selectedGames.value = selectedGames.value.filter(
            (id) => !paginatedGames.value.some((g) => g.id === id)
          );
        } else {
          paginatedGames.value.forEach((g) => {
            if (!isGameSelected(g.id)) selectedGames.value.push(g.id);
          });
        }
    };

    const clearSelection = () => {
        selectedGames.value = [];
        console.log("Selection cleared");
    };

    // Delete functions
    const confirmDeleteSelected = () => {
        pendingDeleteIds.value = [...selectedGames.value];
        deleteModalMessage.value = `Bạn có chắc chắn muốn xóa ${selectedGames.value.length} trò chơi đã chọn không?`;
        showDeleteModal.value = true;
        console.log("Confirm delete for ids:", pendingDeleteIds.value);
    };

    const closeDeleteModal = () => {
        showDeleteModal.value = false;
        pendingDeleteIds.value = [];
        console.log("Delete modal closed");
    };

    const executeDelete = async () => {
        if (pendingDeleteIds.value.length === 0) return;
        try {
            console.log("Deleting games with ids:", pendingDeleteIds.value);
            const res = await fetch("/api/games/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: pendingDeleteIds.value }),
            });
            const result = await res.json();
            console.log("Delete result:", result);
            if (result.success) {
                games.value = games.value.filter(
                    (g) => !pendingDeleteIds.value.includes(g.id)
                );
                selectedGames.value = selectedGames.value.filter(
                    (id) => !pendingDeleteIds.value.includes(id)
                );
                if (paginatedGames.value.length === 0 && currentPage.value > 1)
                    currentPage.value--;
            } else alert("Failed to delete: " + result.error);
        } catch (err) {
            console.error("Error deleting games:", err);
            alert("Failed to delete games.");
        } finally {
            closeDeleteModal();
        }
    };

    onMounted(async () => {
        console.log("Component mounted, fetching games...");
        await fetchGames();
    });

    return {
        games,
        isLoading,
        error,
        searchQuery,
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
