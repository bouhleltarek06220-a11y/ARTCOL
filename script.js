/* ===== ARTCOL – Scripts ===== */

(function () {
  'use strict';

  /* ----- Progress bar animation ----- */
  function animateProgressBar() {
    var fill = document.querySelector('.progress-bar__fill');
    var pct  = document.querySelector('.progress-pct');
    if (!fill || !pct) return;

    var target = 15;
    var current = 0;
    var step = target / 60; // 60 frames
    var frameId;

    function tick() {
      current = Math.min(current + step, target);
      fill.style.width = current.toFixed(1) + '%';
      pct.textContent  = Math.round(current) + '%';

      if (current < target) {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Delay slightly so the bar is visible before it starts
    setTimeout(function () {
      requestAnimationFrame(tick);
    }, 600);
  }

  /* ----- Intersection-observer fade-in ----- */
  function setupRevealOnScroll() {
    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.why-card, .vision-list__item, .hero__feature')
      .forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
      });
  }

  /* ----- Start progress bar when the loading section enters view ----- */
  function setupProgressObserver() {
    var section = document.querySelector('.loading-section');
    if (!section) return;

    if (!window.IntersectionObserver) {
      animateProgressBar();
      return;
    }

    var started = false;
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !started) {
          started = true;
          animateProgressBar();
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(section);
  }

  /* ----- Init ----- */
  document.addEventListener('DOMContentLoaded', function () {
    setupRevealOnScroll();
    setupProgressObserver();
  });
})();
