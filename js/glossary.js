// Glossary search, index and deep-link behaviour.
//
// Progressive enhancement throughout: every entry is in the HTML and visible with
// this file absent or failing. Nothing here fetches or renders content — it only
// hides non-matching entries, wires the index tabs, and handles copy/hash affordances.
(function () {
  'use strict';

  /** Fold for Czech search: lowercase and strip diacritics, so "penezenka"
   *  matches "peněženka" and "tezeni" matches "těžení". */
  function fold(value) {
    return (value || '')
      .toLocaleLowerCase('cs')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  function plural(n, one, few, many) {
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
  }

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- search ---

  var input = document.querySelector('[data-search-input]');
  var status = document.querySelector('[data-search-status]');
  var clearButton = document.querySelector('[data-search-clear]');
  var emptyState = document.querySelector('[data-search-empty]');
  var entryNodes = Array.prototype.slice.call(document.querySelectorAll('[data-term]'));

  var records = entryNodes.map(function (el) {
    var heading = el.querySelector('h2');
    var alias = el.querySelector('.short');
    var body = el.querySelector('.entry__body');
    return {
      el: el,
      id: el.getAttribute('data-id'),
      haystack: fold(
        [
          heading ? heading.textContent : '',
          alias ? alias.textContent : '',
          body ? body.textContent : '',
        ].join(' '),
      ),
      railLinks: Array.prototype.slice.call(
        document.querySelectorAll('.rail__list a[href="#' + CSS.escape(el.getAttribute('data-id')) + '"]'),
      ),
    };
  });

  var visible = records.slice();

  function apply(query) {
    var needle = fold(query.trim());
    visible = [];

    records.forEach(function (record) {
      var match = !needle || record.haystack.indexOf(needle) !== -1;
      record.el.hidden = !match;
      record.railLinks.forEach(function (link) {
        var item = link.closest('li');
        if (item) item.hidden = !match;
      });
      if (match) visible.push(record);
      record.el.querySelectorAll('details.technical-detail').forEach(function (detail) {
        if (needle && match && fold(detail.textContent).includes(needle)) {
          if (!detail.open) { detail.open = true; detail.dataset.searchOpened = 'true'; }
        } else if (detail.dataset.searchOpened) {
          detail.open = false;
          delete detail.dataset.searchOpened;
        }
      });
    });

    // Hide index groups that no longer contain anything.
    Array.prototype.forEach.call(document.querySelectorAll('.rail__group'), function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll('li'));
      group.hidden = items.length > 0 && items.every(function (li) { return li.hidden; });
    });

    if (clearButton) clearButton.hidden = !query;
    if (emptyState) emptyState.hidden = visible.length !== 0;

    if (status) {
      status.textContent = !needle
        ? ''
        : visible.length === 0
          ? 'Žádný pojem neodpovídá'
          : visible.length + ' ' + plural(visible.length, 'pojem', 'pojmy', 'pojmů');
    }

    active = -1;
  }

  if (input) {
    input.addEventListener('input', function () {
      apply(input.value);
    });

    // Preserve a query typed before this script ran (bfcache, slow connection).
    if (input.value) apply(input.value);
  }

  if (clearButton && input) {
    clearButton.addEventListener('click', function () {
      input.value = '';
      apply('');
      input.focus();
    });
  }

  // ------------------------------------------------------ keyboard control ---

  var active = -1;

  function focusMatch(index) {
    if (!visible.length) return;
    active = (index + visible.length) % visible.length;
    var heading = visible[active].el.querySelector('h2');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
    highlight(visible[active].el);
  }

  document.addEventListener('keydown', function (event) {
    var typingElsewhere =
      document.activeElement &&
      document.activeElement !== input &&
      /^(input|textarea|select)$/i.test(document.activeElement.tagName);
    if (typingElsewhere || event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === '/' && document.activeElement !== input && input) {
      event.preventDefault();
      input.focus();
      input.select();
      return;
    }

    if (document.activeElement !== input) return;

    if (event.key === 'Escape') {
      input.value = '';
      apply('');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusMatch(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusMatch(active - 1);
    } else if (event.key === 'Enter' && visible.length) {
      event.preventDefault();
      focusMatch(active < 0 ? 0 : active);
    }
  });

  // --------------------------------------------------------- index (rail) ---

  var rail = document.querySelector('[data-rail]');
  var narrow = window.matchMedia('(max-width: 1099px)');

  if (rail) {
    // Rendered open so it works without JS; collapse it where space is tight.
    if (narrow.matches) rail.open = false;
    var onChange = function (event) {
      rail.open = !event.matches;
    };
    if (narrow.addEventListener) narrow.addEventListener('change', onChange);

    var tabs = Array.prototype.slice.call(rail.querySelectorAll('[data-rail-tab]'));
    var panels = Array.prototype.slice.call(rail.querySelectorAll('[data-rail-panel]'));

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-rail-tab');
        tabs.forEach(function (other) {
          other.setAttribute('aria-selected', String(other === tab));
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-rail-panel') !== name;
        });
      });
    });

    // Following an index link on a narrow screen should get out of the way.
    rail.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (link && narrow.matches) rail.open = false;
    });
  }

  // ------------------------------------------------------ copy permalinks ---

  function permalink(id) {
    // Built from the current location rather than a hardcoded host, so a future
    // /en/ page copies /en/#id instead of sending readers to the Czech page.
    return location.origin + location.pathname + '#' + id;
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-copy]');
    if (!button) return;
    var id = button.getAttribute('data-copy');
    var done = function () {
      button.classList.add('is-copied');
      if (status) status.textContent = 'Odkaz zkopírován';
      setTimeout(function () {
        button.classList.remove('is-copied');
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(permalink(id)).then(done, function () {});
    }
  });

  // --------------------------------------------------------- deep linking ---

  function highlight(el) {
    if (!el) return;
    entryNodes.forEach(function (node) {
      node.classList.remove('is-target');
    });
    el.classList.add('is-target');
  }

  function highlightHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var entry = target.closest('[data-term]') || target;
    highlight(entry);
    // The sticky toolbar would otherwise cover the heading a shared link points at.
    requestAnimationFrame(function () {
      entry.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  window.addEventListener('hashchange', highlightHash);
  if (location.hash) highlightHash();
})();
