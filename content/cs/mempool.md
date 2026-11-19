---
id: mempool
term: mempool
short: null
order: 32
topic: transakce
entryClass: entry
---

<p>
  Lokální soubor nepotvrzených <a href="#transaction">transakcí</a>, které
  konkrétní <a href="#node">uzel</a> přijal podle svých pravidel.
  Neexistuje jeden společný mempool celé sítě: uzly se mohou lišit jeho obsahem,
  nastavením i tím, zda ho vůbec udržují. Těžaři z těchto transakcí sestavují
  kandidátské bloky a obvykle zohledňují poměr
  <a href="#fee">poplatku</a> k <a href="#vsize">virtuální velikosti</a>,
  včetně závislostí a poplatkové sazby celých balíčků transakcí.
</p>
