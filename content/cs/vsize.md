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
  Virtuální velikost <a href="#transaction">transakce</a>, vyjádřená ve
  virtuálních bajtech (vB). Vypočítá se jako její váha ve
  <a href="#wu">weight units</a> dělená čtyřmi a zaokrouhlená nahoru
  na celé číslo: <code>vsize = ceil(weight / 4)</code>.
  Například transakce o váze 561 WU má virtuální velikost 141 vB.
</p>
