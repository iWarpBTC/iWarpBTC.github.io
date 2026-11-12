// Decorative live values: the definitions remain usable if the API is unavailable.
(function () {
  const api = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=czk,usd';
  const segments = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
  const shapes = [
    '3,1 17,1 14,4 6,4', '18,2 18,17 15,15 15,5',
    '18,20 18,35 15,32 15,22', '3,36 17,36 14,33 6,33',
    '2,20 5,22 5,32 2,35', '2,2 5,5 5,15 2,17',
    '3,18.5 6,16.5 14,16.5 17,18.5 14,20.5 6,20.5'
  ];
  function badge(id, label) {
    const parent = document.getElementById(id);
    if (!parent) return null;
    const node = document.createElement('div');
    node.className = 'live-quote';
    node.title = 'Aktuální přepočet podle CoinGecko';
    node.setAttribute('aria-label', label);
    parent.appendChild(node);
    return node;
  }
  function render(data) {
    const czk = data.bitcoin?.czk;
    if (Number.isFinite(czk) && czk > 0) {
      const crowns = czk / 100000000;
      const value = Math.round(crowns >= 1 ? crowns : 1 / crowns);
      const label = crowns >= 1 ? `${value === 1 ? 'koruna' : value < 5 ? 'koruny' : 'korun'} za satoshi` : 'satoshi za korunu';
      const node = badge('satoshidiv', `Přibližně ${value} ${label}`);
      if (node) node.innerHTML = `<span class="live-quote__value">≈ ${value.toLocaleString('cs-CZ')}</span><span class="live-quote__label">${label}</span>`;
    }
    const usd = data.bitcoin?.usd;
    if (Number.isFinite(usd) && usd > 0) {
      const value = String(Math.round(100000000 / usd));
      const node = badge('moscowdiv', `Moskevský čas: ${value} satoshi za dolar`);
      if (!node) return;
      const display = document.createElement('span');
      display.className = 'moscow-display';
      display.setAttribute('aria-hidden', 'true');
      display.innerHTML = [...value].map((digit, i) => {
        const pair = i > 0 && (value.length - i) % 2 === 0;
        return `<svg class="moscow-digit${pair ? ' pair-start' : ''}" viewBox="0 0 20 38" focusable="false">${shapes.map((points, j) => `<polygon points="${points}" class="${segments[Number(digit)].includes('abcdefg'[j]) ? 'lit' : ''}"/>`).join('')}</svg>`;
      }).join('');
      node.appendChild(display);
    }
  }
  if (!document.getElementById('satoshidiv') && !document.getElementById('moscowdiv')) return;
  fetch(api, { signal: AbortSignal.timeout(10000) })
    .then(response => { if (!response.ok) throw new Error('Price unavailable'); return response.json(); })
    .then(render)
    .catch(() => { /* No misleading fallback price when offline or rate limited. */ });
})();
