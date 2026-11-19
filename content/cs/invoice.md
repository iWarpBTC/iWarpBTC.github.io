---
id: invoice
term: lightning invoice
short: null
order: 24
topic: lightning
entryClass: entryln
links:
  - text: úvod do Lightning network
    href: /pages/lightning.html
---

<p>
  Platební požadavek obsahující instrukce pro
  <a href="#ln">lightningovou</a> platbu. Běžný formát BOLT11 obsahuje
  platební hash, čas vystavení, údaj o expiraci a popis nebo jeho hash;
  identifikuje také příjemce. Částka může být uvedena, nebo ji zvolí plátce.
  Veřejný klíč příjemce lze získat z podpisu, nemusí být samostatně zapsaným
  polem. BOLT11 používá kódování Bech32 a na hlavní bitcoinové síti začíná
  prefixem <code>lnbc</code>, za kterým může následovat částka.
</p>
