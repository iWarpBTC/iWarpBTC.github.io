---
id: pubkey
term: veřejný klíč (public key)
short: null
order: 21
topic: kryptografie
entryClass: entry
links:
  - text: anatomie křivky
    href: /pages/crypto.html
---

<p>
  Veřejný protějšek soukromého klíče. Umožňuje ostatním ověřit, že podpis vytvořil
  držitel odpovídajícího tajného klíče. Samotná znalost veřejného klíče k podepisování
  nestačí.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Veřejná část dvojice klíčů, která v bitcoinu umožňuje ověřit podpis.
    Je to bod na křivce secp256k1 vypočtený jako <code>P = dG</code>,
    tedy násobek pevně daného generátoru <em>G</em> soukromým klíčem <em>d</em>.
    Křivka je definována nad konečným tělesem: ke stejné souřadnici <em>x</em>
    patří dvě možné souřadnice <em>y</em>, opačné modulo prvočíslo <em>p</em>.
    Komprimovaný veřejný klíč zabírá 33 bajtů a obsahuje souřadnici <em>x</em>
    a příznak parity <em>y</em>. Schnorrovy podpisy podle BIP340 používají
    32bajtový zápis pouze souřadnice <em>x</em> s konvencí sudé souřadnice <em>y</em>.
  </p>
</details>
