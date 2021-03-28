function chanclrblue(id) {
    document.getElementById(id).style.color = "blue";
    document.getElementById(id).style.backgroundColor = "#D4D4D4";
  }  
  function chanclrblack(id) {
    document.getElementById(id).style.color = "black";
    document.getElementById(id).style.backgroundColor = "initial";
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