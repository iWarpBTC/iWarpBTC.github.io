---
id: invoice
term: lightning invoice
short: null
order: 24
topic: lightning
entryClass: entryln
links:
  - text: úvod do Lightning network
    href: /pages/lightning.html
---

<p>
  Datová struktura obsahující instrukce k provedení
  <a href="#ln">lightning</a> platby. Typicky
  obsahuje platební hash, částku, hlavní veřejný klíč přijímajícího
  uzlu, čas vystavení, čas expirace, popisek a další údaje. Bývá
  zakódovaná &ndash; podobně jako onchain adresa &ndash; v bech32 s
  prefixem lnbc a lidsky čitelnou částkou.
</p>
