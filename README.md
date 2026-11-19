# btc-slovnik.cz

Zdrojový kód [Bitcoinového slovníku naučného](https://btc-slovnik.cz) — českého
výkladového slovníku pojmů Bitcoinové sítě.

## Jak přidat nebo upravit pojem

Každý pojem je jeden soubor v `content/cs/`. Název souboru je zároveň jeho
**trvalý odkaz** (`content/cs/utxo.md` → `https://btc-slovnik.cz/#utxo`), takže
existující soubory se nepřejmenovávají — odkazy na ně už mohou kolovat po internetu.

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
npm run verify    # ověří slovník i osm anatomií proti původní verzi
```

`npm run verify` porovnává 48 hesel a osm anatomií s původní HTML verzí
v commitu `e1274345c1f4bf3ac30c1374c65780530de44281`. Kontroluje obsah,
kotvy, odkazy, strukturu a obrazové zdroje včetně převodu diagramů na inline SVG.
Hesla upravená při redakci a fact-checku jsou výslovně uvedena v sadě `revised`
v `tools/verify-migration.mjs`; u jejich těl se ověřuje shoda s aktuálním
zdrojem, zatímco kotvy, pořadí a odkazy pod hesly se dál kontrolují proti
původní verzi. Ostatní hesla se s původní verzí porovnávají i obsahově. Kontrola běží také v CI a vyžaduje dostupnou git historii. Jiný základ lze zadat
pomocí `npm run verify -- --ref <revize>`.

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
js/theme.js          ikonová volba systém / světlý / tmavý
js/diagram.js        celoobrazovkový prohlížeč diagramů
functions.js         živý kurz a moskevský čas (CoinGecko)
drop.js              rozbalovací menu a LNURL
pages/*.njk          anatomie se společnou šablonou a původními .html URL
tools/               migrační a kontrolní skripty
```

Stránky v `pages/` se generují přes `_includes/layouts/anatomy.njk` a sdílejí
navigaci, vzhled a patičku se slovníkem. Původní `.html` URL zůstávají zachované.
Diagramy se při sestavení vkládají jako SVG s barvami navázanými na aktivní motiv;
kliknutí otevře zvětšený diagram. Barevně kódované hexdumpy zachovávají své legendy.

## Vzhled Folio

Světlá papírová a tmavá grafitová paleta jsou definované v `css/styles.css`.
Volba motivu se ukládá do `localStorage`; systémový režim sleduje nastavení OS.
Preference se aplikuje v hlavičce před vykreslením stránky. Typografie používá
systémové serifové a bezserifové náhrady; vlastní fontové soubory zatím nejsou součástí repozitáře.

Kurz u satoshi a sedmisegmentový moskevský čas získávají data jedním požadavkem
na CoinGecko. Při nedostupnosti API se údaje nezobrazí. Prototypy v
`design-proposals/` jsou lokální, ignorované Gitem a nejsou součástí sestavení.

## Nasazení

Push do větve `html` spustí GitHub Actions
([.github/workflows/pages.yml](.github/workflows/pages.yml)), který web sestaví
a publikuje na GitHub Pages. V nastavení repozitáře musí být zdroj Pages
přepnutý na **GitHub Actions**.

## Licence

Obsah i kód jsou [CC0 1.0](LICENSE.txt) — volné dílo.
