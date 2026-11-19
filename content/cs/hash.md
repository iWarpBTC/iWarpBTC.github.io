---
id: hash
term: hash, otisk
short: null
order: 13
topic: kryptografie
entryClass: entry
---

<p>
  Krátký digitální otisk dat. Ze stejných dat vznikne vždy stejný otisk, ale po jejich
  změně bude zpravidla úplně jiný. Otisk umožňuje kontrolovat shodu dat; původní obsah z
  něj prakticky nelze obnovit.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Výstup hashovací funkce, která vstupní data převádí na otisk pevné délky.
    U kryptograficky bezpečné funkce je výpočetně neproveditelné z otisku
    získat odpovídající vstup nebo nalézt dva různé vstupy se stejným otiskem.
    Malá změna vstupu mění výstup nepředvídatelně; typicky se změní přibližně
    polovina bitů, nikoli nutně číselná hodnota o velkou část rozsahu.
    Nelze prakticky předvídat, jak vstup změnit, aby vyšel požadovaný otisk,
    například číslo pod <a href="#target">cílem těžby</a>.
    V bitcoinu používaná SHA256 vytváří 256bitový otisk, zpravidla zapisovaný
    v šestnáctkové soustavě.
  </p>
</details>
<h3>Příklady:</h3>
<div class="fig">
  <table>
    <thead>
      <tr>
        <th>vstup</th>
        <th>sha256</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>"Ahoj"</td>
        <td class="long">
          f23e6807b3fb0be0ea999ea8cb88a3e94dc359c84230461f9761efac57dcb081
        </td>
      </tr>
      <tr>
        <td>"Ahoy"</td>
        <td class="long">
          491312f2ce2f0d05cc8821956a34138428a72d6cbf3e426ef6bcc87f2905b614
        </td>
      </tr>
      <tr>
        <td>"Ahoj, jak se dneska máš?"</td>
        <td class="long">
          56528a982b106e43d1f236360b6a72c4334918c0a83413d810ac0041f8f2e377
        </td>
      </tr>
    </tbody>
  </table>
</div>
