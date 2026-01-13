const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const app = express();

const manifest = {
    id: "org.faststream.es.2026",
    version: "1.0.0", // Debe ser exactamente X.Y.Z
    name: "FastStream Castellano",
    description: "Búsqueda automática en castellano para FastStream",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    // URL temporal para pruebas
    const proxyUrl = `https://${process.env.KOYEB_APP_NAME}.koyeb.app/proxy/720p/${args.id}`;
    return Promise.resolve({
        streams: [{
            title: "🇪🇸 Castellano - 720p",
            url: proxyUrl
        }]
    });
});

const addonInterface = builder.getInterface();

// Ruta de salud para que Koyeb no mate la instancia
app.get("/", (req, res) => res.redirect("/manifest.json"));
app.use("/", (req, res, next) => {
    addonInterface(req, res, next);
});

// Koyeb usa el puerto 8000
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Addon activo en puerto ${port}`);
});
