/* ==========================================================================
   Dylan Chen ~ portfolio
   --------------------------------------------------------------------------
   Two small pieces of behaviour, both progressive: the page reads fine with
   this file missing.

     1. The quick-nav rail. Its links are built from whatever <section
        class="project"> blocks exist in <main>, so adding a project to the
        HTML adds it to the nav too, and the entry for the section you are
        looking at is marked as current while you scroll.
     2. The back-to-top button, which stays out of the way until you have
        scrolled past the first screen.

   Everything that moves is driven by CSS classes, so the look lives in
   style.css and the reduced-motion rules there still apply.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.querySelector('.rail');
  var list = document.getElementById('rail-list');
  var toggle = document.querySelector('.rail__toggle');
  var toTop = document.querySelector('.to-top');
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main .project')
  );

  root.classList.add('has-js');

  /* ------------------------------------------------------------------
     Build the rail
     ------------------------------------------------------------------ */

  /* "Wood Lantern with 3D Printed Handle" -> "wood-lantern-with-3d-printed-handle",
     used only when a section has no id of its own. */
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  var links = [];

  if (nav && list && sections.length) {
    sections.forEach(function (section, i) {
      var heading = section.querySelector('h2');
      if (!heading) return;

      if (!section.id) {
        var slug = slugify(heading.textContent);
        var unique = slug;
        var n = 2;
        while (document.getElementById(unique)) unique = slug + '-' + n++;
        section.id = unique;
      }

      /* The number matches the 01, 02, 03 … counter on the headings. */
      var number = String(i + 1);
      if (number.length < 2) number = '0' + number;

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.className = 'rail__link';
      link.href = '#' + section.id;
      link.innerHTML =
        '<span class="rail__tick" aria-hidden="true"></span>' +
        '<span class="rail__num" aria-hidden="true"></span>' +
        '<span class="rail__label"></span>';
      link.querySelector('.rail__num').textContent = number;
      link.querySelector('.rail__label').textContent = heading.textContent.trim();

      item.appendChild(link);
      list.appendChild(item);
      links.push({ link: link, section: section });
    });

    nav.classList.add('is-ready');
  }

  /* ------------------------------------------------------------------
     Which section am I on?
     ------------------------------------------------------------------ */

  var current = -1;

  function setCurrent(index) {
    if (index === current) return;
    if (links[current]) links[current].link.removeAttribute('aria-current');
    if (links[index]) links[index].link.setAttribute('aria-current', 'true');
    current = index;
  }

  function update() {
    var viewport = window.innerHeight;

    /* A section takes over once its top edge crosses the upper third of the
       screen, which is roughly where you stop reading the section above. */
    var line = viewport * 0.3;
    var index = -1;

    for (var i = 0; i < links.length; i++) {
      if (links[i].section.getBoundingClientRect().top <= line) index = i;
    }

    /* The last section is usually too short to ever reach that line, so the
       bottom of the page hands it the highlight. */
    var atBottom =
      window.pageYOffset + viewport >= document.body.scrollHeight - 2;
    if (atBottom && links.length) index = links.length - 1;

    setCurrent(index);

    if (toTop) {
      toTop.classList.toggle('is-visible', window.pageYOffset > viewport * 0.6);
    }
  }

  var queued = false;

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ------------------------------------------------------------------
     The narrow-screen panel
     ------------------------------------------------------------------ */

  if (nav && toggle) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    /* Tapping a section, tapping anywhere else, or Escape all close it. */
    list.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Widen the window past the rail breakpoint and the panel is gone; drop
       the open state so it is not still open on the way back down. */
    var wide = window.matchMedia('(min-width: 75em)');
    var onWide = function (event) {
      if (event.matches) setOpen(false);
    };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }
})();
