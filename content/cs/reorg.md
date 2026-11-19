---
id: reorg
term: reorganizace blockchainu
short: null
order: 38
topic: sit
entryClass: entry
---

<p>
  Přechod uzlu na jinou větev platného blockchainu s větší kumulovanou
  <a href="#pow">prací</a>. Krátká reorganizace může nastat například tehdy,
  když dva těžaři téměř současně naleznou různé bloky a další blok rozhodne,
  která větev má více práce. Příčinou však může být i rozdělení sítě nebo
  záměrně vytvářená konkurenční větev.
</p>
<p>
  Transakce z odpojených bloků se mohou vrátit do <a href="#mempool">mempoolu</a>,
  pokud nejsou už potvrzeny v nové větvi, zůstávají platné a splňují politiku uzlu.
  Konfliktní transakce se vrátit nemusí. Další potvrzení obvykle snižují riziko
  změny historie a zvyšují práci potřebnou k jejímu přepsání. Ani tři nebo šest
  potvrzení však nezaručují absolutní konečnost; riziko závisí také na výkonu
  případného útočníka.
</p>
