// Toggle a class instead of writing literal colours. The old version restored
  // `color: black`, which is invisible on the dark theme's code background.
  function chanclrblue(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("is-highlighted");
  }
  function chanclrblack(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("is-highlighted");
  } 
  function biggerbox(id) {
    el =  document.getElementById(id);
    el.style.width = "35px";
    el.style.transform = "translate(4px)";
  } 
  function backbox(id) {
    el =  document.getElementById(id);
    el.style.width = "";
    el.style.transform = "";
  }