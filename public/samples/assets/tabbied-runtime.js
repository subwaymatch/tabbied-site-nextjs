// Tiny runtime for the static-HTML sample sites. The vendored css-doodle
// element renders whatever grid it is told; on its own, a fixed grid stretches
// its cells to fill a non-square box. This script gives each decorative doodle
// a grid whose cell count matches its box, so cells stay square (a "cover" fit
// with no stretching), and optionally re-seeds it on an interval so the drawing
// shuffles over time.
//
// Markup contract (emitted by samples/lib/tabbied-embed.mjs):
//   <script type="text/tabbied" data-tabbied="art0"
//           data-cell="48" data-reseed="4200"> ...source... </script>
// where data-cell is the target cell size in px and data-reseed (optional) is
// the shuffle interval in ms. The script's parent element is the sized box, and
// this file swaps the script for a <css-doodle> once that box has been measured.
// The source ships inert rather than as a live element on purpose: css-doodle
// renders the moment it connects, so shipping one with a placeholder grid would
// paint a coarse version of the pattern and then immediately repaint it at the
// measured grid, which reads as a blink and doubles the work on load.
(function () {
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomSeed() {
    var s = '';
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 5; i++) {
      s += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return s;
  }

  // Choose cols x rows for a box so each cell is close to `cell` px and square.
  function gridFor(w, h, cell) {
    var cols = Math.max(1, Math.round(w / cell));
    var rows = Math.max(1, Math.round(h / cell));
    return cols + 'x' + rows;
  }

  // Artwork rules carry their own `transition`, which is what makes a reseed
  // morph from one arrangement into the next. On the very first paint there is
  // nothing to morph from, so every cell animates in from its unstyled state:
  // the drawing visibly assembles itself, and a page full of artworks pays for
  // thousands of simultaneous transitions while it loads. Mute them inside the
  // shadow root for the first two frames, then drop the override so later
  // reseeds animate exactly as authored.
  function muteFirstDraw(el) {
    var root = el.shadowRoot;
    if (!root) return;
    var mute = document.createElement('style');
    mute.textContent =
      'cssd-cell,cssd-cell *,cssd-cell::before,cssd-cell::after{transition:none !important}';
    root.appendChild(mute);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        mute.remove();
      });
    });
  }

  // Each source script is replaced by a <css-doodle> built at the grid its box
  // actually wants. The element is only created once a usable measurement
  // exists, so it renders exactly once instead of painting a placeholder grid
  // first and correcting it a frame later.
  function setup(script) {
    if (script.__tabbiedReady) return;
    script.__tabbiedReady = true;

    var box = script.parentElement;
    if (!box) return;

    var uid = script.getAttribute('data-tabbied');
    var cell = parseInt(script.getAttribute('data-cell') || '48', 10);
    var reseed = parseInt(script.getAttribute('data-reseed') || '0', 10);
    var seed = script.getAttribute('data-seed');
    var source = script.textContent;

    var el = null;
    var current = '';

    function fit() {
      var rect = box.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var g = gridFor(rect.width, rect.height, cell);
      if (g === current) return;
      current = g;

      if (el) {
        el.setAttribute('grid', g);
        return;
      }

      // First usable measurement: build the element at the right grid, so its
      // one and only initial render is already correct.
      el = document.createElement('css-doodle');
      el.setAttribute('data-tabbied', uid);
      el.setAttribute('use', 'var(--rule)');
      el.setAttribute('grid', g);
      // A decorative doodle gets a fresh arrangement on every page load; a
      // pinned seed stays reproducible.
      el.setAttribute('seed', reseed > 0 ? randomSeed() : seed || randomSeed());
      el.textContent = source;
      box.appendChild(el);
      muteFirstDraw(el);
    }

    fit();
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(fit);
      ro.observe(box);
    } else {
      window.addEventListener('resize', fit);
    }

    if (reseed > 0 && !reduceMotion) {
      var visible = true;
      if (typeof IntersectionObserver !== 'undefined') {
        var io = new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        });
        io.observe(box);
      }
      setInterval(function () {
        if (el && visible && !document.hidden) el.setAttribute('seed', randomSeed());
      }, reseed);
    }
  }

  function run() {
    var nodes = document.querySelectorAll('script[type="text/tabbied"]');
    for (var i = 0; i < nodes.length; i++) setup(nodes[i]);
  }

  // Copy an image placeholder's full GPT Image 2 prompt to the clipboard.
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        /* ignore */
      }
      document.body.removeChild(ta);
      done();
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var btn = t.closest('[data-copy-prompt]');
    if (!btn) return;
    var fig = btn.closest('.imgph');
    var text = fig && fig.getAttribute('data-image-prompt');
    if (!text) return;
    copyText(text, function () {
      var original = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', original);
      btn.textContent = '✓ Copied';
      setTimeout(function () {
        btn.textContent = original;
      }, 1600);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
