// instalaciones
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const z = require("zod")
const path = require("path")
const fs = require("fs");
const { suma, calculoRepuestos, tarifaTotal } = require("./calculos")

// datos
const mecanicos = require("./datos/data.json")
const repuestos = require("./datos/repuestos.json")

// configs and middleware
const app = express()
PORT = process.env.PORT || 3000;

app.use(cors()); // linea de configuración a cors
app.use(express.json()); // linea de configuración de json

app.use(express.static(path.join(__dirname, "../client")));

const createUserSchema = z.object({ // linea de configuración del z
    name: z.string().min(1, 'name is required'),
});

// CODIGOS DE PRUEBAS
// RUTA - RES JSON - LOGICA
app.get("/jungle", (req, res) => {
    res.json({"ms": "Welcome to the jungle :D"})
})

// http://localhost:3000/pathid/1?anio=2026&info=hola%20a%20todos
app.get("/pathid/:id", (req, res) => {
    let id = req.params.id
    let { anio, info } = req.query
    res.json({
        "ms": "datos de ID y del query",
        "id": id,
        "anio": anio,
        "information": info
    })
})

app.post("/pathid", (req, res) => {
    let { name, age, phone, email } = req.body

    res.json({
        "ms": "datos de body",
        "name": name,
        "age": age,
        "phone": phone,
        "email": email
    })
})

// ========== MECÁNICO ==========
// ========== VER MECÁNICO ==========
app.get("/calculofinal/:mecanico", (req, res) => {
    const mecanicoIndex = parseInt(req.params.mecanico);
    const mecanicoEncontrado = mecanicos[mecanicoIndex];

    // Validar si el mecánico existe en el array
    if (!mecanicoEncontrado) {
        return res.status(404).json({ error: "El mecánico solicitado no existe" });
    }

    const calculorepuestos = calculoRepuestos(repuestos);
    const vhm = mecanicoEncontrado.price_hour;
    const final = tarifaTotal(vhm, 2.5, calculorepuestos);

    res.json({
        ms: "Resultado del calculo",
        mecanico: mecanicoEncontrado,
        res: final
    });
});

// ========== AGREGAR MECÁNICO ==========
app.post("/mecanicos", (req, res) => {
    const { name, level, price_hour } = req.body;

    if (!name || !level || !price_hour) {
        return res.status(400).json({ error: "Faltan datos del mecánico" });
    }

    const nuevoMecanico = {
        name,
        level,
        price_hour: Number(price_hour)
    };

    mecanicos.push(nuevoMecanico);

    const ruta = path.join(__dirname, "datos", "data.json");
    fs.writeFileSync(ruta, JSON.stringify(mecanicos, null, 4));

    res.json({
        ms: "Mecánico agregado correctamente",
        mecanico: nuevoMecanico,
        todos_los_mecanicos: mecanicos
    });
});

// ========== AGREGAR REPUESTO ==========
app.post("/repuestos", (req, res) => {
    const { name, brand, price } = req.body;

    if (!name || !brand || !price) {
        return res.status(400).json({ error: "Faltan datos del repuesto" });
    }

    const nuevoRepuesto = {
        name,
        brand,
        price: Number(price)
    };

    repuestos.push(nuevoRepuesto);

    const ruta = path.join(__dirname, "datos", "repuestos.json");
    fs.writeFileSync(ruta, JSON.stringify(repuestos, null, 4));

    res.json({
        ms: "Repuesto agregado correctamente",
        repuesto: nuevoRepuesto,
        todos_los_repuestos: repuestos
    });
});

// ========== CALCULAR REPARACIÓN ==========
app.post("/reparacion", (req, res) => {
    const { mecanicoIndex, tiempo } = req.body;

    // Validar que se enviaron los datos y que el mecánico existe
    if (mecanicoIndex == null || tiempo == null) {
        return res.status(400).json({ error: "Faltan los datos: mecanicoIndex o tiempo" });
    }

    const mecanicoEncontrado = mecanicos[mecanicoIndex];

    if (!mecanicoEncontrado) {
        return res.status(404).json({ error: "El índice de mecánico no existe" });
    }

    const vhm = mecanicoEncontrado.price_hour;
    const cr  = calculoRepuestos(repuestos);
    const total = tarifaTotal(vhm, tiempo, cr);

    res.json({
        ms: "Resultado del calculo",
        mecanico: mecanicoEncontrado,
        res: total,
        todos_los_mecanicos: mecanicos,
        todos_los_repuestos: repuestos,
        costo_repuestos: cr,
        tiempo_reparacion: tiempo
    });
});

app.listen(PORT, () => {
    console.log("Estamos en linea en el puerto: http://localhost:" + PORT);
})


module.exports = app;
