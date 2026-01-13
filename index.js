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

// 1. Definir el Stream
builder.defineStreamHandler((args) => {
    // IMPORTANTE: Esta URL debe ser accesible desde internet
    const proxyUrl = `https://${process.env.KOYEB_APP_NAME}.koyeb.app/video/${args.id}.mp4`;
    
    return Promise.resolve({
        streams: [{
            title: "🇪🇸 Castellano - 720p (FastStream)",
            url: proxyUrl
        }]
    });
});

const addonRouter = getRouter(builder.getInterface());
app.use("/", addonRouter);

// 2. Ruta para que la web no de 404
app.get("/", (req, res) => {
    res.send("<h1>Addon Online</h1><p>Usa /manifest.json en Stremio</p>");
});

// 3. Ruta del video (Aquí es donde debes poner el link real de FastStream)
app.get("/video/:id.mp4", (req, res) => {
    // Por ahora, redirigimos a un video de prueba para verificar que Stremio funciona
    const videoPrueba = "commondatastorage.googleapis.com";
    res.redirect(videoPrueba);
});

const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor en puerto ${port}`);
});
