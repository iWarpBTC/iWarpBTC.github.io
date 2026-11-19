---
id: utxo_join
term: konsolidace UTXO
short: null
order: 30
topic: transakce
entryClass: entry
---

<p>
  Spojení více drobných částek v peněžence do jedné větší tím, že je pošlete sami sobě.
  Když jsou poplatky nízké, může to zlevnit budoucí placení. Spojení ale zároveň může
  pozorovateli prozradit, že částky patří stejnému držiteli.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Běžná transakce, ve které držitel spojuje (posílá sám sobě) více svých
    UTXO do jednoho nového UTXO. Provádí se zejména v období nižších
    transakčních poplatků tak, aby si v budoucím období vyšších poplatků
    držitel zlevnil útratu (odemčení) svých bitcoinů tím, že snížil počet
    potenciálně odemykaných vstupů.
  </p>
</details>
