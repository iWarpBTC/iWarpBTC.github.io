---
id: utxo
term: UTXO
short: unspent transaction output
order: 29
topic: transakce
entryClass: entry
links:
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>
  Bitcoinové <a href="#wallet">peněžence</a> zjednodušeně nepatří jeden
  zůstatek, ale jednotlivé dosud neutracené výstupy plateb. Při placení
  se vybraný výstup spotřebuje celý; případný zbytek se vrátí v novém výstupu.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    UTXO je neutracený výstup <a href="#transaction">transakce</a>,
    identifikovaný dvojicí txid a index výstupu. Obsahuje částku a uzamykací
    <a href="#script">skript</a> určující podmínky utracení. Vstup nové
    transakce na tento výstup odkazuje a jeho utracení musí splnit příslušné
    podmínky. UTXO se spotřebuje celé; vrácená částka vzniká jako nový výstup.
  </p>
  <p>
    Zůstatek peněženky se odvozuje ze součtu hodnot UTXO, které dokáže utratit.
    Transakční <a href="#fee">poplatek</a> je rozdíl mezi součtem hodnot
    jejích vstupů a součtem hodnot jejích výstupů.
  </p>
</details>
