---
id: wu
term: weight unit, WU
short: null
order: 33
topic: transakce
entryClass: entry
links:
  - text: anatomie transakce
    href: /pages/transaction.html
---

<p>
  Jednotka, kterou bitcoin měří, kolik z kapacity bloku transakce zabere. Různé části
  transakce se do této váhy započítávají různě, takže nejde jednoduše o počet bajtů
  souboru.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Jednotka váhy (velikosti)
    <a href="#transaction">transakce</a>. <a href="#segwit">Segwit</a>
    přiřadil bajtům různých částí transakce různou váhu: data svědků (witness)
    se počítají 1 WU za bajt, ostatní data 4 WU za bajt. Podpisová data
    segwitových transakcí tak mají čtyřikrát nižší váhu než u starších
    transakcí. Blok smí vážit nejvýše 4 miliony WU.
  </p>
</details>
