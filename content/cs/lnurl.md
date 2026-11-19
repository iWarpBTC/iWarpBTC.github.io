---
id: lnurl
term: LNURL
short: lightning network URL
order: 25
topic: lightning
entryClass: entryln
links:
  - text: úvod do Lightning network
    href: /pages/lightning.html
---

<p>
  Způsob, jak se lightningová peněženka domluví s webem nebo jinou aplikací. Po načtení
  odkazu či QR kódu si může například vyžádat údaje pro platbu nebo pro přijetí
  prostředků. Jeden odkaz tak může posloužit opakovaně, aniž by příjemce pokaždé ručně
  posílal nový platební požadavek.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Adresa, resp. protokol pro komunikaci mezi lightning peněženkou a
    jinou aplikací. Zahrnuje např. LNURL&#8209;pay pro vyjednání lightning
    invoice a provedení platby z peněženky, nebo LNURL&#8209;withdraw pro
    výběr prostředků do peněženky. Kódována v bech32 s prefixem lnurl.
  </p>
</details>
