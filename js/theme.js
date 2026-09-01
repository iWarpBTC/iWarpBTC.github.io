// Light/dark toggle. The stored preference is applied by an inline script in the
// document head so there is no flash; this file only wires up the button and keeps
// the label in sync. With no stored preference the OS setting wins via CSS.
(function () {
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isDark() {
    var t = stored();
    return t ? t === 'dark' : systemDark();
  }

  function sync(button) {
    var dark = isDark();
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim';
    button.setAttribute('aria-label', button.title);
  }

  var buttons = document.querySelectorAll('[data-theme-toggle]');
  Array.prototype.forEach.call(buttons, function (button) {
    sync(button);
    button.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      Array.prototype.forEach.call(buttons, sync);
    });
  });
})();
