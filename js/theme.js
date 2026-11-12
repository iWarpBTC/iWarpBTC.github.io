// Explicit choices persist; system mode follows CSS prefers-color-scheme.
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-theme-choice]');
  function sync() {
    var mode = ['light', 'dark'].includes(root.dataset.theme) ? root.dataset.theme : 'system';
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === mode));
    });
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.themeChoice;
      if (value === 'system') delete root.dataset.theme;
      else root.dataset.theme = value;
      try {
        if (value === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', value);
      } catch (e) {}
      sync();
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== 'theme' && event.key !== null) return;
    if (event.newValue === 'light' || event.newValue === 'dark') root.dataset.theme = event.newValue;
    else delete root.dataset.theme;
    sync();
  });
  sync();
})();
