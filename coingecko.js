const api_url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=czk';

async function getapi(url) {
    
  const response = await fetch(url);
  
  var data = await response.json();
  //console.log(data);
  if (response) {
    show(data);
  }
}
getapi(api_url);

function show(data) {
  satsperczk = (1 / data.bitcoin.czk * 100000000).toFixed(0);
  czkpersats = (data.bitcoin.czk / 100000000).toFixed(0);
  h2 = document.createElement('h2')
  h2.className = 'price';
  if (czkpersats >= 1)
    h2.innerHTML = `${czkpersats} CZK/sat`;
  else
    h2.innerHTML = `${satsperczk} sats/CZK`;

  div = document.getElementById('satoshidiv');
  before = document.getElementById('satoshi');
  div.insertBefore(h2, before);
}
