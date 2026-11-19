---
id: cpfp
term: CPFP
short: child pays for parent
order: 36
topic: transakce
entryClass: entry
---

<p>
  Způsob, jak pomoci nepotvrzené platbě k potvrzení: na její výstup se naváže další
  transakce s vyšším poplatkem. Může ji vytvořit příjemce, nebo odesílatel z výstupu se
  zbytkem. Aby těžař mohl získat tento poplatek, musí potvrdit také předchozí platbu.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Způsob, jak motivovat těžaře k potvrzení transakce s nízkým poplatkem.
    Nová transakce utratí její dosud nepotvrzený výstup a přidá dostatečně
    vysoký <a href="#fee">poplatek</a>. Těžař ji může zařadit pouze společně
    s potřebnými nepotvrzenými předky, případně až po jejich potvrzení.
    Rozhodující je poplatková sazba balíčku: součet poplatků dělený součtem
    <a href="#vsize">virtuálních velikostí</a>, nikoli prostý průměr poplatků.
    Potomek tak v podstatě platí za své předky.
  </p>
</details>
