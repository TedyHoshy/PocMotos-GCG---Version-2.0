let todosLosRepuestos = [];

function cargarSelectRepuestos() {
    api("http://localhost:3000/repuestos")
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

    const repuestosFiltrados = todosLosRepuestos
        .map((r, index) => ({ ...r, originalIndex: index }))
        .filter(r => {
            const modeloRepuesto = (r.brand || r.modelo || "").toLowerCase();
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

    api("http://localhost:3000/repuestos", {
        method: "POST",
        body: JSON.stringify(datos)
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
