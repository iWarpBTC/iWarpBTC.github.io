const api_url_czk = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=czk';
const api_url_usd = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

async function getapi() {
    
  const response = await fetch(api_url_czk);
  
  var data = await response.json();
  //console.log(data);
  if (response) {
    show_czk(data);
  }

  const response2 = await fetch(api_url_usd);
  
  var data = await response2.json();
  //console.log(data);
  if (response2) {
    show_usd(data);
  }
}
getapi();

function show_czk(data) {
  satsperczk = (1 / data.bitcoin.czk * 100000000).toFixed(0);
  czkpersats = (data.bitcoin.czk / 100000000).toFixed(0);
  h2 = document.createElement('h2');
  h2.className = 'price';
  if (czkpersats >= 1)
  {
    mena = 'korun';
    if (czkpersats == 1)
      mena = 'koruna';
    else if (czkpersats < 5)
      mena = 'koruny';
    h2.innerHTML = `<span>${czkpersats} ${mena} za satoshi</span>`;
  }
  else
  {
    h2.innerHTML = `<span>${satsperczk} satoshi za korunu</span>`;
  }

  div = document.getElementById('satoshidiv');
  before = document.getElementById('satoshi');
  div.insertBefore(h2, before);

  img = document.createElement('img');
  img.src = 'https://btc-slovnik.cz/img/tag.png';
  img.height = 25;
  img.alt = "cena";
  img.className = "pricetag";
  h2.insertBefore(img, h2.firstChild);
}

function show_usd(data) {
  satsperusd = (1 / data.bitcoin.usd * 100000000).toFixed(0);
  h2 = document.createElement('h2');
  h2.className = 'mscwtime';
  h2.innerHTML = `<span>${satsperusd}</span>`;

  div = document.getElementById('moscowdiv');
  before = document.getElementById('moscowtime');
  div.insertBefore(h2, before);
}

function clipboardLink(val) {
  text = 'https://btc-slovnik.cz/#'+val
  navigator.clipboard.writeText(text)
} 

function onload() {
  const queryString = window.location.search;
  if (queryString == '?a=lntip')
  {
    window.location.replace('https://btc-slovnik.cz/pages/donate.html?a=lntip');
  }
}
