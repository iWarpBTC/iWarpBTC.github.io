---
id: sfork
term: soft&hyphen;fork
short: null
order: 41
topic: sit
entryClass: entry
---

<p>
  Zpřísnění bitcoinových pravidel, při kterém nové bloky stále vyhovují i starým
  pravidlům. Starší uzly je proto mohou přijímat, samy ale nedokážou kontrolovat nově
  přidaná omezení.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Zpřísnění pravidel konsenzu: množina nově platných bloků je podmnožinou
    bloků platných podle dosavadních pravidel.
    Starší <a href="#node">uzly</a> tedy přijímají bloky vyhovující novým
    pravidlům, samy však nová omezení nevynucují a mohou přijmout i blok,
    který je podle nových pravidel neplatný.
  </p>
</details>
