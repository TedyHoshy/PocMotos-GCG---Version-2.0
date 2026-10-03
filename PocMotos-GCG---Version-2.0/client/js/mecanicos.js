function cargarSelectMecanicos() {
    api("http://localhost:3000/mecanicos")
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

    api("http://localhost:3000/mecanicos", {
        method: "POST",
        body: JSON.stringify(datos)
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
