---
id: hd-wallet
term: HD peněženka
short: hierarchical deterministic
order: 15
topic: penezenky
entryClass: entry
links:
  - text: anatomie HD peněženky
    href: /pages/wallet.html
---

<p>
  Hierarchická deterministická <a href="#wallet">peněženka</a>, která ze
  <a href="#seed">seedu</a> odvozuje strom klíčů a odpovídajících
  <a href="#address">adres</a>. Stejný seed při stejných pravidlech a cestách
  odvozování vytvoří stejné klíče. Peněženka může ukládat také odvozené klíče,
  rozšířené klíče, deskriptory a další metadata, nikoli pouze seed.
  Sledovací (watch-only) varianta může z rozšířeného veřejného klíče odvozovat
  veřejné klíče a adresy příslušné nehardenované větve bez znalosti
  <a href="#privkey">soukromých klíčů</a>.
</p>
