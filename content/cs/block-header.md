---
id: block-header
term: hlavička bloku
short: null
order: 11
topic: sit
entryClass: entry
links:
  - text: anatomie bloku
    href: /pages/block.html
---

<p>
  Stručná souhrnná data o bloku, která ho propojují s předchozím blokem i s transakcemi
  uvnitř. Právě jejich digitální otisk těžaři opakovaně počítají při hledání platného
  bloku.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    80bajtová hlavička obsahující verzi bloku, hash hlavičky předchozího bloku,
    kořen Merkleova stromu transakcí, časové razítko, kompaktně zakódovaný
    <a href="#target">cíl těžby</a> (<code>nBits</code>) a <code>nonce</code>.
    Časové razítko volí těžař v mezích pravidel protokolu; nejde o přesné
    měření okamžiku vytěžení. Změnou nonce nebo jiných údajů v hlavičce získává
    těžař další kandidátní hashe.
  </p>
</details>
