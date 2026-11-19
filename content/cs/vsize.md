---
id: vsize
term: vsize, vbytes, vB
short: null
order: 34
topic: transakce
entryClass: entry
links:
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>
  Velikost transakce používaná při porovnávání poplatků. Za každý virtuální bajt platíte
  zvolenou sazbu; větší transakce tedy při stejné sazbě stojí více. Tato velikost nemusí
  odpovídat počtu bajtů přenesených po síti.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Virtuální velikost <a href="#transaction">transakce</a>, vyjádřená ve
    virtuálních bajtech (vB). Vypočítá se jako její váha ve
    <a href="#wu">weight units</a> dělená čtyřmi a zaokrouhlená nahoru
    na celé číslo: <code>vsize = ceil(weight / 4)</code>.
    Například transakce o váze 561 WU má virtuální velikost 141 vB.
  </p>
</details>
