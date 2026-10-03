const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "El prompt es obligatorio" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente técnico experto en diagnóstico de motocicletas, repuestos y costos de reparación."
        },
        {
          role: "user",
          content: prompt.trim()
        }
      ],
      temperature: 0.7,
    });

    res.json({
      respuesta: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Error en OpenAI:", error);
    res.status(500).json({
      error: "Error al comunicarse con la API de OpenAI"
    });
  }
});

module.exports = router;