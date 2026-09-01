---
id: rbf
term: RBF
short: replace by fee
order: 35
topic: transakce
entryClass: entry
links:
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>
  Využití transakčního pole <em>sequence</em> umožňuje zvyšovat poplatek
  do bloku dosud nezařazených transakcí. Aby byla transakce
  nahraditelná, musí mít nastavenou <em>sequence</em> menší než
  <em>0xffffffff</em>. Pak je možné ji v
  <a href="#mempool">mempoolech</a> nahradit
  transakcí s vyšším poplatkem, která utrácí alespoň jeden stejný
  neutracený výstup.
</p>
