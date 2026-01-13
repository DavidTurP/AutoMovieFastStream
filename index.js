const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const express = require("express");
const app = express();

const manifest = {
    id: "org.faststream.es.2026",
    version: "1.0.0",
    name: "FastStream Castellano",
    description: "Búsqueda automática en castellano",
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

// RESPUESTAS PARA EL NAVEGADOR Y KOYEB
app.get("/", (req, res) => res.send("<h1>Addon Activo</h1><p>Instala /manifest.json</p>"));
app.get("/health", (req, res) => res.status(200).send("OK"));

// CARGAR ADDON
const addonInterface = builder.getInterface();
app.use("/", getRouter(addonInterface));

app.get("/video/:id.mp4", (req, res) => {
    res.redirect("commondatastorage.googleapis.com");
});

// PUERTO OBLIGATORIO 8000 PARA KOYEB
const port = 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor activo en puerto ${port}`);
});
