const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const TMDB_API_KEY = process.env.TMDB_KEY;

const builder = new addonBuilder({
    id: "org.faststream.es.2026",
    name: "FastStream Castellano",
    version: "1.0.0",
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: []
});

builder.defineStreamHandler(async (args) => {
    try {
        // 1. Convertir ID a Título en Español
        const tmdbRes = await axios.get(`api.themoviedb.org{args.id}?api_key=${TMDB_API_KEY}&external_source=imdb_id&language=es-ES`);
        const movie = tmdbRes.data.movie_results[0] || tmdbRes.data.tv_results[0];
        if (!movie) return { streams: [] };

        const title = movie.title || movie.name;

        // 2. Buscar en la web (Simulación de búsqueda en FastStream)
        // Buscamos el término + castellano
        const searchUrl = `faststream.online{encodeURIComponent(title)}+castellano`;
        
        // Aquí el servidor enviaría el link encontrado. 
        // Por seguridad del DRM L3, enviamos el link al proxy del servidor.
        return {
            streams: [{
                title: `🇪🇸 ${title} - 720p Castellano`,
                url: `https://${process.env.KOYEB_APP_NAME}.koyeb.app/proxy/${args.id}`
            }]
        };
    } catch (e) {
        return { streams: [] };
    }
});

app.get("/proxy/:id", async (req, res) => {
    // Aquí es donde el servidor gestiona el descifrado L3
    // Por ahora, redirigimos al flujo (necesitarás la KEY del DRM)
    res.redirect("URL_FINAL_DESCIFRADA_AQUÍ");
});

app.use("/", builder.getInterface());
app.get("/health", (req, res) => res.send("OK"));
app.listen(process.env.PORT || 8000);
