---
id: htlc
term: HTLC
short: hashed time lock contract
order: 28
topic: lightning
entryClass: entry
links:
  - text: úvod do Lightning network
    href: /pages/lightning.html#htlc
---

<p>
  Podmíněná platba: příjemce ji může získat odhalením správného tajemství. Po uplynutí
  stanovené doby může odesílatel využít cestu pro vrácení peněz. Vrácení ale vyžaduje
  další akci, neproběhne samo od sebe.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Kontrakt kombinující podmínku znalosti předobrazu
    <a href="#hash">hashe</a> s časovým zámkem. Příjemce může získat prostředky
    odhalením odpovídajícího předobrazu a splněním dalších podmínek kontraktu.
    Po uplynutí časového limitu může odesílatel uplatnit cestu pro vrácení
    prostředků. Ty se nevracejí automaticky: je potřeba příslušná akce protokolu,
    případně onchain transakce. Samotné vypršení časového zámku obecně nezneplatňuje
    cestu s předobrazem. HTLC se používají při směrování plateb v
    <a href="#ln">Lightning network</a>.
  </p>
</details>
