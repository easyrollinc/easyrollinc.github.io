/* Homepage motion.
   Shop-floor counts come only from data/stats.json.
   Years on the shop floor are the visitor's current calendar year minus
   founded_year. This file does not store a year count. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  var els = Array.prototype.slice.call(document.querySelectorAll("[data-mx]"));
  var targets = {};
  var ready = false;
  var visible = reduce || !("IntersectionObserver" in window);
  var started = false;

  function paint(progress) {
    els.forEach(function (el) {
      var key = el.getAttribute("data-mx");
      var target = targets[key];
      if (typeof target !== "number" || !isFinite(target)) {
        el.textContent = "\u2014";
        return;
      }
      el.textContent = fmt(target * progress);
    });
  }

  function yearsFromFounded(foundedYear) {
    var founded = Number(foundedYear);
    if (!isFinite(founded)) return null;
    var years = new Date().getFullYear() - founded;
    if (years < 0) return 0;
    return years;
  }

  function tryStart() {
    if (!ready || !visible || started) return;
    started = true;
    if (reduce || !("requestAnimationFrame" in window)) {
      paint(1);
      return;
    }
    var t0 = null;
    var duration = 1200;
    (function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      paint(eased);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  var band = document.getElementById("eraHeroNums");
  if (band && !visible) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      visible = true;
      statsObserver.disconnect();
      tryStart();
    }, { threshold: 0.4 });
    statsObserver.observe(band);
  }

  fetch("data/stats.json", { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      if (!data) {
        paint(1);
        return;
      }
      var fixtures = Number(data.fixtures_delivered);
      var programs = Number(data.programs_supported);
      var years = yearsFromFounded(data.founded_year);
      if (isFinite(fixtures)) targets.fixtures_delivered = fixtures;
      if (isFinite(programs)) targets.programs_supported = programs;
      if (years !== null) targets.years_on_the_shop_floor = years;
      ready = true;
      tryStart();
    })
    .catch(function () { paint(1); });

  var story = document.querySelector(".we-story");
  if (story) {
    var steps = story.querySelectorAll(".we-step");
    if (reduce || !("IntersectionObserver" in window)) {
      steps.forEach(function (step) { step.classList.add("in"); });
    } else {
      document.body.classList.add("we-armed");
      var storyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          storyObserver.unobserve(entry.target);
        });
      }, { threshold: 0.25 });
      steps.forEach(function (step) { storyObserver.observe(step); });
      setTimeout(function () {
        steps.forEach(function (step) { step.classList.add("in"); });
      }, 3000);
    }
  }
})();

/* Word-by-word hero, logo is animated in CSS, hero parallax, section titles.
   No-JS and reduced motion leave the type in place and still. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var heading = document.querySelector(".hero h1");
  if (heading) {
    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words.map(function (word, index) {
      var safe = word.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return '<span class="m1-w" style="transition-delay:' + (index * 90) + 'ms">' + safe + "</span>";
    }).join(" ");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heading.classList.add("m1-on"); });
    });
  }

  var heroImage = document.querySelector(".hero-photo img");
  var ticking = false;
  if (heroImage) {
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < 900) heroImage.style.transform = "translateY(" + (y * 0.06) + "px)";
        ticking = false;
      });
    }, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    var titleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        titleObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll("section h2").forEach(function (title) {
      title.classList.add("m1-h2");
      titleObserver.observe(title);
    });
    setTimeout(function () {
      document.querySelectorAll("section h2").forEach(function (title) {
        title.classList.add("in");
      });
    }, 2500);
  }
})();

/* What we build cards: fade and rise as they enter. Reduced motion and
   no-JS leave every card visible and still. */
(function () {
  var cards = document.querySelectorAll(".build-card");
  var section = document.querySelector(".build");
  if (!section || !cards.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function showAll() {
    cards.forEach(function (card) { card.classList.add("in"); });
  }
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }
  section.classList.add("build-armed");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  cards.forEach(function (card) { observer.observe(card); });
  setTimeout(showAll, 3000);
})();
