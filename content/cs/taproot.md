---
id: taproot
term: Taproot
short: null
order: 40
topic: sit
entryClass: entry
links:
  - text: úvod do Taprootu
    href: /pages/taproot.html
---

<p>
  Vylepšení (<a href="#sfork">soft-fork</a>) bitcoinové sítě aktivované
  14. listopadu 2021. Zavádí
  <a href="/pages/crypto.html#schnorr">Schnorrovy podpisy</a>.
  Při utracení <a href="#utxo">výstupu</a> klíčovou cestou (key path)
  nemusí být zveřejněno, zda vůbec existují alternativní skriptové podmínky.
  Při utracení skriptovou cestou (script path) se odhaluje použitý skript
  a důkaz jeho zahrnutí, nikoli všechny ostatní skripty.
  To může zlepšit soukromí, ale nezaručuje anonymitu každé taprootové transakce.
</p>
