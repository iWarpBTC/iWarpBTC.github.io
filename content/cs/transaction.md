---
id: transaction
term: transakce
short: null
order: 23
topic: transakce
entryClass: entry
links:
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>
  Záznam, který utratí dříve přijaté prostředky a určí nové částky a podmínky jejich
  dalšího utracení. Část může poslat příjemci a zbytek vrátit plátci. Rozdíl připadne
  těžaři jako poplatek.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Základní operace bitcoinové sítě. Běžná transakce svými vstupy spotřebovává
    dosud <a href="#utxo">neutracené výstupy</a> předchozích transakcí
    a vytváří nové výstupy s částkou a uzamykacím
    <a href="#script">skriptem</a>. Skript nemusí mít podobu odpovídající
    některému běžnému typu <a href="#address">adresy</a>.
    Výjimkou je <a href="#coinbase">mincetvorná transakce</a>, která
    předchozí výstupy nespotřebovává.
  </p>
  <p>
    Zařazení do bloku znamená první potvrzení; další navazující bloky počet
    potvrzení zvyšují. Riziko vyřazení při <a href="#reorg">reorganizaci</a>
    tím obvykle klesá, transakce se však nestává absolutně nesmazatelnou.
  </p>
</details>
