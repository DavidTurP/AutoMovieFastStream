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
    const proxyUrl = `https://${process.env.KOYEB_APP_NAME}.koyeb.app/video/${args.id}.mp4`;
    return Promise.resolve({
        streams: [{ title: "🇪🇸 Castellano - 720p", url: proxyUrl }]
    });
});

// IMPORTANTE: Rutas de respuesta para Koyeb
app.get("/", (req, res) => res.send("Servidor Activo"));
app.get("/health", (req, res) => res.status(200).send("OK"));

// Cargar el addon
const addonRouter = getRouter(builder.getInterface());
app.use("/", addonRouter);

app.get("/video/:id.mp4", (req, res) => {
    res.redirect("commondatastorage.googleapis.com");
});

// Escuchar en el puerto 8000
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor en puerto ${port}`);
});
