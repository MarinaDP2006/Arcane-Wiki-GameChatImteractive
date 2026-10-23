// Dirección del servidor de roleplay alojado (server/roleplay-server.js en Render).
// Lo usan la web, la app de escritorio y Android para hablar con Ollama Cloud sin instalar nada.
// Si cambias el nombre del servicio en Render, cambia también esta dirección.
window.ROLEPLAY_CONFIG = {
  endpoint: 'https://rifts-gears-arcane.onrender.com/api/roleplay',
  model: 'gemma4:31b',
};
