import { ref, computed } from 'vue';
import * as gameServices from '@/services/gameServices';
import { LANGUAGES } from '@/server/utils/languages';
import { navigateTo } from 'nuxt/app';

export function useGameForm(initialData = null) {
    const gameForm = ref(
        initialData || {
            id: null,
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
    const selectedLanguage = ref<string>('');

    async function updateGame() {
        isLoading.value = true;
        try {
            const { ...payload } = gameForm.value;
            console.log('Updating game with payload:', payload);
            const result = await gameServices.updateGame(payload);
            if (!result.success) {
                error.value = result.error || 'Failed to update game';
            }
            console.log('Game updated:', result);
            await navigateTo('/games');
        } catch (_err) {
            error.value = 'Error updating game';
        } finally {
            isLoading.value = false;
        }
    }

    async function createGame() {
        isLoading.value = true;
        try {
            const { id, ...payload } = gameForm.value;
            const result = await gameServices.createGame(payload);
            if (!result.success) {
                error.value = result.error || 'Failed to create game';
            }
            console.log('Game created:', result);
            await navigateTo('/games');
        } catch (_err) {
            error.value = 'Error creating game';
        } finally {
            isLoading.value = false;
        }
    }

    async function getGame(id: string) {
        isLoading.value = true;
        try {
            const res = await gameServices.getGame(id);
            if (!res.success) {
                error.value = res.error || 'Game not found';
                return;
            }

            const name = (res.data.name || []).map((item: any) => {
                console.log('item', item);
                return {
                    language: {
                        code: item.language.code,
                        value: item.language.value || '',
                    },
                    isDefault: item.isDefault || false,
                };
            });

            gameForm.value = {
                id: res.data.id,
                categoryId: res.data.categoryId,
                name: name.length
                    ? name
                    : [
                          {
                              language: { code: LANGUAGES[0], value: '' },
                              isDefault: true,
                          },
                      ],
            };

            if (gameForm.value.name.length > 0) {
                selectedLanguage.value = gameForm.value.name[0].language.code;
            }
        } catch {
            error.value = 'Error loading game data';
        } finally {
            isLoading.value = false;
        }
    }

    const renderLanguageName = (code: any) => {
        const lang = LANGUAGES.find((l) => l.code === code);
        return lang ? lang.name : code;
    };
    function selectLanguage(code: string) {
        selectedLanguage.value = code;
    }

    function getLanguageByCode(code: any) {
        const data = gameForm.value.name;
        console.log('Getting language:', data);
        const lang = data.find((n) => n.language.code === code);
        console.log('Found language:', lang);
        return lang;
    }

    const availableLanguages = computed(() => {
        const usedCodes = gameForm.value.name.map((n) => n.language.code);
        console.log('Used language codes:', usedCodes);
        return LANGUAGES.filter((lang) => !usedCodes.includes(lang.code));
    });

    const selectedLanguageObj = computed({
        get() {
            const item = getLanguageByCode(selectedLanguage.value);
            return item ? item.language : null;
        },
        set(val) {
            const item = getLanguageByCode(selectedLanguage.value);
            if (item && val && typeof val.value !== 'undefined') {
                item.language.value = val.value;
            }
        },
    });

    function toggleDefaultLanguage() {
        if (!selectedLanguage.value) return;
        gameForm.value.name.forEach((n) => (n.isDefault = false));
        const lang = getLanguageByCode(selectedLanguage.value);
        if (lang) lang.isDefault = true;
    }

    function deleteSelectedLanguage() {
        if (!selectedLanguage.value) return;
        const lang = getLanguageByCode(selectedLanguage.value);
        if (!lang || lang.isDefault || gameForm.value.name.length <= 1) return;
        gameForm.value.name = gameForm.value.name.filter((n) => n.language.code !== selectedLanguage.value);
        selectedLanguage.value = '';
    }

    function addLanguage(lang: any) {
        if (!lang) return;
        gameForm.value.name.push({
            language: { code: lang.code, value: '' },
            isDefault: false,
        });
    }

    return {
        gameForm,
        isLoading,
        error,
        selectedLanguage,
        selectedLanguageObj,
        getGame,
        createGame,
        updateGame,
        selectLanguage,
        renderLanguageName,
        availableLanguages,
        toggleDefaultLanguage,
        deleteSelectedLanguage,
        addLanguage,
        getLanguageByCode,
    };
}
