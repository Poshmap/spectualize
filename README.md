# Spectualize

> Immersive digital experiences · Esperienze digitali immersive

Splash placeholder for **[spectualize.com](https://spectualize.com)** — a single self-contained HTML page with a WebGL fluid shader, cursor tracking, and click interactions.

---

## IT

Prima release del sito Spectualize: una splash page immersiva pensata come segnaposto sul dominio in attesa del portfolio completo.

### Cosa fa

- Shader WebGL fullscreen con inchiostri fluidi nella palette brand (arancio → magenta → pink)
- Cursor blob che segue il puntatore su desktop
- Onde interattive al click / tap
- Bilingua IT/EN con auto-detect da browser (`?lang=en` per forzare)
- SEO/GEO baseline: Open Graph, Twitter Card, JSON-LD Organization, `hreflang`
- `prefers-reduced-motion` rispettato

### Stack

Zero dipendenze, zero build. Un solo file HTML con CSS e WebGL inline, più il logo. Si serve da qualsiasi CDN o static host.

### Sviluppo locale

Serve la cartella con qualsiasi server statico. Esempi:

```bash
# Python 3
python3 -m http.server 8000

# Node (se hai npx)
npx serve .

# PHP
php -S localhost:8000
```

Poi apri `http://localhost:8000`.

> **Non aprire `index.html` con doppio click** dal filesystem: le Google Fonts e alcuni handler potrebbero non caricare correttamente sotto il protocollo `file://`.

### Deploy

Static host qualsiasi. Consigliati (in ordine di velocità in Europa):

1. **Cloudflare Pages** — collega il repo, build command vuoto, output directory `/`
2. **Netlify** — drag & drop della cartella, o repo connect
3. **Vercel** — repo connect, framework: "Other"
4. **GitHub Pages** — Settings → Pages → Source: main branch, root

### Struttura

```
.
├── index.html      # pagina completa (HTML + CSS + WebGL inline)
├── logo.png        # brand mark (RGBA, sfondo trasparente)
├── robots.txt      # regole crawler
├── sitemap.xml     # per Google Search Console
└── README.md
```

### To-do prossimo step

- [ ] `og-image.png` (1200×630) per social preview
- [ ] Google Search Console: aggiungere proprietà + inviare sitemap
- [ ] Registrare account social (LinkedIn, Instagram, X) con handle Spectualize
- [ ] Portfolio vero: esplodere la one-page in sotto-URL SEO-friendly

---

## EN

First release of the Spectualize site: an immersive splash page acting as a placeholder on the domain until the full portfolio ships.

### What it does

- Fullscreen WebGL shader with fluid inks in the brand palette (orange → magenta → pink)
- Cursor blob follower on desktop
- Interactive ripples on click / tap
- IT/EN toggle with browser auto-detect (`?lang=en` to force)
- SEO/GEO baseline: Open Graph, Twitter Card, JSON-LD Organization, `hreflang`
- Honors `prefers-reduced-motion`

### Stack

No dependencies, no build. A single HTML file with inline CSS and WebGL, plus the logo. Serves from any CDN or static host.

### Local development

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

### License

© 2026 Spectualize. All rights reserved.
