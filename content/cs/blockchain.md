---
id: blockchain
term: blockchain
short: null
order: 9
topic: sit
entryClass: entry
links:
  - text: anatomie bloku
    href: /pages/block.html
---

<p>
  Řetězec <a href="#block">bloků</a> bitcoinových transakcí, v němž
  hlavička každého bloku kromě prvního obsahuje <a href="#hash">hash</a>
  hlavičky svého předchůdce. Uzly vybírají z platných řetězců ten s největší
  kumulovanou <a href="#pow">prací</a>, nikoli nutně s největším počtem bloků.
  Vzniká tak uspořádaná historie transakcí, jejíž přepsání vyžaduje konkurenční
  platný řetězec s větší prací. Minulost není absolutně nezměnitelná:
  může nastat <a href="#reorg">reorganizace</a>.
</p>
