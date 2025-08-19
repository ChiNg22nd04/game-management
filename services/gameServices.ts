export async function fetchGames() {
    const res = await fetch('/api/games');
    return await res.json();
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
