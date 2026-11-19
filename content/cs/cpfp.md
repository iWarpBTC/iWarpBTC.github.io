---
id: cpfp
term: CPFP
short: child pays for parent
order: 36
topic: transakce
entryClass: entry
---

<p>
  Způsob, jak motivovat těžaře k potvrzení transakce s nízkým poplatkem.
  Nová transakce utratí její dosud nepotvrzený výstup a přidá dostatečně
  vysoký <a href="#fee">poplatek</a>. Těžař ji může zařadit pouze společně
  s potřebnými nepotvrzenými předky, případně až po jejich potvrzení.
  Rozhodující je poplatková sazba balíčku: součet poplatků dělený součtem
  <a href="#vsize">virtuálních velikostí</a>, nikoli prostý průměr poplatků.
  Potomek tak v podstatě platí za své předky.
</p>
