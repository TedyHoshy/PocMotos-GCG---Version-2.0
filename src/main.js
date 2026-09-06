// instalaciones
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const z = require("zod")
const path = require("path")
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

app.get("/calculofinal/:mecanico", (req, res) => {
    mecanico = parseInt( req.params.mecanico )
    calculorepuestos = calculoRepuestos(repuestos);
    vhm = mecanicos[mecanico]["price_hour"]
    final = tarifaTotal(vhm, 2.5, calculorepuestos)
    res.json({
        "ms": "Resultado del calculo",
        "mecanico": mecanicos[mecanico],
        "res": final
    })
})

app.post("/reparacion", (req, res) => {
    const { mecanicoIndex, tiempo } = req.body;   // Ejemplo: { "mecanicoIndex": 1, "tiempo": 2.5 }

    const vhm = mecanicos[mecanicoIndex].price_hour;   // VHM
    const cr  = calculoRepuestos(repuestos);           // CR
    const total = tarifaTotal(vhm, tiempo, cr);        // (VHM × TR) + CR

    res.json({
        ms: "Resultado del calculo",
        mecanico: mecanicos[mecanicoIndex],
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
