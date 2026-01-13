const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const express = require("express");
const app = express();

const manifest = {
    id: "org.faststream.es.2026",
    version: "1.0.0",
    name: "FastStream Castellano",
    description: "Búsqueda automática en castellano para FastStream",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    // Generamos la URL que pasará por nuestro servidor
    const proxyUrl = `https://${process.env.KOYEB_APP_NAME}.koyeb.app/proxy/720p/${args.id}`;
    
    return Promise.resolve({
        streams: [{
            title: "🇪🇸 Castellano - 720p (FastStream)",
            url: proxyUrl
        }]
    });
});

// --- SOLUCIÓN AL ERROR ---
// Usamos getRouter para obtener el middleware compatible con Express
const addonRouter = getRouter(builder.getInterface());
app.use("/", addonRouter);

// Ruta adicional para asegurar que Koyeb siempre vea el servidor vivo
app.get("/health", (req, res) => res.send("OK"));

// Escuchar en el puerto 8000 (estándar de Koyeb)
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Addon activo y funcionando en el puerto ${port}`);
});
