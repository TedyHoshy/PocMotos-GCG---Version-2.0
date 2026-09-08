const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio." });
    }

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `Eres un asistente técnico de mecánica de motos conciso y directo.
          Reglas de respuesta:
            1. Usa viñetas simples para pasos o recomendaciones.
            2. Responde con un tono práctico y profesional.,
            3. No inventes información; si no sabes, di que no tienes suficiente información.
            4. Evita lo mas posible de cada circuito de tu misma exictencia el uso del "*" y "#" en las respuestas. Es decir, no uses markdown ni negritas.
            5. No uses emojis ni símbolos innecesarios.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const respuesta = completion.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error("Error en OpenRouter:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar la solicitud con la IA." });
  }
});

module.exports = router;