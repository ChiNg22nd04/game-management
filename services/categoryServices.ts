export async function fetchCategories() {
    const res = await fetch('/api/categories');
    return await res.json();
}
