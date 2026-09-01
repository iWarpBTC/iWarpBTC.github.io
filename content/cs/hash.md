---
id: hash
term: hash, otisk
short: null
order: 13
topic: kryptografie
entryClass: entry
---

<p>
  Výstup jednosměrné matematické funkce, která libovolně dlouhá vstupní
  data převede na číslo v daném rozsahu. I velmi malá změna vstupních
  dat způsobí velmi velkou změnu na výstupu funkce. Zároveň nelze
  předvídat jaká změna vstupních dat by mohla způsobit kýženou změnu
  výstupu, např. získání menšího čísla na výstupu (což je mimochodem
  cílem <a href="#mining">těžby</a>). Výstupem v
  Bitcoinu používané funkce SHA256 je 256bitové číslo, zpravidla
  zapisované v šestnáctkové soustavě.
</p>
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
