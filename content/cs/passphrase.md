---
id: passphrase
term: passphrase
short: null
order: 18
topic: penezenky
entryClass: entry
links:
  - text: anatomie HD peněženky
    href: /pages/wallet.html
---

<p>
  Někdy též poněkud nesprávně zvaná 13./25. slovo seedu, ačkoliv se
  nemusí a neměla by se omezovat pouze na jedno slovo. Je&hyphen;li
  použita, podílí se (jako salt funkce PBKDF2) v kombinaci s počáteční
  entropií (v podobě řetězce 12/24 slov) na vygenerování seedu. Na
  rozdíl od samotné počáteční entropie není uložena v peněžence a neměla
  by být uchovávána ani společně s fyzickou zálohou (slovy seedu). Pak
  passphrase poskytuje další vrstvu ochrany, neboť případná extrakce
  počáteční entropie z peněženky či nalezení zálohy (slov seedu) dává
  přístup pouze k prostředkům uloženým pod seedem bez passphrase. Pokud
  zde utočník nějaké uspokojivé množství prostředků najde, dost možná
  již nebude mít potřebu odhalovat případnou passphrase (pod kterou však
  může být ukryt větší zbytek prostředků).
</p>
