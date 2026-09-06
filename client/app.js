// ========== AGREGAR MECÁNICO ==========
function agregarMecanico() {
    const datos = {
        name: document.getElementById("mec-name").value,
        level: document.getElementById("mec-level").value,
        price_hour: document.getElementById("mec-price").value
    };

    fetch("http://localhost:3000/mecanicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        alert(res.ms);
        mostrarMecanicos(res.todos_los_mecanicos);
    })
    .catch(err => console.error(err));
}

// ========== AGREGAR REPUESTO ==========
function agregarRepuesto() {
    const datos = {
        name: document.getElementById("rep-nombre").value,   // Nombre (ej: starter)
        brand: document.getElementById("rep-modelo").value,  // Modelo (ej: nkd 125)
        price: Number(document.getElementById("rep-precio").value)
    };

    fetch("http://localhost:3000/repuestos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
    })
    .then(res => {
        alert(res.ms);
        mostrarRepuestos(res.todos_los_repuestos);
    })
    .catch(err => console.error("Error al guardar repuesto:", err));
}

// ========== CALCULAR REPARACIÓN ==========
function calcularReparacion() {
    const datos = {
        mecanicoIndex: Number(document.getElementById("rep-mecanico").value),
        tiempo: Number(document.getElementById("rep-tiempo").value)
    };

    fetch("http://localhost:3000/reparacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        document.getElementById("resultado").innerHTML = `
            <p><strong>Mecánico:</strong> ${res.mecanico.name}</p>
            <p><strong>Tiempo:</strong> ${res.tiempo_reparacion} horas</p>
            <p><strong>Costo repuestos:</strong> ${res.costo_repuestos}</p>
            <p><strong>Total:</strong> ${res.res}</p>
        `;
        mostrarMecanicos(res.todos_los_mecanicos);
        mostrarRepuestos(res.todos_los_repuestos);
    })
    .catch(err => console.error(err));
}

// ========== FUNCIONES PARA MOSTRAR LISTAS ==========
function mostrarMecanicos(lista) {
    const ul = document.getElementById("lista-mecanicos");
    ul.innerHTML = "";
    lista.forEach((m, i) => {
        const li = document.createElement("li");
        li.textContent = `[${i}] ${m.name} - Nivel: ${m.level} - $${m.price_hour}/hora`;
        ul.appendChild(li);
    });
}

function mostrarRepuestos(lista) {
    const ul = document.getElementById("lista-repuestos");
    ul.innerHTML = "";
    lista.forEach(r => {
        const nombre = r.name || r.repuesto || "Sin nombre";
        const marca = r.brand || r.modelo || "Sin marca";
        const precio = r.price || r.precio || 0;

        const li = document.createElement("li");
        // Imprime Nombre (Modelo) en lugar de Modelo (Nombre)
        li.textContent = `${nombre} (${marca}) - $${precio}`;
        ul.appendChild(li);
    });
}