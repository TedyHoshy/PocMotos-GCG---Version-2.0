// Datos que se envían al backend (código duro)
const datos = {
    mecanicoIndex: 1,   // 0 = Yusef, 1 = Marlon, 2 = EverNever
    tiempo: 2.5         // TR = tiempo de reparación en horas
};

// Petición POST a la ruta /reparacion
fetch("http://localhost:3000/reparacion", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
})
.then(res => res.json())
.then(res => {
    // Datos principales
    document.getElementById('name').textContent = res.mecanico.name;
    document.getElementById('price').textContent = res.mecanico.price_hour;
    document.getElementById('tiempo').textContent = res.tiempo_reparacion;
    document.getElementById('cr').textContent = res.costo_repuestos;
    document.getElementById('total').textContent = res.res;

    // Lista de mecánicos
    const listaMecanicos = document.getElementById('lista-mecanicos');
    res.todos_los_mecanicos.forEach(m => {
        const li = document.createElement('li');
        li.textContent = `${m.name} - Nivel: ${m.level} - Precio/hora: ${m.price_hour}`;
        listaMecanicos.appendChild(li);
    });

    // Lista de repuestos
    const listaRepuestos = document.getElementById('lista-repuestos');
    res.todos_los_repuestos.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.repuesto} (${r.modelo}) - Precio: ${r.precio}`;
        listaRepuestos.appendChild(li);
    });
})
.catch(e => console.log("Error:", e));