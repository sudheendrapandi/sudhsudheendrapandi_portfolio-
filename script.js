/**
 * script.js
 * -----------------------------------------------------------------------
 * General page interactions: mobile menu, active nav link on scroll,
 * reveal-on-scroll for sections, and the contact form submit handler.
 * -----------------------------------------------------------------------
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     --------------------------------------------------------------------- */
  var menuToggle = document.getElementById("nav-menu-toggle");
  var mobilePanel = document.getElementById("nav-mobile-panel");

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuToggle.querySelector(".material-symbols-outlined").textContent = isOpen ? "close" : "menu";
    });

    // Close the mobile panel after choosing a link
    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector(".material-symbols-outlined").textContent = "menu";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Active nav link highlighting based on section in view
     --------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
     Reveal-on-scroll for sections/cards
     --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------------
     Contact form handling (front-end only — swap the fetch() call below
     for your real endpoint/service when ready)
     --------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var successMessage = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending…";

      // Simulate a network request. Replace with a real fetch() to your
      // form backend (e.g. Formspree, a serverless function, etc.).
      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        form.reset();
        if (successMessage) {
          successMessage.classList.add("is-visible");
        }
      }, 700);
    });
  }
})();
