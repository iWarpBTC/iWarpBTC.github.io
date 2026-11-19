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
  Politika umožňující nahradit nepotvrzenou transakci v
  <a href="#mempool">mempoolu</a> jinou transakcí utrácející alespoň jeden
  stejný vstup. Používá se například ke zvýšení <a href="#fee">poplatku</a>.
  Náhrada musí splnit poplatkové i další podmínky daného uzlu; nestačí pouze
  libovolně zvýšit absolutní poplatek.
</p>
<p>
  U opt-in RBF podle BIP125 transakce signalizuje nahraditelnost hodnotou
  <code>nSequence &lt; 0xfffffffe</code> alespoň na jednom vstupu; signál může
  také zdědit od nepotvrzeného předka. Full RBF tuto signalizaci nevyžaduje.
  Jde o politiku uzlů, nikoli o pravidlo konsenzu nebo záruku, kterou
  z konfliktních transakcí těžař potvrdí.
</p>
