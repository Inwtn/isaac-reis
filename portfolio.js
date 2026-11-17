(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector(".primary-nav");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js-ready");

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 620) closeMenu();
    });
  }

  var revealItems = document.querySelectorAll(
    ".project-card, .about-grid, .timeline-item, .toolkit-groups > div, .contact-grid"
  );

  revealItems.forEach(function (item) {
    item.setAttribute("data-reveal", "");
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -48px 0px", threshold: 0.08 }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
