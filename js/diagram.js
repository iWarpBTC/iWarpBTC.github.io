// Full-screen viewer for the inlined diagrams.
//
// The diagrams are authored at 761-1213px; on a phone they render around 320px,
// which is a 4x downscale of 12px labels. This opens one at its natural size in a
// native <dialog> so the reader can pan and pinch instead of squinting.
//
// Progressive enhancement: nothing here exists in the built HTML. Without JS the
// diagrams still render inline, and the a.figimg links on the Lightning page still
// open the SVG file directly.
(function () {
  'use strict';

  var diagrams = document.querySelectorAll('svg.diagram');
  if (!diagrams.length || typeof HTMLDialogElement === 'undefined') return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dialog = null;
  var stage = null;
  var caption = null;
  var opener = null;

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML =
      '<div class="lightbox__bar">' +
      '<p class="lightbox__caption"></p>' +
      '<button type="button" class="lightbox__close">Zavřít ✕</button>' +
      '</div><div class="lightbox__stage"></div>';
    caption = dialog.querySelector('.lightbox__caption');
    stage = dialog.querySelector('.lightbox__stage');

    dialog.querySelector('.lightbox__close').addEventListener('click', function () {
      dialog.close();
    });
    // Click outside the content closes; the stage swallows its own clicks.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    // Native <dialog> closes on Escape via the browser's close-request handling,
    // which not every embedding honours. Closing explicitly makes it deterministic;
    // where the native path already fired, dialog.open is false and this no-ops.
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && dialog.open) {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener('close', function () {
      stage.replaceChildren();
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    });
    document.body.appendChild(dialog);
  }

  function labelFor(svg) {
    var figure = svg.closest('figure');
    var figcaption = figure && figure.querySelector('figcaption');
    if (figcaption) return figcaption.textContent.replace(/\s+/g, ' ').trim();
    return svg.getAttribute('aria-label') || 'Diagram';
  }

  function open(svg, trigger) {
    if (!dialog) build();
    opener = trigger || null;

    var clone = svg.cloneNode(true);
    clone.removeAttribute('style');
    // Namespaced ids are unique per document; a clone would duplicate them.
    clone.querySelectorAll('[id]').forEach(function (node) {
      node.removeAttribute('id');
    });
    clone.style.setProperty(
      '--dg-natural',
      svg.style.getPropertyValue('--dg-natural') || '900px',
    );

    caption.textContent = labelFor(svg);
    stage.replaceChildren(clone);
    dialog.showModal();
    if (!reduceMotion) stage.scrollTo({ top: 0, left: 0 });
  }

  Array.prototype.forEach.call(diagrams, function (svg) {
    var anchor = svg.closest('a.figimg');
    if (anchor) {
      // Keep the href as the no-JS fallback; intercept the click for the viewer.
      anchor.addEventListener('click', function (event) {
        event.preventDefault();
        open(svg, anchor);
      });
      anchor.style.cursor = 'zoom-in';
      return;
    }

    // No existing affordance: wrap in a real button so it is keyboard reachable.
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'diagram-open';
    button.title = 'Zvětšit diagram';
    button.setAttribute('aria-label', 'Zvětšit diagram: ' + labelFor(svg));
    svg.parentNode.insertBefore(button, svg);
    button.appendChild(svg);
    button.addEventListener('click', function () {
      open(svg, button);
    });
  });
})();
