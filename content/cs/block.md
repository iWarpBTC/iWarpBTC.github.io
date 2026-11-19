---
id: block
term: blok
short: null
order: 10
topic: sit
entryClass: entry
links:
  - text: anatomie bloku
    href: /pages/block.html
---

<p>
  Datová struktura obsahující <a href="#block-header">hlavičku</a>
  a uspořádaný seznam serializovaných transakcí. Její váha je omezena
  na 4&nbsp;000&nbsp;000&nbsp;<a href="#wu">WU</a> (před segwitem platil
  limit 1 MB). Zařazení transakce do bloku určuje její pozici v potvrzené
  historii, nikoli přesný okamžik jejího vytvoření nebo odvysílání.
</p>
