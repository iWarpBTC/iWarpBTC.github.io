---
id: seed
term: seed (semínko)
short: null
order: 17
topic: penezenky
entryClass: entry
links:
  - text: anatomie HD peněženky
    href: /pages/wallet.html
---

<p>
  Výchozí data pro deterministické odvozování klíčů. BIP32 přijímá seed
  dlouhý 128 až 512 bitů. Při použití BIP39 vzniká 512bitový seed funkcí
  PBKDF2-HMAC-SHA512 ze <a href="#seed-words">slovní zálohy</a>
  normalizované do Unicode NFKD a saltu tvořeného řetězcem
  <code>mnemonic</code> a stejně normalizovanou
  <a href="#passphrase">passphrase</a> (případně prázdnou).
  Délka výsledku 512 bitů neznamená 512 bitů entropie: roztažením vstupu
  se nová náhodnost nevytváří.
</p>
