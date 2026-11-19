---
id: seed-words
term: slova seedu
short: null
order: 16
topic: penezenky
entryClass: entry
links:
  - text: anatomie HD peněženky
    href: /pages/wallet.html
---

<p>
  Lidsky čitelný zápis počáteční entropie a kontrolního součtu. Ve standardu
  BIP39 jde o 12, 15, 18, 21 nebo 24 slov ze seznamu 2048 položek,
  odpovídajících 128 až 256 bitům entropie v krocích po 32 bitech.
  Slova se mohou opakovat. Poslední slovo obsahuje část entropie i 4 až 8 bitů
  kontrolního součtu odvozeného z jejího <a href="#hash">hashe</a>.
  Kontrolní součet pomáhá odhalit chyby, ale neodhalí každou chybu.
  Z této slovní zálohy a případné <a href="#passphrase">passphrase</a>
  se odvozuje <a href="#seed">seed</a>. Ne všechny peněženky používají BIP39.
</p>
