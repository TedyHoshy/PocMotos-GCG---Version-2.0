let todosLosRepuestos = []; // Guardará la lista global de repuestos

// ========== UTILIDAD: ESCAPAR HTML (protección XSS) ==========
function escapeHtml(text) {
    if (text == null) return "";
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

// ========== CARGAR DESPLEGABLE Y LISTA DE MECÁNICOS ==========
function cargarSelectMecanicos() {
    fetch("http://localhost:3000/mecanicos")
        .then(async res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
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
        .catch(err => {
            console.error("Error al cargar mecánicos:", err);
            alert("No se pudieron cargar los mecánicos.");
        });
}

// ========== CARGAR Y FILTRAR REPUESTOS POR MODELO ==========
function cargarSelectRepuestos() {
    fetch("http://localhost:3000/repuestos")
        .then(async res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(repuestos => {
            todosLosRepuestos = Array.isArray(repuestos) ? repuestos : [];

            const modelosUnicos = [...new Set(
                todosLosRepuestos.map(r => (r.brand || r.modelo || "Generico").toLowerCase())
            )];

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
            mostrarRepuestos(todosLosRepuestos);
        })
        .catch(err => {
            console.error("Error al cargar repuestos:", err);
            alert("No se pudieron cargar los repuestos.");
        });
}

function filtrarRepuestosPorModelo() {
    const contenedor = document.getElementById("contenedor-repuestos");
    const selectModelo = document.getElementById("select-modelo-moto");
    if (!contenedor) return;

    const modeloSeleccionado = selectModelo ? selectModelo.value.toLowerCase() : "";
    contenedor.innerHTML = "";

    // Creamos copias con el índice original (NO mutamos el array global)
    const repuestosFiltrados = todosLosRepuestos
        .map((r, index) => ({ ...r, originalIndex: index }))
        .filter(r => {
            const modeloRepuesto = (r.brand || r.modelo || "").toLowerCase();
            return modeloSeleccionado === "" || modeloRepuesto === modeloSeleccionado;
        });

    if (repuestosFiltrados.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No hay repuestos registrados para este modelo.";
        contenedor.appendChild(p);
        return;
    }

    repuestosFiltrados.forEach(r => {
        const nombre = r.name || r.repuesto || "Sin nombre";
        const precio = r.price || r.precio || 0;

        const div = document.createElement("div");
        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "chk-repuesto";
        checkbox.value = r.originalIndex;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${nombre} - $${precio}`));

        div.appendChild(label);
        contenedor.appendChild(div);
    });
}

// ========== HISTORIAL DE PRESUPUESTOS ==========
function cargarHistorial() {
    fetch("http://localhost:3000/historial")
        .then(async res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
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

// ========== AGREGAR MECÁNICO ==========
function agregarMecanico() {
    const nameInput = document.getElementById("mec-name");
    const levelInput = document.getElementById("mec-level");
    const priceInput = document.getElementById("mec-price");

    if (!nameInput || !levelInput || !priceInput) return;

    if (!nameInput.value.trim() || !levelInput.value.trim() || !priceInput.value.trim()) {
        alert("Por favor completa todos los campos del mecánico.");
        return;
    }

    const precio = Number(priceInput.value);
    if (isNaN(precio) || precio < 0) {
        alert("El precio por hora debe ser un número válido.");
        return;
    }

    const datos = {
        name: nameInput.value.trim(),
        level: levelInput.value.trim(),
        price_hour: precio
    };

    fetch("http://localhost:3000/mecanicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(res => {
        alert(res.ms || "Mecánico guardado con éxito");
        nameInput.value = "";
        levelInput.value = "";
        priceInput.value = "";
        cargarSelectMecanicos();
    })
    .catch(err => {
        console.error("Error al agregar mecánico:", err);
        alert("Error al guardar el mecánico.");
    });
}

// ========== AGREGAR REPUESTO ==========
function agregarRepuesto() {
    const modeloInput = document.getElementById("rep-modelo");
    const nombreInput = document.getElementById("rep-nombre");
    const precioInput = document.getElementById("rep-precio");

    if (!modeloInput || !nombreInput || !precioInput) return;

    if (!modeloInput.value.trim() || !nombreInput.value.trim() || !precioInput.value.trim()) {
        alert("Por favor completa todos los campos del repuesto.");
        return;
    }

    const precio = Number(precioInput.value);
    if (isNaN(precio) || precio < 0) {
        alert("El precio debe ser un número válido.");
        return;
    }

    const datos = {
        name: nombreInput.value.trim(),
        brand: modeloInput.value.trim(),
        price: precio
    };

    fetch("http://localhost:3000/repuestos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(res => {
        alert(res.ms || "Repuesto guardado con éxito");
        nombreInput.value = "";
        modeloInput.value = "";
        precioInput.value = "";
        cargarSelectRepuestos();
    })
    .catch(err => {
        console.error("Error al guardar repuesto:", err);
        alert("Error al guardar el repuesto.");
    });
}

// ========== CALCULAR REPARACIÓN ==========
function calcularReparacion() {
    const selectMecanico = document.getElementById("rep-mecanico");
    const tiempoInput = document.getElementById("rep-tiempo");

    const checkboxes = document.querySelectorAll(".chk-repuesto:checked");
    const repuestosIndexes = Array.from(checkboxes).map(chk => Number(chk.value));

    if (!selectMecanico || selectMecanico.value === "" || !tiempoInput || !tiempoInput.value.trim()) {
        alert("Por favor selecciona un mecánico y especifica el tiempo en horas.");
        return;
    }

    const tiempo = Number(tiempoInput.value);
    if (isNaN(tiempo) || tiempo <= 0) {
        alert("El tiempo debe ser un número mayor a 0.");
        return;
    }

    const datos = {
        mecanicoIndex: Number(selectMecanico.value),
        repuestosIndexes: repuestosIndexes,
        tiempo: tiempo
    };

    fetch("http://localhost:3000/reparacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(res => {
        const calculo = res.data || res;
        const resultadoDiv = document.getElementById("resultado");

        if (resultadoDiv) {
            resultadoDiv.innerHTML = ""; // limpiamos de forma segura

            const p1 = document.createElement("p");
            p1.innerHTML = `<strong>Mecánico:</strong> ${escapeHtml(calculo.mecanico?.name || "Desconocido")}`;

            const p2 = document.createElement("p");
            p2.innerHTML = `<strong>Piezas seleccionadas:</strong> ${repuestosIndexes.length}`;

            const p3 = document.createElement("p");
            p3.innerHTML = `<strong>Tiempo:</strong> ${escapeHtml(calculo.tiempo_reparacion)} horas`;

            const p4 = document.createElement("p");
            p4.innerHTML = `<strong>Costo repuestos:</strong> $${escapeHtml(calculo.costo_repuestos)}`;

            const p5 = document.createElement("p");
            p5.style.cssText = "font-size: 1.1rem; margin-top: 5px; color: #1e3a8a;";
            p5.innerHTML = `<strong>Total:</strong> $${escapeHtml(calculo.res)}`;

            resultadoDiv.append(p1, p2, p3, p4, p5);
        }

        cargarHistorial();
    })
    .catch(err => {
        console.error("Error al calcular reparación:", err);
        alert("Error al calcular la reparación.");
    });
}

// ========== FUNCIONES PARA MOSTRAR LISTAS ==========
function mostrarMecanicos(lista) {
    const ul = document.getElementById("lista-mecanicos");
    if (!ul) return;

    ul.innerHTML = "";
    (lista || []).forEach((m, i) => {
        const li = document.createElement("li");
        li.textContent = `[${i}] ${m.name} - Nivel: ${m.level} - $${m.price_hour}/hora`;
        ul.appendChild(li);
    });
}

function mostrarRepuestos(lista) {
    const ul = document.getElementById("lista-repuestos");
    if (!ul) return;

    ul.innerHTML = "";
    (lista || []).forEach(r => {
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

// ========== CONSULTA AL ASISTENTE DE IA ==========
async function consultarIA() {
    const input = document.getElementById("ai-prompt-input");
    const chatBox = document.getElementById("ai-chat-box");
    const btn = document.getElementById("ai-send-btn");

    if (!input || !chatBox || !btn) return;

    const mensaje = input.value.trim();
    if (!mensaje) return;

    // 1. Mensaje del usuario (seguro)
    const userDiv = document.createElement("div");
    userDiv.style.cssText = "text-align: right; margin-bottom: 10px;";
    const userSpan = document.createElement("span");
    userSpan.style.cssText = "background: #2563eb; color: #ffffff; padding: 8px 14px; border-radius: 12px 12px 0 12px; display: inline-block; font-size: 0.95rem;";
    userSpan.textContent = mensaje;
    userDiv.appendChild(userSpan);
    chatBox.appendChild(userDiv);

    input.value = "";
    btn.disabled = true;

    // 2. Indicador de carga
    const loaderId = "loading-" + Date.now();
    const loaderDiv = document.createElement("div");
    loaderDiv.id = loaderId;
    loaderDiv.style.cssText = "text-align: left; margin-bottom: 10px;";
    const loaderSpan = document.createElement("span");
    loaderSpan.style.cssText = "background: #e2e8f0; color: #475569; padding: 8px 14px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 0.95rem;";
    loaderSpan.innerHTML = "<i>Consultando asistente...</i>";
    loaderDiv.appendChild(loaderSpan);
    chatBox.appendChild(loaderDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("http://localhost:3000/api/openai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: mensaje })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        document.getElementById(loaderId)?.remove();

        const botDiv = document.createElement("div");
        botDiv.style.cssText = "text-align: left; margin-bottom: 10px;";

        if (data.respuesta) {
            const botContent = document.createElement("div");
            botContent.style.cssText = "background: #ffffff; border: 1px solid #cbd5e1; color: #0f172a; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 0.95rem; max-width: 85%;";

            const strong = document.createElement("strong");
            strong.textContent = "🤖 Asistente:";
            botContent.appendChild(strong);
            botContent.appendChild(document.createElement("br"));

            // Escapamos y convertimos saltos de línea de forma segura
            const respuestaSegura = escapeHtml(data.respuesta).replace(/\n/g, "<br>");
            const temp = document.createElement("div");
            temp.innerHTML = respuestaSegura;
            while (temp.firstChild) {
                botContent.appendChild(temp.firstChild);
            }

            botDiv.appendChild(botContent);
        } else {
            botDiv.style.color = "#dc2626";
            botDiv.innerHTML = `<strong>Error:</strong> ${escapeHtml(data.error || "Respuesta no disponible.")}`;
        }

        chatBox.appendChild(botDiv);

    } catch (error) {
        document.getElementById(loaderId)?.remove();
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = "text-align: left; margin-bottom: 10px; color: #dc2626;";
        errorDiv.innerHTML = "<strong>Error:</strong> No se pudo conectar con el servidor.";
        chatBox.appendChild(errorDiv);
        console.error(error);
    } finally {
        btn.disabled = false;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}