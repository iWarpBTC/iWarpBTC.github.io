---
id: reorg
term: reorganizace blockchainu
short: null
order: 38
topic: sit
entryClass: entry
---

<p>
  Může v síti vzácně nastat situace, ve které dva různí těžaři vytěži a
  vyšlou do sítě nový blok prakticky ve stejný okamžik. V síti se pak
  vyskytují dvě různé verze blockchainu, jedna část sítě přijme blok
  těžare A, druhá část zařadí blok těžaře B. Jakmile je vytěžen další
  nový blok, dejme tomu navazující na blok těžaře A, stává se tato verze
  blockchainu nejdelší v síti a jako taková je přijata i druhou částí
  sítě. Ty transakce v osiřelém bloku těžaře B, které se nenachází
  zároveň i v bloku těžaře A, jsou v této části sítě navráceny do
  mempoolu. Této situaci se říká reorganizace blockchainu a je důvodem,
  proč např. směnárny vyžadují, aby blok obsahující vkladovou transakci
  dosáhl určené hloubky v blockchainu (&bdquo;počtu potvrzení&ldquo;),
  typicky 3, nebo dokonce 6. Při této &bdquo;hloubce zatěžení&ldquo; je
  už reorganizace prakticky vyloučena.
</p>
