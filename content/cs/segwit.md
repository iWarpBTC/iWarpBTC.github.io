---
id: segwit
term: segwit
short: segregated witness
order: 39
topic: sit
entryClass: entry
---

<p>
  Úprava bitcoinu, která oddělila podpisové údaje od části transakce určující její
  základní identifikátor. Pomohla omezit nechtěné změny tohoto identifikátoru a umožnila
  efektivnější využití místa v blocích.
</p>
<details class="technical-detail">
  <summary>Technicky přesně</summary>
  <p>
    Vylepšení aktivované <a href="#sfork">soft-forkem</a> v roce 2017.
    Odděluje svědecká data (witness), včetně podpisů segwitových vstupů,
    od serializace používané k výpočtu identifikátoru transakce <code>txid</code>.
    Pole <code>scriptSig</code> v tomto výpočtu zůstává: u nativních segwitových
    vstupů je prázdné, u vnořeného segwitu obsahuje witness program.
    Identifikátor <code>wtxid</code> zahrnuje i witness.
  </p>
  <p>
    Tím odstraňuje významný zdroj změn txid třetí stranou (transaction
    malleability); nejde však o obecnou záruku neměnnosti každé transakce.
    Mění limit bloku z 1 MB na 4 miliony <a href="#wu">weight units</a>.
    Pro segwit v0 zavádí podle BIP143 nový výpočet podpisového hashe,
    který umožňuje odstranit kvadratický růst náročnosti hashování při
    ověřování podpisů.
  </p>
</details>
