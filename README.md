# Spectualize

> Esperienze online e dal vivo · Un unico partner per far crescere il tuo brand, online e dal vivo

Sito di **[spectualize.com](https://spectualize.com)**.

---

## IT

Portale di Spectualize: soglia d'ingresso, home, servizi, chi siamo e brief "Raccontaci il progetto", su un fondo WebGL animato.

### Pagine

| Indirizzo | File | Contenuto |
|---|---|---|
| `/` | `index.html` | soglia (prima visita) e home |
| `/servizi/` | `servizi/index.html` | le 4 aree, una alla volta: `#web-software`, `#advertising`, `#marketing-brand`, `#eventi` |
| `/chi-siamo/` | `chi-siamo/index.html` | chi siamo |

`#progetto` apre il brief su qualsiasi pagina. I vecchi indirizzi (`/#servizi/eventi`, `/#chi-siamo`) portano alle pagine nuove.

### Come si modifica

Le tre pagine sono generate da **un solo sorgente**: `src/site.html`. Non modificare a mano `index.html`, `servizi/index.html` o `chi-siamo/index.html`.

```bash
node build.mjs
```

`build.mjs` (Node, zero dipendenze) scrive per ogni pagina il suo head (title, description, canonical, Open Graph, JSON-LD) e le quattro aree dei servizi (dai dati `SVC` dello script). Le sezioni delle altre pagine restano nel file dentro un `<template>`: lo script le apre solo quando servono, così ogni pagina ha un solo H1 e i suoi testi.

Immagini di condivisione: `og-image.jpg` (home), `og-servizi.jpg`, `og-chi-siamo.jpg`. `sitemap.xml` elenca le tre pagine.

### Sviluppo locale

Serve la cartella con un server statico (servono gli indirizzi veri, non `file://`):

```bash
python3 -m http.server 8000
```

Poi apri `http://localhost:8000`, `/servizi/`, `/chi-siamo/`.

### Deploy

GitHub Pages dal branch `main`, cartella root. `_config.yml` esclude dal sito pubblicato `src/`, `build.mjs` e questo README.

---

## EN

Spectualize portal: three static pages (`/`, `/servizi/`, `/chi-siamo/`) generated from `src/site.html` by `node build.mjs` (no dependencies). Edit the source, then rebuild. Serve locally with `python3 -m http.server 8000`.

### License

© 2026 Spectualize. All rights reserved.
