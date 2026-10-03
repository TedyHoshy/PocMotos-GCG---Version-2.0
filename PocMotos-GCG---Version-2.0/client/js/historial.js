function cargarHistorial() {
    api("http://localhost:3000/historial")
        .then(historial => {
            const ul = document.getElementById("lista-historial");
            if (!ul) return;

            ul.innerHTML = "";
            (historial || []).forEach((item, index) => {
                const li = document.createElement("li");
                const mecNombre = item.mecanico ? item.mecanico.name : "Desconocido";
                const tiempo = item.tiempo_reparacion ?? "?";
                const total = item.res ?? 0;

                li.innerHTML = `<strong>#${index + 1}</strong> - Mecánico: ${escapeHtml(mecNombre)} | Tiempo: ${escapeHtml(tiempo)}h | Total: $${escapeHtml(total)}`;
                ul.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Error al cargar historial:", err);
        });
}
