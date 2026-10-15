// Genera le tre pagine del sito da un solo sorgente: node build.mjs
// src/site.html  ->  index.html, servizi/index.html, chi-siamo/index.html
// Ogni pagina ha il suo head (title, description, canonical, Open Graph, JSON-LD) e apre direttamente la sua sezione.
// Le sezioni delle altre pagine restano nel file chiuse in un <template>: lo script le apre solo quando servono.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://spectualize.com';
const src = readFileSync(new URL('./src/site.html', import.meta.url), 'utf8');

// le aree dei servizi stanno una volta sola, nell'array SVC dello script
const svcSrc = src.match(/const SVC = (\[[\s\S]*?\n  \]);/);
if (!svcSrc) throw new Error('SVC non trovato in src/site.html');
const SVC = new Function('return ' + svcSrc[1])();

const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = t => String(t).replace(/&/g, '&amp;');

const ORG = {
  '@type': 'Organization',
  '@id': SITE + '/#org',
  name: 'Spectualize',
  url: SITE,
  logo: SITE + '/logo.png',
  slogan: 'Esperienze online e dal vivo',
  description: 'Un unico partner per far crescere il tuo brand, online e dal vivo: siti ed esperienze digitali, advertising, marketing ed eventi. Un solo team, in Italia.',
  areaServed: { '@type': 'Country', name: 'Italia' },
  address: { '@type': 'PostalAddress', addressCountry: 'IT' },
  knowsAbout: ['Siti web', 'E-commerce', 'Software', 'Advertising', 'Marketing', 'Brand', 'Eventi aziendali']
};
const crumbs = (name, path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name, item: SITE + path }
  ]
});

const PAGES = [
  {
    out: 'index.html', own: 'home', path: '/',
    title: 'Spectualize · Siti, advertising, marketing ed eventi',
    desc: 'Un unico partner per far crescere il tuo brand, online e dal vivo: siti ed esperienze digitali, advertising, marketing ed eventi. Un solo team, in Italia.',
    ogDesc: 'Un unico partner per far crescere il tuo brand, online e dal vivo.',
    image: '/og-image.jpg?v=4',
    ld: { '@context': 'https://schema.org', ...ORG },
    // i vecchi indirizzi con # portano alle pagine nuove
    early: `<script>(function(h){var m=h.match(/^#servizi(?:\\/([\\w-]+))?$/);if(m)location.replace('/servizi/'+(m[1]?'#'+m[1]:''));else if(h==='#chi-siamo')location.replace('/chi-siamo/');})(location.hash)</script>`
  },
  {
    out: 'servizi/index.html', own: 'svc', path: '/servizi/',
    title: 'Servizi: siti, advertising, marketing, eventi · Spectualize',
    desc: "Quattro aree, un solo team: siti ed e-commerce, campagne Google e Meta, marketing e SEO, eventi aziendali. Dall'idea ai risultati, in tutta Italia.",
    image: '/og-servizi.jpg',
    ld: { '@context': 'https://schema.org', '@graph': [
      ORG,
      crumbs('Servizi', '/servizi/'),
      { '@type': 'ItemList', name: 'Servizi Spectualize', itemListElement: SVC.map((s, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Service', name: s.name, description: s.seoDesc, provider: { '@id': SITE + '/#org' }, areaServed: { '@type': 'Country', name: 'Italia' }, url: SITE + '/servizi/#' + s.slug }
      })) }
    ] }
  },
  {
    out: 'chi-siamo/index.html', own: 'about', path: '/chi-siamo/',
    title: 'Chi siamo: un solo team, online e dal vivo · Spectualize',
    desc: "Un solo team per siti, advertising, marketing ed eventi. Il nome unisce spectacle, visualize e actualize: rendere visibile un'idea e metterla in scena.",
    image: '/og-chi-siamo.jpg',
    ld: { '@context': 'https://schema.org', '@graph': [
      ORG,
      { '@type': 'AboutPage', name: 'Chi siamo', url: SITE + '/chi-siamo/', about: { '@id': SITE + '/#org' } },
      crumbs('Chi siamo', '/chi-siamo/')
    ] }
  }
];

function head(p){
  const url = SITE + p.path, img = SITE + p.image, ogDesc = p.ogDesc || p.desc;
  return [
    p.early,
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.desc)}">`,
    `<meta name="theme-color" content="#F1EAE0">`,
    `<meta name="robots" content="index, follow">`,
    `<meta name="author" content="Spectualize">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Spectualize">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(ogDesc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="it_IT">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(p.title)}">`,
    `<meta name="twitter:description" content="${esc(ogDesc)}">`,
    `<meta name="twitter:image" content="${img}">`
  ].filter(Boolean).join('\n');
}

const ld = p => `<script type="application/ld+json">\n${JSON.stringify(p.ld, null, 2)}\n</script>`;

// le quattro aree, scritte nella pagina: una visibile alla volta
const svcHtml = SVC.map((s, i) => `    <article class="svc-main reveal" data-slug="${s.slug}"${i ? ' hidden' : ''}>
      <div class="svc-lead" style="--i:0">
        <p class="svc-kicker mono"><i></i><b>${s.n}</b><span>${text(s.name)}</span></p>
        <h2 class="claim svc-title">${s.title}</h2>
        <p class="sub">${text(s.sub)}</p>
        <a class="btn js-brief-area" href="#progetto"><span class="dot"></span><span>${text(s.cta)}</span></a>
      </div>
      <div class="svc-list" style="--i:1">
        <h3>Cosa facciamo</h3>
        <ol>${s.items.map((t, k) => `<li><span>0${k + 1}</span>${text(t)}</li>`).join('')}</ol>
      </div>
    </article>`).join('\n');


