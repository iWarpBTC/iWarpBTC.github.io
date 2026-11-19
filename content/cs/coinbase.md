---
id: coinbase
term: mincetvorná transakce
short: coinbase transaction
order: 37
topic: transakce
entryClass: entry
links:
  - text: anatomie bloku
    href: /pages/block.html
---

<p>
  První transakce každého bloku, kterou si těžař připisuje odměnu: nově vydané bitcoiny
  a poplatky za transakce v bloku. Povolené množství nových bitcoinů se přibližně každé
  čtyři roky půlí. S burzou stejného jména tato transakce nesouvisí.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Speciální <a href="#transaction">transakce</a> na první pozici každého
    <a href="#block">bloku</a>. Její vstup neodkazuje na předchozí výstup.
    Těžař si jí může připsat nejvýše blokovou subvenci, tedy nově vytvořené
    <a href="#bitcoin">bitcoiny</a>, a součet <a href="#fee">poplatků</a>
    transakcí v bloku. Subvence a poplatky dohromady tvoří blokovou odměnu.
  </p>
  <p>
    Subvence začínala na 50 BTC a každých 210 000 bloků se půlí se zaokrouhlením
    dolů na celé satoshi. Od bloku 840 000, vytěženého v dubnu 2024,
    činí 3,125 BTC. Při 33. půlení, přibližně v roce 2140, klesne na nulu;
    poplatky tím nezaniknou.
  </p>
</details>
