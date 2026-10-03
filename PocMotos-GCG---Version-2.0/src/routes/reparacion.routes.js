const express = require("express");
const router = express.Router();
const z = require("zod");
const path = require("path");
const fs = require("fs");
const { calculoRepuestos, tarifaTotal } = require("../calculos");

// Cargar datos
const mecanicos = require("../datos/data.json");
const repuestos = require("../datos/repuestos.json");
const rutaHistorial = path.join(__dirname, "../datos/reparacion.json");

let historial = [];
if (fs.existsSync(rutaHistorial)) {
    try {
        historial = JSON.parse(fs.readFileSync(rutaHistorial, "utf-8"));
    } catch (e) {
        historial = [];
    }
}

// Esquema de validación Zod (ahora incluye los índices de repuestos)
const reparacionSchema = z.object({
    mecanicoIndex: z.number({ invalid_type_error: "El índice del mecánico debe ser un número" })
                    .int("El índice debe ser entero")
                    .nonnegative("El índice no puede ser negativo"),
    tiempo: z.number({ invalid_type_error: "El tiempo debe ser un número" })
             .positive("El tiempo de reparación debe ser mayor a 0"),
    repuestosIndexes: z.array(z.number().int().nonnegative()).optional().default([])
});

const guardarHistorial = (data) => {
    try {
        fs.writeFileSync(rutaHistorial, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error("Error al guardar en reparacion.json:", error);
    }
};

// GET /historial
router.get("/historial", (req, res) => {
    res.json(historial);
});

// POST /reparacion
router.post("/reparacion", (req, res) => {
    try {
        const validacion = reparacionSchema.safeParse(req.body);

        if (!validacion.success) {
            return res.status(400).json({ 
                error: "Datos de entrada inválidos", 
                detalles: validacion.error.format() 
            });
        }

        const { mecanicoIndex, tiempo, repuestosIndexes } = validacion.data;
        const mecanicoEncontrado = mecanicos[mecanicoIndex];

        if (!mecanicoEncontrado) {
            return res.status(404).json({ error: "El índice de mecánico no existe" });
        }

        // Filtrar solo los repuestos seleccionados
        const repuestosSeleccionados = repuestosIndexes
            .map(i => repuestos[i])
            .filter(Boolean); // elimina índices inválidos

        const vhm = Number(mecanicoEncontrado.price_hour);
        const cr = calculoRepuestos(repuestosSeleccionados); // ← ahora solo los seleccionados
        const total = tarifaTotal(vhm, tiempo, cr);

        const calculo = {
            id: Date.now(),
            mecanico: mecanicoEncontrado,
            tiempo_reparacion: tiempo,
            costo_repuestos: cr,
            repuestos_usados: repuestosSeleccionados, // opcional, para el historial
            res: total,
            fecha: new Date().toISOString()
        };

        historial.push(calculo);
        guardarHistorial(historial);

        return res.status(201).json({
            ms: "Cálculo realizado y guardado exitosamente",
            data: calculo
        });

    } catch (error) {
        console.error("Error en POST /reparacion:", error);
        return res.status(500).json({ error: "Error interno del servidor al procesar la reparación" });
    }
});

module.exports = router;