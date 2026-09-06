let todosLosRepuestos = []; // Guardará la lista global de repuestos

// ========== CARGAR DESPLEGABLE Y LISTA DE MECÁNICOS ==========
function cargarSelectMecanicos() {
    fetch("http://localhost:3000/mecanicos")
        .then(res => res.json())
        .then(mecanicos => {
            const select = document.getElementById("rep-mecanico");
            if (select) {
                select.innerHTML = '<option value="">Selecciona un mecánico...</option>';
                mecanicos.forEach((m, i) => {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = `${m.name} (${m.level}) - $${m.price_hour}/h`;
                    select.appendChild(option);
                });
            }
            
            mostrarMecanicos(mecanicos);
        })
        .catch(err => console.error("Error al cargar mecánicos:", err));
}

// ========== CARGAR Y FILTRAR REPUESTOS POR MODELO ==========
function cargarSelectRepuestos() {
    fetch("http://localhost:3000/repuestos")
        .then(res => res.json())
        .then(repuestos => {
            todosLosRepuestos = repuestos;
            
            const modelosUnicos = [...new Set(repuestos.map(r => (r.brand || r.modelo || "Generico").toLowerCase()))];
            const selectModelo = document.getElementById("select-modelo-moto");
            
            if (selectModelo) {
                selectModelo.innerHTML = '<option value="">Todos los modelos...</option>';
                modelosUnicos.forEach(modelo => {
                    const option = document.createElement("option");
                    option.value = modelo;
                    option.textContent = modelo.toUpperCase();
                    selectModelo.appendChild(option);
                });
            }

            filtrarRepuestosPorModelo();
            mostrarRepuestos(repuestos);
        })
        .catch(err => console.error("Error al cargar repuestos:", err));
}

function filtrarRepuestosPorModelo() {
    const contenedor = document.getElementById("contenedor-repuestos");
    const selectModelo = document.getElementById("select-modelo-moto");
    if (!contenedor) return;

    const modeloSeleccionado = selectModelo ? selectModelo.value.toLowerCase() : "";
    contenedor.innerHTML = "";

    const repuestosFiltrados = todosLosRepuestos.filter((r, index) => {
        const modeloRepuesto = (r.brand || r.modelo || "").toLowerCase();
        r.originalIndex = index;
        return modeloSeleccionado === "" || modeloRepuesto === modeloSeleccionado;
    });

    if (repuestosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No hay repuestos registrados para este modelo.</p>";
        return;
    }

    repuestosFiltrados.forEach(r => {
        const nombre = r.name || r.repuesto || "Sin nombre";
        const precio = r.price || r.precio || 0;

        const div = document.createElement("div");
        div.innerHTML = `
            <label>
                <input type="checkbox" class="chk-repuesto" value="${r.originalIndex}">
                ${nombre} - $${precio}
            </label>
        `;
        contenedor.appendChild(div);
    });
}

// ========== HISTORIAL DE PRESUPUESTOS ==========
function cargarHistorial() {
    fetch("http://localhost:3000/historial")
        .then(res => res.json())
        .then(historial => {
            const ul = document.getElementById("lista-historial");
            if (!ul) return;

            ul.innerHTML = "";
            historial.forEach((item, index) => {
                const li = document.createElement("li");
                const mecNombre = item.mecanico ? item.mecanico.name : "Desconocido";
                li.innerHTML = `<strong>#${index + 1}</strong> - Mecánico: ${mecNombre} | Tiempo: ${item.tiempo_reparacion}h | Total: $${item.res}`;
                ul.appendChild(li);
            });
        })
        .catch(err => console.error("Error al cargar historial:", err));
}

// ========== AGREGAR MECÁNICO ==========
function agregarMecanico() {
    const nameInput = document.getElementById("mec-name");
    const levelInput = document.getElementById("mec-level");
    const priceInput = document.getElementById("mec-price");

    if (!nameInput.value || !levelInput.value || !priceInput.value) {
        alert("Por favor completa todos los campos del mecánico.");
        return;
    }

    const datos = {
        name: nameInput.value,
        level: levelInput.value,
        price_hour: Number(priceInput.value)
    };

    fetch("http://localhost:3000/mecanicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        alert(res.ms || "Mecánico guardado con éxito");
        nameInput.value = "";
        levelInput.value = "";
        priceInput.value = "";
        
        cargarSelectMecanicos();
    })
    .catch(err => console.error("Error al agregar mecánico:", err));
}

