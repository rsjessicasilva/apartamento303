const CACHE = "apto303-v2";

const arquivos = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];

self.addEventListener("install", e=>{

    e.waitUntil(

        caches.open(CACHE)

        .then(cache=>cache.addAll(arquivos))

    );

});

self.addEventListener("activate", e=>{

    e.waitUntil(

        caches.keys()

        .then(keys=>{

            return Promise.all(

                keys.map(key=>{

                    if(key!==CACHE){

                        return caches.delete(key);

                    }

                })

            );

        })

    );

});

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // Não intercepta chamadas para APIs externas
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(

        caches.match(event.request).then(response => {

            return response || fetch(event.request);

        })

    );

});
