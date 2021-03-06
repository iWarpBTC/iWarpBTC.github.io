/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropIt() {
  document.getElementById("dropdown").classList.toggle("show");
}

function dropDonate() {
  document.getElementById("donate").classList.toggle("show");
  document.getElementById("donate").scrollIntoView();
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-menu");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
