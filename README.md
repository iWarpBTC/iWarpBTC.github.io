# btc-slovnik.cz

Zdrojový kód [Bitcoinového slovníku naučného](https://btc-slovnik.cz) — českého
výkladového slovníku pojmů Bitcoinové sítě.

## Jak přidat nebo upravit pojem

Každý pojem je jeden soubor v `content/cs/`. Název souboru je zároveň jeho
**trvalý odkaz** (`content/cs/utxo.md` → `https://btc-slovnik.cz/#utxo`), takže
existující soubory se nepřejmenovávají — odkazy na ně už kolují po internetu.

```markdown
---
id: utxo                 # kotva v URL; musí odpovídat názvu souboru
term: UTXO               # zobrazený název (může obsahovat HTML entity)
short: unspent transaction output   # volitelný anglický ekvivalent, jinak null
order: 29                # pořadí na stránce (kurátorované, ne abecední)
topic: transakce         # viz tools/lib/topics.mjs
entryClass: entry        # "entryln" u pojmů Lightning network
links:                   # volitelné odkazy „číst dál“ pod heslem
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>Text hesla. Píše se rovnou v HTML …</p>
```

Tělo hesla je **HTML**, ne Markdown. Je to záměr: hesla obsahují tabulky,
obrázky s popiskem a barevně kódované hexdumpy, které by převod do Markdownu
nepřežil. Markdown syntaxe funguje také, ale HTML se přenáší beze změny.

Odkazy mezi hesly se píší jako holá kotva — `<a href="#hash">` — ne jako celá
adresa. Kotva se vyhodnotí vůči stránce, na které se heslo právě zobrazuje, takže
budoucí anglická verze na `/en/` neodkáže čtenáře zpátky do české.

## Sestavení

```bash
npm install
npm run serve     # http://localhost:8080 s automatickým obnovením
npm run build     # vygeneruje _site/
npm run verify    # porovná _site/index.html s původní ručně psanou verzí
```

`npm run verify` je pojistka migrace: parsuje `git show html:index.html`
a vygenerovanou stránku a kontroluje kotvy, id, třídy, strukturu DOM, odkazy,
obrázky, HTML entity i text každého hesla. Pouští se i v CI.

## Struktura

```
content/cs/*.md      hesla slovníku (data, negenerují vlastní stránky)
_data/site.json      adresa, texty, sociální sítě, LNURL, seznam anatomií
_data/lastmod.js     data poslední změny pro sitemap, čtená z git historie
index.njk            stránka slovníku
sitemap.njk          generovaná sitemap.xml
_includes/layouts/   společná HTML kostra
css/styles.css       vzhled včetně tmavého režimu (token vrstva nahoře)
js/glossary.js       vyhledávání, rejstřík, kopírování odkazů
js/theme.js          přepínač světlý/tmavý režim
functions.js         živý kurz a moskevský čas (CoinGecko)
drop.js              rozbalovací menu a LNURL
pages/*.html         „anatomie“ — ručně psané stránky, publikují se beze změny
tools/               migrační a kontrolní skripty
```

Stránky v `pages/` se **negenerují** — kopírují se tak, jak jsou, včetně svých
absolutních odkazů a ručně laděných hexdumpů. Sdílejí ale `css/styles.css`, takže
změna vzhledu se jich týká; po úpravách stylů je dobré je projít.

## Nasazení

Push do větve `html` spustí GitHub Actions
([.github/workflows/pages.yml](.github/workflows/pages.yml)), který web sestaví
a publikuje na GitHub Pages. V nastavení repozitáře musí být zdroj Pages
přepnutý na **GitHub Actions**.

## Licence

Obsah i kód jsou [CC0 1.0](LICENSE.txt) — volné dílo.
