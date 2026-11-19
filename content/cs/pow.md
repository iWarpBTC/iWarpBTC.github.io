---
id: pow
term: proof of work
short: null
order: 46
topic: tezeni
entryClass: entry
links:
  - text: anatomie těžby
    href: /pages/block.html#mining
---

<p>
  Výsledek výpočetního hledání, který je obtížné najít, ale snadné zkontrolovat. Bitcoin
  jej vyžaduje u každého bloku, takže vytvoření konkurenční historie stojí výpočetní
  práci. Samotný výsledek neprozrazuje, kolik pokusů těžař skutečně potřeboval.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Důkaz prací: výsledek, jehož nalezení je při dané obtížnosti v průměru
    výpočetně náročné, ale jehož splnění lze snadno ověřit. V bitcoinu jde
    o <a href="#hash">hash</a> hlavičky bloku menší nebo rovný
    <a href="#target">cíli těžby</a>. Nedokazuje přesný počet skutečně
    provedených pokusů: těžař může mít štěstí a uspět brzy.
    Kumulovaná práce řetězce vyjadřuje očekávanou práci podle obtížností jeho bloků.
    Ověření samotného proof of work je levné; ověření celého bloku navíc
    zahrnuje transakce, podpisy a další pravidla. Neplatný blok uzly odmítnou
    i tehdy, když splňuje proof of work.
  </p>
</details>
