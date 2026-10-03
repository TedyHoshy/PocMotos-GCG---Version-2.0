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

    api("http://localhost:3000/reparacion", {
        method: "POST",
        body: JSON.stringify(datos)
    })
    .then(res => {
        const calculo = res.data || res;
        const resultadoDiv = document.getElementById("resultado");

        if (resultadoDiv) {
            resultadoDiv.innerHTML = "";

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

        if (typeof cargarHistorial === "function") {
            cargarHistorial();
        }
    })
    .catch(err => {
        console.error("Error al calcular reparación:", err);
        alert("Error al calcular la reparación.");
    });
}
