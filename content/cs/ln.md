---
id: ln
term: lightning network
short: null
order: 8
topic: lightning
entryClass: entryln
links:
  - text: úvod do Lightning network
    href: /pages/lightning.html
---

<p>
  Bitcoinová platební síť, označovaná jako druhá vrstva.
  Onchain transakcí se otevře platební kanál, ve kterém lze opakovaně
  platit bez zápisu každé platby do blockchainu. Platby lze směrovat
  přes více kanálů; jejich úspěch závisí mimo jiné na dostupné likviditě.
  Bývají rychlé a levné, ale nízká cena ani průchodnost nejsou zaručené.
  Náklady na otevření a uzavření kanálu závisejí také na onchain poplatcích.
  Uzavřením kanálu se jeho stav vypořádá v základní vrstvě.
  Lightning účtuje až v tisícinách <a href="#satoshi">satoshi</a>
  (millisatoshi), zatímco onchain výstupy mají částky v celých satoshi.
</p>
