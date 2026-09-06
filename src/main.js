// instalaciones
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");

// datos
const mecanicos = require("./datos/data.json");
const repuestos = require("./datos/repuestos.json");

// Importar rutas modularizadas
const reparacionRoutes = require("./routes/reparacion.routes");

// configs and middleware
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Registrar router de reparaciones
app.use(reparacionRoutes);

// ========== RUTAS BASE DE CONSULTA ==========
app.get("/mecanicos", (req, res) => res.json(mecanicos));
app.get("/repuestos", (req, res) => res.json(repuestos));

app.listen(PORT, () => {
    console.log("Estamos en línea en el puerto: http://localhost:" + PORT);
});

module.exports = app;