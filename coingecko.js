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