// ========== AGREGAR REPUESTO ==========
function agregarRepuesto() {
    const modeloInput = document.getElementById("rep-modelo");
    const nombreInput = document.getElementById("rep-nombre");
    const precioInput = document.getElementById("rep-precio");

    if (!modeloInput.value || !nombreInput.value || !precioInput.value) {
        alert("Por favor completa todos los campos del repuesto.");
        return;
    }

    const datos = {
        name: nombreInput.value,
        brand: modeloInput.value,
        price: Number(precioInput.value)
    };

    fetch("http://localhost:3000/repuestos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        alert(res.ms || "Repuesto guardado con éxito");
        nombreInput.value = "";
        modeloInput.value = "";
        precioInput.value = "";

        cargarSelectRepuestos();
    })
    .catch(err => console.error("Error al guardar repuesto:", err));
}

// ========== CALCULAR REPARACIÓN ==========
function calcularReparacion() {
    const selectMecanico = document.getElementById("rep-mecanico");
    const tiempoInput = document.getElementById("rep-tiempo");

    const checkboxes = document.querySelectorAll(".chk-repuesto:checked");
    const repuestosIndexes = Array.from(checkboxes).map(chk => Number(chk.value));

    if (!selectMecanico || !selectMecanico.value || !tiempoInput || !tiempoInput.value) {
        alert("Por favor selecciona un mecánico y especifica el tiempo en horas.");
        return;
    }

    const datos = {
        mecanicoIndex: Number(selectMecanico.value),
        repuestosIndexes: repuestosIndexes,
        tiempo: Number(tiempoInput.value)
    };

    fetch("http://localhost:3000/reparacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        const calculo = res.data || res;
        const resultadoDiv = document.getElementById("resultado");

        if (resultadoDiv) {
            resultadoDiv.innerHTML = `
                <p><strong>Mecánico:</strong> ${calculo.mecanico.name}</p>
                <p><strong>Piezas seleccionadas:</strong> ${repuestosIndexes.length}</p>
                <p><strong>Tiempo:</strong> ${calculo.tiempo_reparacion} horas</p>
                <p><strong>Costo repuestos:</strong> $${calculo.costo_repuestos}</p>
                <p style="font-size: 1.1rem; margin-top: 5px; color: #1e3a8a;"><strong>Total:</strong> $${calculo.res}</p>
            `;
        }

        cargarHistorial();
    })
    .catch(err => console.error("Error al calcular reparación:", err));
}

// ========== FUNCIONES PARA MOSTRAR LISTAS ==========
function mostrarMecanicos(lista) {
    const ul = document.getElementById("lista-mecanicos");
    if (!ul) return;
    
    ul.innerHTML = "";
    lista.forEach((m, i) => {
        const li = document.createElement("li");
        li.textContent = `[${i}] ${m.name} - Nivel: ${m.level} - $${m.price_hour}/hora`;
        ul.appendChild(li);
    });
}

function mostrarRepuestos(lista) {
    const ul = document.getElementById("lista-repuestos");
    if (!ul) return;

    ul.innerHTML = "";
    lista.forEach(r => {
        const nombre = r.name || r.repuesto || "Sin nombre";
        const marca = r.brand || r.modelo || "Sin marca";
        const precio = r.price || r.precio || 0;

        const li = document.createElement("li");
        li.textContent = `${nombre} (${marca.toUpperCase()}) - $${precio}`;
        ul.appendChild(li);
    });
}

// ========== CARGA INICIAL AUTOMÁTICA ==========
window.addEventListener("DOMContentLoaded", () => {
    cargarSelectMecanicos();
    cargarSelectRepuestos();
    cargarHistorial();
});