// teaser del Lab, uguale in Home e in Chi siamo (cambiano solo titolo e frase)
const LAB_TEASER = {
  home: { kick: 'Dal Lab', title: 'Idee da provare prima di metterle <span class="hl">in scena</span>.', sub: 'Esperimenti dal vivo: provali e immagina cosa potrebbero fare per il tuo brand.' },
  about: { kick: 'Lab', title: 'Il nostro metodo comincia <span class="hl">nel Lab</span>.', sub: 'Prima di proporre un\'idea la proviamo. Ecco tre esperimenti da toccare con mano.' }
};
const labTeaser = (k, rv) => {
  const t = LAB_TEASER[k];
  const card = (href, c, n, area, name, pv, dark) => `<a class="lt-card" href="/lab/#/${href}" style="--c:var(${c})"><span class="lt-pv${dark ? ' dark' : ''}" aria-hidden="true">${pv}</span><span class="lt-meta"><span class="mono"><i></i>${n} · ${area}</span><b>${name}<span aria-hidden="true">→</span></b></span></a>`;
  const spk = `<svg class="lt-spk" viewBox="0 0 200 250"><defs><linearGradient id="ltGl${k}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect class="body" x="40" y="14" width="120" height="206" rx="28"/><rect x="40" y="14" width="120" height="206" rx="28" fill="url(#ltGl${k})"/><circle class="ring" cx="100" cy="66" r="21" fill="#1A1210" stroke-width="4"/><circle cx="100" cy="66" r="8" fill="#5B4F49"/><circle class="ring" cx="100" cy="148" r="47" fill="#1A1210" stroke-width="5"/><circle cx="100" cy="148" r="17" fill="#6B5F58"/><circle cx="100" cy="207" r="3" fill="#FF3D6E"/><ellipse cx="100" cy="240" rx="60" ry="7" fill="#1A1210" opacity=".12"/></svg>`;
  const bn = `<span class="lt-bn"><small>Nuova collezione</small><strong>Scoprila con <em>un gesto.</em></strong></span>`;
  const pass = `<span class="lt-pass"><small>Invito di esempio</small><strong><span>OSPITE</span>Il tuo nome</strong><footer><span>PASS N° 1883</span><i></i></footer></span>`;
  return `    <section class="lab-teaser" aria-label="Dal Lab">
      <div class="lt-head">
        <div><p class="lt-kick mono${rv ? ' rv' : ''}"><i></i>${t.kick}</p><h2 class="lt-title${rv ? ' rv' : ''}" style="--d:1">${t.title}</h2><p class="lt-sub${rv ? ' rv' : ''}" style="--d:2">${t.sub}</p></div>
        <a class="ab-more lt-more" href="/lab/">Entra nel Lab <span aria-hidden="true">→</span></a>
      </div>
      <div class="lt-cards${rv ? ' rv' : ''}" style="--d:3">
        ${card('configuratore', '--orange', '01', 'Web &amp; Software', 'Configuratore di prodotto', spk)}
        ${card('banner-interattivo', '--coral', '03', 'Advertising', 'Banner interattivo', bn)}
        ${card('invito-su-misura', '--pink', '06', 'Eventi', 'Invito su misura', pass, true)}
      </div>
    </section>`;
};

const VIEW_ID = { home: 'home', svc: 'svc', about: 'about' };

for (const p of PAGES) {
  let html = src
    .replace('<!--HEAD-->', head(p))
    .replace('<!--LD-->', ld(p))
    .replace('    <!--SVC-->', svcHtml)
    .replace('    <!--LABTEASER:home-->', labTeaser('home', false))
    .replace('    <!--LABTEASER:about-->', labTeaser('about', true))
    .replace('<!doctype html>', '<!doctype html>\n<!-- Generato da build.mjs a partire da src/site.html: modificare il sorgente, non questo file -->');
  for (const [name, id] of Object.entries(VIEW_ID)) {
    if (name === p.own) continue;
    const re = new RegExp(`(<section class="view [^"]*" id="${id}"[^>]*>)([\\s\\S]*?)(\\n  </section>)`);
    if (!re.test(html)) throw new Error('sezione non trovata: ' + id);
    html = html.replace(re, (m, open, body, close) => `${open}<template class="lazy">${body}</template>${close}`);
  }
  if (/<!--(HEAD|LD|SVC|LABTEASER:\w+)-->/.test(html)) throw new Error('segnaposto rimasto in ' + p.out);
  const h1 = (html.replace(/<template[\s\S]*?<\/template>/g, '').match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) throw new Error(`${p.out}: ${h1} h1 fuori dai template`);
  if (p.out.includes('/')) mkdirSync(new URL('./' + p.out.split('/')[0], import.meta.url), { recursive: true });
  writeFileSync(new URL('./' + p.out, import.meta.url), html);
  console.log('scritto', p.out, (html.length / 1024).toFixed(0) + ' KB');
}
