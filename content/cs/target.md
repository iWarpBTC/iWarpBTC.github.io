---
id: target
term: cíl těžby (target)
short: null
order: 44
topic: tezeni
entryClass: entry
links:
  - text: anatomie těžby
    href: /pages/block.html#mining
---

<p>
  Číselná hranice pro těžbu: otisk hlavičky bloku, chápaný jako číslo, ji nesmí
  přesáhnout. Čím nižší hranice, tím méně pokusů uspěje a tím těžší je blok najít.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Číselná hranice pro <a href="#hash">hash</a> hlavičky bloku, reprezentovatelná
    256 bity. Aby blok splnil <a href="#pow">proof of work</a>, musí být jeho hash
    menší nebo rovný předepsanému cíli. Současně musí splnit všechna ostatní
    pravidla platnosti bloku.
    Na hlavní bitcoinové síti se cíl přepočítává každých 2016 bloků podle rozdílu
    časových razítek prvního a posledního bloku období. Ten kvůli historické
    odchylce zahrnuje 2015 intervalů mezi bloky. Úprava míří na průměrný interval
    deset minut, nezaručuje však pravidelné příchody jednotlivých bloků.
  </p>
</details>
