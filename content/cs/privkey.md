---
id: privkey
term: soukromý klíč (private key)
short: null
order: 20
topic: kryptografie
entryClass: entry
links:
  - text: anatomie křivky
    href: /pages/crypto.html
---

<p>
  Tajná část dvojice klíčů <a href="#asym-crypto">asymetrické kryptografie</a>.
  V bitcoinu slouží k vytváření podpisů, kterými se prokazuje oprávnění
  utratit prostředky. Jde o celé číslo <em>d</em> v rozsahu
  <code>1 ≤ d &lt; n</code>, kde <em>n</em> je řád generátoru křivky
  secp256k1. Zapisuje se pomocí 256 bitů, ale ne každé 256bitové číslo
  je platným soukromým klíčem.
</p>
