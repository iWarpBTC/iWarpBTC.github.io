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
  Volitelné dodatečné heslo ke slovní záloze. Každé jiné heslo otevře jinou peněženku,
  takže i překlep může vést k prázdné peněžence místo hlášení chyby. Pro obnovu
  potřebujete slova i správné heslo; jeho síla rozhoduje o tom, jak dobře ochrání
  prostředky při prozrazení slov.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Volitelné heslo, které spolu se <a href="#seed-words">slovy seedu</a>
    podle BIP39 určuje výsledný <a href="#seed">seed</a>.
    Někdy se nepřesně označuje jako 13. či 25. slovo, ale nemusí jít o jediné
    slovo ani o položku ze seznamu BIP39. Funkce PBKDF2 zpracovává normalizovanou
    slovní zálohu a používá salt tvořený řetězcem <code>mnemonic</code>
    následovaným normalizovanou passphrase.
  </p>
  <p>
    Každá passphrase odvodí platnou peněženku, takže i překlep obvykle otevře
    jinou, prázdnou peněženku místo zobrazení chyby. Zda se passphrase ukládá,
    závisí na konkrétní peněžence. Útočník se slovní zálohou může zkoušet
    passphrase offline, a proto ochrana závisí na její síle. Zálohu passphrase
    je vhodné uchovávat odděleně od slov; její ztráta znamená ztrátu přístupu,
    pokud není k dispozici jiná použitelná záloha podpisových klíčů.
    Peněženka s návnadovým zůstatkem může sloužit k věrohodnému popření dalších
    prostředků, ale nezaručuje, že útočník přestane hledat.
  </p>
</details>
