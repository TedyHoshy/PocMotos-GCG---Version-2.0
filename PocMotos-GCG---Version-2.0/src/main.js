// 1. Imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

// 2. Datos
const mecanicos = require("./datos/data.json");
const repuestos = require("./datos/repuestos.json");

// 3. Rutas modularizadas
const reparacionRoutes = require("./routes/reparacion.routes");
const openaiRoutes = require("./routes/openai.routes");   // ← AGREGA ESTA LÍNEA

// 4. Crear la app (¡esto tiene que ir antes de usar app!)
const app = express();
const PORT = process.env.PORT || 3000;

// 5. OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 6. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// 7. Registrar el router de reparaciones
app.use(reparacionRoutes);

// 8. Ruta de OpenAI
app.use("/api/openai", openaiRoutes);

// 9. Rutas GET
app.get("/mecanicos", (req, res) => res.json(mecanicos));
app.get("/repuestos", (req, res) => res.json(repuestos));

// ========== AQUÍ van los POST (después de crear app) ==========
app.post("/mecanicos", (req, res) => {
    try {
        const { name, level, price_hour } = req.body;

        if (!name || !level || price_hour === undefined) {
            return res.status(400).json({ error: "Faltan datos del mecánico" });
        }

        const nuevoMecanico = {
            name,
            level,
            price_hour: Number(price_hour)
        };

        mecanicos.push(nuevoMecanico);

        const filePath = path.join(__dirname, "datos", "data.json");
        fs.writeFileSync(filePath, JSON.stringify(mecanicos, null, 2));

        res.json({ ms: "Mecánico guardado con éxito", data: nuevoMecanico });
    } catch (error) {
        console.error("Error al guardar mecánico:", error);
        res.status(500).json({ error: "Error interno al guardar el mecánico" });
    }
});

app.post("/repuestos", (req, res) => {
    try {
        const { name, brand, price } = req.body;

        if (!name || !brand || price === undefined) {
            return res.status(400).json({ error: "Faltan datos del repuesto" });
        }

        const nuevoRepuesto = {
            name,
            brand,
            price: Number(price)
        };

        repuestos.push(nuevoRepuesto);

        const filePath = path.join(__dirname, "datos", "repuestos.json");
        fs.writeFileSync(filePath, JSON.stringify(repuestos, null, 2));

        res.json({ ms: "Repuesto guardado con éxito", data: nuevoRepuesto });
    } catch (error) {
        console.error("Error al guardar repuesto:", error);
        res.status(500).json({ error: "Error interno al guardar el repuesto" });
    }
});

// 10. Escuchar
app.listen(PORT, () => {
    console.log("Estamos en línea en el puerto: http://localhost:" + PORT);
});

module.exports = app;