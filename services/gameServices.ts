export async function fetchGames() {
    try {
        const res = await fetch('/api/games');

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in fetchGames:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred',
        };
    }
}

export async function createGame(payload: any) {
    const res = await fetch('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return await res.json();
}

export async function deleteGames(ids: string[]) {
    const res = await fetch('/api/games/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });
    return await res.json();
}

export async function updateGame(payload: any) {
    const res = await fetch('/api/games/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return await res.json();
}

export async function getGame(payload: string) {
    const res = await fetch(`/api/games/${payload}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
}
