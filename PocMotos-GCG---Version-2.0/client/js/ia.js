async function consultarIA() {
    const input = document.getElementById("ai-prompt-input");
    const chatBox = document.getElementById("ai-chat-box");
    const btn = document.getElementById("ai-send-btn");

    if (!input || !chatBox || !btn) return;

    const mensaje = input.value.trim();
    if (!mensaje) return;

    // Mensaje del usuario
    const userDiv = document.createElement("div");
    userDiv.style.cssText = "text-align: right; margin-bottom: 10px;";
    const userSpan = document.createElement("span");
    userSpan.style.cssText = "background: #2563eb; color: #ffffff; padding: 8px 14px; border-radius: 12px 12px 0 12px; display: inline-block; font-size: 0.95rem;";
    userSpan.textContent = mensaje;
    userDiv.appendChild(userSpan);
    chatBox.appendChild(userDiv);

    input.value = "";
    btn.disabled = true;

    // Loader
    const loaderId = "loading-" + Date.now();
    const loaderDiv = document.createElement("div");
    loaderDiv.id = loaderId;
    loaderDiv.style.cssText = "text-align: left; margin-bottom: 10px;";
    const loaderSpan = document.createElement("span");
    loaderSpan.style.cssText = "background: #e2e8f0; color: #475569; padding: 8px 14px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 0.95rem;";
    loaderSpan.innerHTML = "<i>Consultando asistente...</i>";
    loaderDiv.appendChild(loaderSpan);
    chatBox.appendChild(loaderDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const data = await api("http://localhost:3000/api/openai/chat", {
            method: "POST",
            body: JSON.stringify({ prompt: mensaje })
        });

        document.getElementById(loaderId)?.remove();

        const botDiv = document.createElement("div");
        botDiv.style.cssText = "text-align: left; margin-bottom: 10px;";

        if (data.respuesta) {
            const botContent = document.createElement("div");
            botContent.style.cssText = "background: #ffffff; border: 1px solid #cbd5e1; color: #0f172a; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; font-size: 0.95rem; max-width: 85%;";

            const strong = document.createElement("strong");
            strong.textContent = "🤖 Asistente:";
            botContent.appendChild(strong);
            botContent.appendChild(document.createElement("br"));

            const respuestaSegura = escapeHtml(data.respuesta).replace(/\n/g, "<br>");
            const temp = document.createElement("div");
            temp.innerHTML = respuestaSegura;
            while (temp.firstChild) {
                botContent.appendChild(temp.firstChild);
            }

            botDiv.appendChild(botContent);
        } else {
            botDiv.style.color = "#dc2626";
            botDiv.innerHTML = `<strong>Error:</strong> ${escapeHtml(data.error || "Respuesta no disponible.")}`;
        }

        chatBox.appendChild(botDiv);

    } catch (error) {
        document.getElementById(loaderId)?.remove();
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = "text-align: left; margin-bottom: 10px; color: #dc2626;";
        errorDiv.innerHTML = "<strong>Error:</strong> No se pudo conectar con el servidor.";
        chatBox.appendChild(errorDiv);
        console.error(error);
    } finally {
        btn.disabled = false;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
