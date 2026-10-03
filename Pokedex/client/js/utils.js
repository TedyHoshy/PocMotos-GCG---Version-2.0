// ========== UTILIDADES ==========
function escapeHtml(text) {
    if (text == null) return "";
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

async function api(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
