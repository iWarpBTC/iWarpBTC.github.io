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
  80bajtová hlavička obsahující verzi bloku, hash hlavičky předchozího bloku,
  kořen Merkleova stromu transakcí, časové razítko, kompaktně zakódovaný
  <a href="#target">cíl těžby</a> (<code>nBits</code>) a <code>nonce</code>.
  Časové razítko volí těžař v mezích pravidel protokolu; nejde o přesné
  měření okamžiku vytěžení. Změnou nonce nebo jiných údajů v hlavičce získává
  těžař další kandidátní hashe.
</p>
