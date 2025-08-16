import { ref, computed, onMounted } from "vue";

export function useGames() {
    const games = ref([]);
    const categories = ref([]);
    const isLoading = ref(true);
    const error = ref(null);

    const searchQuery = ref("");
    const selectedCategory = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const selectedGames = ref([]);

    const showDeleteModal = ref(false);
    const deleteModalMessage = ref("");
    const pendingDeleteIds = ref([]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const result = await res.json();

            console.log("Categories fetched:", result);

            if (result.success) categories.value = result.data;
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch games
    const fetchGames = async () => {
        try {
            isLoading.value = true;
            const res = await fetch("/api/games");
            const result = await res.json();

            console.log("Games fetched:", result);

            if (result.success) games.value = result.data;
            else error.value = result.error;
        } catch (err) {
            error.value = "Failed to fetch games";
            console.error("Error fetching games:", err);
        } finally {
            isLoading.value = false;
        }
    };

    // Game name helper
    const getGameName = (game) => {
        if (Array.isArray(game.name) && game.name.length > 0) {
            for (const nameObj of game.name) {
                if (nameObj.isDefault && nameObj.language) {
                    const langs = Object.values(nameObj.language);
                    if (langs.length > 0) return langs[0];
                }
            }
            for (const nameObj of game.name) {
                if (nameObj.language?.JA) return nameObj.language.JA;
            }
            return Object.values(game.name[0].language || {})[0] || "Unknown";
        }
        return "Unknown";
    };

    const getCategoryName = (categoryId) => {
        const cat = categories.value.find((c) => c.id === categoryId);
        return cat ? cat.name : "Không có danh mục";
    };

    // Filtering
    const filteredGames = computed(() => {
        return games.value.filter((game) => {
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
    const isGameSelected = (id) => selectedGames.value.includes(id);

    const toggleGameSelection = (id) => {
        const idx = selectedGames.value.indexOf(id);
        if (idx === -1) selectedGames.value.push(id);
        else selectedGames.value.splice(idx, 1);
        console.log("Selected games after toggle:", selectedGames.value);
    };

    const isAllSelected = computed(
        () =>
            paginatedGames.value.length > 0 &&
            paginatedGames.value.every((g) => isGameSelected(g.id))
    );

    const toggleSelectAll = () => {
        if (isAllSelected.value) {
            paginatedGames.value.forEach((g) =>
                selectedGames.value.splice(selectedGames.value.indexOf(g.id), 1)
            );
        } else {
            paginatedGames.value.forEach((g) => {
                if (!selectedGames.value.includes(g.id))
                    selectedGames.value.push(g.id);
            });
        }
        console.log("Selected games after toggle all:", selectedGames.value);
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
        console.log("Component mounted, fetching data...");
        await Promise.all([fetchCategories(), fetchGames()]);
    });

    return {
        games,
        categories,
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
