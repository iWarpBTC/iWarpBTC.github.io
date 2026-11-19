---
id: address
term: bitcoinová adresa
short: null
order: 22
topic: penezenky
entryClass: entry
---

<p>
  Textově zakódované údaje, ze kterých peněženka sestaví uzamykací
  <a href="#script">skript</a> výstupu. Jejich obsah závisí na typu adresy:
  P2PKH a P2WPKH používají HASH160 veřejného klíče (SHA256 následované RIPEMD160),
  P2SH používá HASH160 skriptu a P2WSH SHA256 svědeckého skriptu.
  <a href="#taproot">P2TR</a> obsahuje 32bajtovou souřadnici <em>x</em>
  upraveného výstupního veřejného klíče.
</p>
<p>
  Base58Check zůstává platným kódováním pro P2PKH a P2SH; P2SH není omezeno
  jen na vnořený segwit. Segwit verze 0 používá Bech32, verze 1 a vyšší Bech32m.
  Adresy lze generovat offline, například z rozšířeného veřejného klíče
  příslušné větve <a href="#hd-wallet">HD peněženky</a>, bez nové entropie
  a bez znalosti soukromých klíčů. Kvalitní entropie je důležitá při počátečním
  vytváření tajných klíčů či <a href="#seed">seedu</a>.
</p>
<div class="fig">
  <figure>
    <img
      src="/img/adresa.svg"
      alt="bc1ql0t4gka0j9084nz0zrs9sc9tqtf0w29rdh503g"
    />
    <figcaption>
      Na počátku je náhoda, na konci adresa. Vracet se však nelze.
    </figcaption>
  </figure>
</div>
<p>
  U adresy vygenerované standardní cestou s dostatkem počáteční entropie
  je prakticky vyloučeno (teoretická pravděpodobnost je nepředstavitelně
  nízká), že by již byla někdy vygenerována. Dřív objevíte trpaslíka
  uprostřed černé díry, jak hledá s baterkou vypínač, než aby se vám
  podařilo z kvalitní entropie vygenerovat již dříve vygenerovanou
  adresu.
</p>
<h3>Příklady různých adres:</h3>
<div class="fig">
  <table>
    <thead>
      <tr>
        <th>typ</th>
        <th>označení</th>
        <th>adresa</th>
        <th>kódování</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>p2pkh</td>
        <td>legacy</td>
        <td class="long2">1GRYfroBCL6wJeggD92VdPvJp5vKaVtsrA</td>
        <td>Base58Check s počáteční 1</td>
      </tr>
      <tr>
        <td>p2sh</td>
        <td>skriptová adresa (též nested segwit)</td>
        <td class="long2">39qmkmoB1t1mjGAowURRimoQduubbhVoZz</td>
        <td>Base58Check s počáteční 3</td>
      </tr>
      <tr>
        <td>p2wpkh</td>
        <td>native segwit</td>
        <td class="long2">
          bc1ql0t4gka0j9084nz0zrs9sc9tqtf0w29rdh503g
        </td>
        <td>Bech32 s počátečním bc1q</td>
      </tr>
      <tr>
        <td>p2tr</td>
        <td>taproot</td>
        <td class="long2">
          bc1pr8pk6n4xvnnejnqpd4mxdezms8scn5zjnrw9duxt62x0fdyk8tpqmmdxnt
        </td>
        <td>Bech32m s počátečním bc1p</td>
      </tr>
    </tbody>
  </table>
</div>
<div class="fig">
  <figure>
    <img
      src="/img/QR.PNG"
      alt="bc1ql0t4gka0j9084nz0zrs9sc9tqtf0w29rdh503g"
    />
    <figcaption>QR kód bitcoinové adresy</figcaption>
  </figure>
</div>
