---
id: asym-crypto
term: asymetrická kryptografie
short: null
order: 19
topic: kryptografie
entryClass: entry
links:
  - text: anatomie křivky
    href: /pages/crypto.html
---

<p>
  Práce s dvojicí matematicky propojených klíčů: jeden je tajný, druhý lze zveřejnit. V
  bitcoinu tajným klíčem podepisujete transakce a veřejným klíčem mohou ostatní ověřit
  podpis, aniž by získali možnost podepisovat za vás.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Kryptografie využívající dvojici soukromého a veřejného klíče.
    Podle konkrétního algoritmu slouží k digitálním podpisům, šifrování
    nebo dohodě na společném tajemství. Podpis není obecně „šifrování obráceně“.
    Bitcoin používá pro podpisy algoritmy ECDSA a Schnorr nad eliptickou
    křivkou secp256k1: <a href="#privkey">soukromý klíč</a> umožňuje
    podepisovat, <a href="#pubkey">veřejný klíč</a> podpis ověřit.
  </p>
</details>
