///////////////////////////////////////////////////////////////////////
// BarbaJS
///////////////////////////////////////////////////////////////////////

// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, CustomEase);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
function handleMotionPreference(e) {
  reducedMotion = e.matches;

  if (reducedMotion) {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  } else {
    initLenis();
  }
}

rmMQ.addEventListener?.("change", handleMotionPreference);
rmMQ.addListener?.(handleMotionPreference);

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

let cleanupFunctions = [];

let hasSeoHeaderAnimated = false;

let ufoTransitionPromise = null;

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
CustomEase.create(
  "emphasized",
  "M0,0 C0.05,0 0.133333,0.06 0.166666,0.4 C0.208333,0.82 0.25,1 1,1"
);
CustomEase.create("emphasizedAccelerate", "M0,0 C0.3,0 0.8,0.15 1,1");
gsap.defaults({ ease: "osmo", duration: durationDefault });

// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Runs once on first load
  // if (has('[data-something]')) initSomething();
  initNavMenu();
  initDynamicCurrentYear();
  initNavClickStates();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Runs before the enter animation
  // if (has('[data-something]')) initSomething();
  if (has(".calender-widget")) initCalendarDate();
  if (has(".toc")) initTOC();
  if (has("[data-video-src]")) initVideo();
  if (has("[data-filter-list]:not([data-filter-list=''])")) initFilter();
  if (has("[data-cursor]")) initCursor();
  if (has(".ufo-img")) prepareUfoAnimation();
  if (has("[data-current-year]")) initDynamicCurrentYear();
  if (has(".seo-header")) initSeoHeaderLoader();
  if (has("[data-pp-lens]")) initPpLens();
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Runs after enter animation completes
  // if (has('[data-something]')) initSomething();
  if (has("[data-logo-wall-cycle-init]")) initLogoWallCycle();
  if (has("[data-flick-cards-init]")) initFlickCards();
  if (has("[data-accordion-css-init]")) initAccordionCSS();
  if (has(".projects-item")) initHoverImageFollow();
  if (has("[data-modal-group-status]")) initModal();
  if (has("[data-swiper-group]")) initSwiperSlider();
  if (has(".archive-list-wrapper")) initArchivePreview();
  if (has(".project__btn")) initProjectButtons();
  if (has('[data-tabs="wrapper"]')) initTabSystem();
  if (has(".mwg023")) initImageWall();
  if (has("[data-marquee-scroll-direction-target]"))
    initMarqueeScrollDirection();
  if (has(".achievements__header")) initAchievementsScrollIn();
  if (has(".about-intro")) initAboutIntro();
  if (has("[data-theme-animate-to]")) initThemeScrollTriggers();
  if (has(".ufo-img")) startUfoAnimation();
  if (has("[data-split-scrub]")) initSplitTextScrub();
  if (has("[data-footer-parallax]")) initFooterParallax();
  if (has("[data-camera-timecode]")) initCameraTimecode();
  if (has(".hero-slide")) initHeroParallaxSlider();
  if (has("[data-reveal-group]")) initContentRevealScroll();
  if (has(".process-item")) initProcessNumbers();
  if (has("[data-odometer-group]")) initNumberOdometer();

  if (hasLenis && lenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------


function runPageOnceAnimation(data) {
  const tl = gsap.timeline();

  tl.call(
    () => {
      resetPage(data);
    },
    null,
    0
  );

  return tl;
}

function runPageLeaveAnimation(current, next) {
  const tl = gsap.timeline({
    onComplete: () => {
      current.remove();
    },
  });

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.to(current, { autoAlpha: 0, duration: 0.6 });

  return tl;
}

function runPageEnterAnimation(data) {
  const next = data.next ? data.next.container : data;
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(() => resetPage(data), null, "pageReady");
    return new Promise((resolve) => tl.call(resolve, null, "pageReady"));
  }

  tl.add("startEnter", 0.6);

  tl.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1 }, "startEnter");

  tl.add("pageReady");
  tl.call(() => resetPage(data), null, "pageReady");

  return new Promise((resolve) => {
    tl.call(resolve, null, "pageReady");
  });
}

function runNewsPageLeaveAnimation(current, next) {
  const transitionWrap = document.querySelector("[data-transition-wrap]");
  const transitionDark = transitionWrap.querySelector("[data-transition-dark]");

  const tl = gsap.timeline({
    onComplete: () => {
      current.remove(); 
    }
  })
  
  CustomEase.create("parallax", "0.7, 0.05, 0.13, 1");
  
  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 });
  }
  
  tl.set(transitionWrap, {
    zIndex: 2
  });
  
  tl.fromTo(transitionDark, {
    autoAlpha: 0
  },{
    autoAlpha: 0.8,
    duration: 1.2,
    ease: "parallax"
  }, 0);
  
  tl.fromTo(current,{
    y: "0vh"
  },{
    y: "-25vh",
    duration: 1.2,
    ease: "parallax",
  }, 0);
  
  tl.set(transitionDark, {
    autoAlpha: 0,
  });

  return tl;
}

function runNewsPageEnterAnimation(next){
  const tl = gsap.timeline();
  
  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady")
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }
  
  tl.add("startEnter", 0);
  
  tl.set(next, {
    zIndex: 3
  });
  
  tl.fromTo(next, {
    y: "100vh"
  }, {
    y: "0vh",
    duration: 1.2,
    clearProps: "all",
    ease: "parallax"
  }, "startEnter");

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}
// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

let isTransitioning = false;

barba.hooks.before(() => {
  isTransitioning = true;
});

barba.hooks.beforeEnter((data) => {
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
  });

  if (lenis && typeof lenis.stop === "function") {
    lenis.stop();
  }

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container, true);
});

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  cleanupFunctions.forEach((cleanup) => cleanup());
  cleanupFunctions = [];
});

barba.hooks.enter((data) => {
  initBarbaNavUpdate(data);
});

barba.hooks.afterEnter((data) => {
  initAfterEnterFunctions(data.next.container);

  // Settle
  if (hasLenis && lenis) {
    lenis.resize();
    lenis.start();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
  isTransitioning = false;
});

barba.init({
  debug: true, // Set to 'false' in production
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: "404-transition",
      sync: false,
      custom: ({ current, next }) => {
        return current.namespace === "404" || next.namespace === "404";
      },

      async once(data) {
        initOnceFunctions();
        return runPageOnceAnimation(data);
      },

      async leave(data) {
        if (typeof playUfoOutro === "function") {
          ufoTransitionPromise = playUfoOutro();
          await ufoTransitionPromise;
        }
        return runPageLeaveAnimation(data.current.container);
      },

      async enter(data) {
        if (ufoTransitionPromise) {
          await ufoTransitionPromise;
          ufoTransitionPromise = null;
        }
        return runPageEnterAnimation(data);
      },
    },

    {
      name: "news-transition",
      from: {
        namespace: ["news-overview", "news"]
      },
      to: {
        namespace: ["news", "news-overview"]
      },
      sync: true,

      // First load
      async once(data) {
        initOnceFunctions();

        return runPageOnceAnimation(data.next.container);
      },

      // Current page leaves
      async leave(data) {
        return runNewsPageLeaveAnimation(data.current.container, data.next.container);
      },

      // New page enters
      async enter(data) {
        return runNewsPageEnterAnimation(data.next.container);
      }
    },

    {
      name: "default",
      sync: true,

      // First load
      async once(data) {
        initOnceFunctions();

        return runPageOnceAnimation(data);
      },

      // Current page leaves
      async leave(data) {
        if (typeof playUfoOutro === "function") {
          ufoTransitionPromise = playUfoOutro();
          await ufoTransitionPromise;
        }

        return runPageLeaveAnimation(
          data.current.container,
          data.next.container
        );
      },

      // New page enters
      async enter(data) {
        if (ufoTransitionPromise) {
          await ufoTransitionPromise;
          ufoTransitionPromise = null;
        }

        return runPageEnterAnimation(data);
      },
    },
  ],
});

// -----------------------------------------
// GENERIC + HELPERS
// -----------------------------------------

const themeConfig = {
  light: {
    nav: "dark",
    transition: "light",
  },
  dark: {
    nav: "light",
    transition: "dark",
  },
};

let cachedThemeVars = [];

function getThemeVars() {
  if (cachedThemeVars.length > 0) return cachedThemeVars;

  const vars = new Set();

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (
          rule.selectorText &&
          rule.selectorText.includes("[data-page-theme=")
        ) {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith("--")) {
              vars.add(prop);
            }
          }
        }
      }
    } catch (e) {}
  }

  cachedThemeVars = Array.from(vars);
  return cachedThemeVars;
}

function getResolvedThemeColors(themeName) {
  const dummy = document.createElement("div");
  dummy.dataset.pageTheme = themeName;
  dummy.style.display = "none";
  document.body.appendChild(dummy);

  const colors = {};
  const currentThemeVars = getThemeVars();

  currentThemeVars.forEach((v) => {
    dummy.style.color = `var(${v})`;
    colors[v] = getComputedStyle(dummy).color;
  });

  document.body.removeChild(dummy);
  return colors;
}

function setTheme(themeName, animate = false) {
  const config = themeConfig[themeName] || themeConfig.light;

  const containers = document.querySelectorAll('[data-barba="container"]');
  const elementsToUpdate = [document.body, ...containers];

  const transitionEl = document.querySelector("[data-theme-transition]");
  if (transitionEl) transitionEl.dataset.themeTransition = config.transition;

  const nav = document.querySelector("[data-theme-nav]");
  if (nav) nav.dataset.themeNav = config.nav;

  const currentThemeVars = getThemeVars();
  const propsToClear = currentThemeVars.join(",");

  if (animate) {
    const targetColors = getResolvedThemeColors(themeName);

    gsap.to(elementsToUpdate, {
      ...targetColors,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => {
        document.body.dataset.pageTheme = themeName;
        containers.forEach((c) => (c.dataset.pageTheme = themeName));
        gsap.set(elementsToUpdate, { clearProps: propsToClear });
      },
    });
  } else {
    document.body.dataset.pageTheme = themeName;
    containers.forEach((c) => (c.dataset.pageTheme = themeName));
    gsap.set(elementsToUpdate, { clearProps: propsToClear });
  }
}

function applyThemeFrom(container, animate = false) {
  const pageTheme = container?.dataset?.pageTheme || "light";
  setTheme(pageTheme, animate);
}

let isLenisTickerAdded = false;

function initLenis() {
  if (lenis) return;
  if (!hasLenis) return;
  if (reducedMotion) return;

  lenis = new Lenis({
    prevent: (node) => {
      return (
        node.id === "usercentrics-root" ||
        node.tagName?.toLowerCase() === "usercentrics-root" ||
        node.closest("#usercentrics-root") !== null ||
        node.closest("usercentrics-root") !== null ||
        node.classList?.contains("uc-modal")
      );
    },
  });

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  if (!isLenisTickerAdded) {
    gsap.ticker.add((time) => {
      if (lenis) lenis.raf(time * 1000);
    });
    isLenisTickerAdded = true;
  }

  gsap.ticker.lagSmoothing(0);
}

function resetPage(data) {
  const isDataObject = data && data.next;
  const container = isDataObject ? data.next.container : data;

  window.scrollTo(0, 0);

  gsap.set(container, { clearProps: "position,top,left,right,width" });

  if (hasLenis && lenis) {
    lenis.resize();
    lenis.scrollTo(0, { immediate: true });
    lenis.start();
  }
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement("template");
  tpl.innerHTML = data.next.html.trim();
  var nextNodes = tpl.content.querySelectorAll("[data-barba-update]");
  var currentNodes = document.querySelectorAll("nav [data-barba-update]");

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index];
    if (!next) return;

    // Aria-current sync
    var newStatus = next.getAttribute("aria-current");
    if (newStatus !== null) {
      curr.setAttribute("aria-current", newStatus);
    } else {
      curr.removeAttribute("aria-current");
    }

    // Class list sync
    var newClassList = next.getAttribute("class") || "";
    curr.setAttribute("class", newClassList);
  });
}

function registerCleanup(fn) {
  if (typeof fn === "function") {
    cleanupFunctions.push(fn);
  }
}

// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------

function initThemeScrollTriggers() {
  if (!hasScrollTrigger) return;

  const triggerSections = nextPage.querySelectorAll("[data-theme-animate-to]");

  triggerSections.forEach((section) => {
    const targetTheme = section.getAttribute("data-theme-animate-to");

    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => {
        if (!isTransitioning) setTheme(targetTheme, true);
      },
      onEnterBack: () => {
        if (!isTransitioning) setTheme(targetTheme, true);
      },
    });
  });
}

function initDynamicCurrentYear() {
  const currentYear = new Date().getFullYear();
  const currentYearElements = document.querySelectorAll("[data-current-year]");
  if (!currentYearElements.length) return;
  currentYearElements.forEach((currentYearElement) => {
    currentYearElement.textContent = currentYear;
  });
}

function initNavMenu() {
  const navContainer = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-menu_toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!navToggle || !navMenu || !navContainer) {
    return;
  }

  let isMobileMode = false;
  let menuOpen = false;
  let navMenuAnimation = null;
  let navLinks = null;

  // NEU: ARIA - Dem Menü eine ID geben, falls es noch keine hat
  // Das ist nötig, damit aria-controls auf dem Button funktioniert
  const menuId = "mobile-nav-menu";
  if (!navMenu.id) {
    navMenu.id = menuId;
  }

  function trapFocus(e) {
    if (e.key === "Escape" && menuOpen) {
      handleMenuToggle(e);
      return;
    }

    if (e.key !== "Tab") return;

    const focusableElements = Array.from(
      navContainer.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      return (
        el.offsetWidth > 0 ||
        el.offsetHeight > 0 ||
        el.getClientRects().length > 0
      );
    });

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  const handleMenuToggle = function (e) {
    if (e) e.preventDefault();

    if (!menuOpen) {
      // Menü ÖFFNEN
      navMenu.style.display = "block";
      navMenu.classList.remove("disabled");
      if (typeof lenis !== "undefined") lenis.stop();
      navMenuAnimation.play();
      menuOpen = true;

      // NEU: ARIA - Status auf "geöffnet" setzen
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Menü schließen");

      document.addEventListener("keydown", trapFocus);

      setTimeout(() => {
        navMenu.setAttribute("tabindex", "-1");
        navMenu.style.outline = "none";
        navMenu.focus({ preventScroll: true });
      }, 100);
    } else {
      // Menü SCHLIESSEN
      navMenuAnimation.reverse();
      menuOpen = false;
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Menü öffnen");

      document.removeEventListener("keydown", trapFocus);
      navToggle.focus();
    }
  };

  function checkResponsiveMenu() {
    const navToggleStyle = window.getComputedStyle(navToggle);

    // 1. Mobile-Modus
    if (navToggleStyle.display !== "none" && !isMobileMode) {
      isMobileMode = true;

      // NEU: ARIA - Initiale Attribute für den Mobile-Button setzen
      navToggle.setAttribute("aria-controls", menuId);
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Menü öffnen");

      // Verhindern, dass Screenreader das geschlossene Menü im Hintergrund vorlesen
      navMenu.setAttribute("aria-hidden", "true");

      navMenuAnimation = gsap.timeline({
        paused: true,
        onStart: () => {
          // NEU: ARIA - Menü für Screenreader sichtbar machen
          navMenu.removeAttribute("aria-hidden");
        },
        onReverseComplete: () => {
          navMenu.style.display = "";
          navMenu.classList.add("disabled");
          // NEU: ARIA - Menü für Screenreader wieder verstecken
          navMenu.setAttribute("aria-hidden", "true");
          if (typeof lenis !== "undefined") lenis.start();
        },
      });

      navLinks = SplitText.create(".nav-menu_link", {
        type: "words",
        mask: "words",
        wordsClass: "word",
      });

      navMenuAnimation
        .from(navMenu, { duration: 0.5, opacity: 0, ease: "quint.inOut" })
        .to(".dot-1", { x: 4, duration: 0.3, ease: "back.in" }, "<")
        .to(".dot-3", { x: -4, duration: 0.3, ease: "back.in" }, "<")
        .to(".dot-1", { x: 0, y: -4, duration: 0.3, ease: "back.out" })
        .to(".dot-2", { x: -4, y: 4, duration: 0.3, ease: "back.out" }, "<")
        .to(".dot-4", { x: 4, y: -4, duration: 0.3, ease: "back.out" }, "<")
        .to(".dot-5", { x: 4, y: 4, duration: 0.3, ease: "back.out" }, "<")
        .from(
          navLinks.words,
          {
            opacity: 0,
            yPercent: 50,
            duration: 0.5,
            stagger: 0.1,
            ease: "quint.out",
          },
          ">-0.3"
        )
        .from(
          ".nav-menu_mail",
          { opacity: 0, yPercent: 50, duration: 0.5, ease: "quint.out" },
          "<0.2"
        )
        .from(
          ".nav-menu_legal",
          { opacity: 0, yPercent: 50, duration: 0.5, ease: "quint.out" },
          "<0.2"
        );

      navToggle.addEventListener("click", handleMenuToggle);
    }

    // 2. Desktop-Modus
    else if (navToggleStyle.display === "none" && isMobileMode) {
      isMobileMode = false;

      navToggle.removeEventListener("click", handleMenuToggle);

      if (navMenuAnimation) {
        if (navMenuAnimation.revert) {
          navMenuAnimation.revert();
        } else {
          navMenuAnimation.kill();
        }
      }

      gsap.set(
        [
          navMenu,
          ".dot-1",
          ".dot-2",
          ".dot-3",
          ".dot-4",
          ".dot-5",
          ".nav-menu_mail",
          ".nav-menu_legal",
        ],
        { clearProps: "all" }
      );

      if (navLinks) navLinks.revert();

      menuOpen = false;
      document.removeEventListener("keydown", trapFocus);
      navMenu.style.display = "";
      navMenu.classList.add("disabled");
      navMenu.removeAttribute("aria-hidden");

      if (typeof lenis !== "undefined") lenis.start();
    }
  }

  checkResponsiveMenu();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkResponsiveMenu, 200);
  });

  if (typeof barba !== "undefined") {
    barba.hooks.beforeLeave(() => {
      if (menuOpen && navMenuAnimation) {
        navMenuAnimation.reverse();
        menuOpen = false;

        // NEU: ARIA - Beim Seitenwechsel Status zurücksetzen
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Menü öffnen");

        document.removeEventListener("keydown", trapFocus);
      }
    });
  }
}

function initLogoWallCycle() {
  const loopDelay = 2.5; // Loop Duration
  const duration = 0.8; // Animation Duration

  nextPage.querySelectorAll("[data-logo-wall-cycle-init]").forEach((root) => {
    const list = root.querySelector("[data-logo-wall-list]");
    const items = Array.from(list.querySelectorAll("[data-logo-wall-item]"));

    const shuffleFront =
      root.getAttribute("data-logo-wall-shuffle") !== "false";
    const originalTargets = items
      .map((item) => item.querySelector("[data-logo-wall-target]"))
      .filter(Boolean);

    let visibleItems = [];
    let visibleCount = 0;
    let pool = [];
    let pattern = [];
    let patternIndex = 0;
    let tl;

    function isVisible(el) {
      return window.getComputedStyle(el).display !== "none";
    }

    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setup() {
      if (tl) {
        tl.kill();
      }
      visibleItems = items.filter(isVisible);
      visibleCount = visibleItems.length;

      pattern = shuffleArray(Array.from({ length: visibleCount }, (_, i) => i));
      patternIndex = 0;

      // remove all injected targets
      items.forEach((item) => {
        item
          .querySelectorAll("[data-logo-wall-target]")
          .forEach((old) => old.remove());
      });

      pool = originalTargets.map((n) => n.cloneNode(true));

      let front, rest;
      if (shuffleFront) {
        const shuffledAll = shuffleArray(pool);
        front = shuffledAll.slice(0, visibleCount);
        rest = shuffleArray(shuffledAll.slice(visibleCount));
      } else {
        front = pool.slice(0, visibleCount);
        rest = shuffleArray(pool.slice(visibleCount));
      }
      pool = front.concat(rest);

      for (let i = 0; i < visibleCount; i++) {
        const parent =
          visibleItems[i].querySelector("[data-logo-wall-target-parent]") ||
          visibleItems[i];
        parent.appendChild(pool.shift());
      }

      tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay });
      tl.call(swapNext);
      tl.play();
    }

    function swapNext() {
      const nowCount = items.filter(isVisible).length;
      if (nowCount !== visibleCount) {
        setup();
        return;
      }
      if (!pool.length) return;

      const idx = pattern[patternIndex % visibleCount];
      patternIndex++;

      const container = visibleItems[idx];
      const parent =
        container.querySelector("[data-logo-wall-target-parent]") ||
        container.querySelector("*:has(> [data-logo-wall-target])") ||
        container;
      const existing = parent.querySelectorAll("[data-logo-wall-target]");
      if (existing.length > 1) return;

      const current = parent.querySelector("[data-logo-wall-target]");
      const incoming = pool.shift();

      gsap.set(incoming, { yPercent: 25, autoAlpha: 0 });
      parent.appendChild(incoming);

      if (current) {
        gsap.to(current, {
          yPercent: -25,
          autoAlpha: 0,
          duration,
          ease: "expo.out",
          onComplete: () => {
            current.remove();
            pool.push(current);
          },
        });
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        delay: 0.1,
        ease: "expo.out",
      });
    }

    setup();

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => tl.play(),
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause(),
    });

    nextPage.addEventListener("visibilitychange", () =>
      nextPage.hidden ? tl.pause() : tl.play()
    );
  });
}

function initFlickCards() {
  const sliders = nextPage.querySelectorAll("[data-flick-cards-init]");

  sliders.forEach((slider) => {
    const list = slider.querySelector("[data-flick-cards-list]");
    const cards = Array.from(list.querySelectorAll("[data-flick-cards-item]"));
    const total = cards.length;
    let activeIndex = 0;

    let sliderWidth = slider.offsetWidth;
    const threshold = 0.1;

    // Dragger & Accessibility Setup
    const draggers = [];
    cards.forEach((card, index) => {
      // 1. Accessibility: Sag dem Browser, dass die Karte wie ein Button funktioniert
      card.setAttribute("role", "button");

      // 2. Erlaube Enter & Leertaste zum Klicken
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click(); // Löst dein Modal aus!
        }
      });

      // --- NEU: FOKUS-SYNCHRONISATION ---
      // Wenn eine Karte den Fokus erhält (z.B. durch die Tab-Taste),
      // wird sie automatisch zur aktiven/vordersten Karte.
      card.addEventListener("focus", () => {
        if (activeIndex !== index) {
          activeIndex = index;
          renderCards(activeIndex);
        }
      });
      // ----------------------------------

      const dragger = document.createElement("div");
      dragger.setAttribute("data-flick-cards-dragger", "");
      card.appendChild(dragger);
      draggers.push(dragger);
    });

    // Set initial drag status
    slider.setAttribute("data-flick-drag-status", "grab");

    function getConfig(i, currentIndex) {
      // ... (Dein Switch-Case bleibt hier exakt gleich) ...
      let diff = i - currentIndex;

      switch (diff) {
        case 0:
          return { x: 0, rot: 0, s: 1.0, o: 1, z: 5, y: 0 };
        case 1:
          return { x: 15, rot: 4, s: 0.9, o: 1, z: 4, y: 0 };
        case -1:
          return { x: -15, rot: -4, s: 0.9, o: 1, z: 4, y: 0 };
        case 2:
          return { x: 27.5, rot: 8, s: 0.8, o: 1, z: 3, y: 0 };
        case -2:
          return { x: -27.5, rot: -8, s: 0.8, o: 1, z: 3, y: 0 };
        case 3:
          return { x: 37.5, rot: 12, s: 0.7, o: 1, z: 2, y: 0 };
        case -3:
          return { x: -37.5, rot: -12, s: 0.7, o: 1, z: 2, y: 0 };
        case 4:
          return { x: 45, rot: 16, s: 0.6, o: 1, z: 1, y: 0 };
        case -4:
          return { x: -45, rot: -16, s: 0.6, o: 1, z: 1, y: 0 };
        default: {
          const dir = diff > 0 ? 1 : -1;
          return { x: 45 * dir, rot: 16 * dir, s: 0.5, o: 0, z: 0, y: 0 };
        }
      }
    }

    function statusFromDiff(diff) {
      // ... (Bleibt exakt gleich) ...
      if (diff === 0) return "active";
      if (diff === 1) return "2-after";
      if (diff === -1) return "2-before";
      if (diff === 2) return "3-after";
      if (diff === -2) return "3-before";
      if (diff === 3) return "4-after";
      if (diff === -3) return "4-before";
      if (diff === 4) return "5-after";
      if (diff === -4) return "5-before";
      return "hidden";
    }

    function renderCards(currentIndex) {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex);
        const diff = i - currentIndex;

        card.setAttribute("data-flick-cards-item-status", statusFromDiff(diff));
        card.style.zIndex = cfg.z;

        // Opacity nicht tweenen
        card.style.opacity = cfg.o;
        card.style.pointerEvents = cfg.o === 0 ? "none" : "";

        // Nur sichtbare Karten können per Tab erreicht werden!
        card.setAttribute("tabindex", cfg.o > 0 ? "0" : "-1");

        gsap.killTweensOf(card);
        gsap.to(card, {
          duration: 0.6,
          ease: "elastic.out(1.5, 1.4)",
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
        });
      });

      slider.toggleAttribute("data-flick-can-left", activeIndex < total - 1);
      slider.toggleAttribute("data-flick-can-right", activeIndex > 0);
    }

    // Initial ohne Animation
    renderCards(activeIndex);

    let pressX = 0,
      pressY = 0;

    Draggable.create(draggers, {
      // ... (Dein kompletter Draggable-Code bleibt unverändert) ...
      type: "x",
      edgeResistance: 0.85,
      inertia: false,

      onPress() {
        sliderWidth = slider.offsetWidth;
        this.applyBounds({ minX: -sliderWidth / 2, maxX: sliderWidth / 2 });

        pressX = this.pointerX;
        pressY = this.pointerY;
        slider.setAttribute("data-flick-drag-status", "grabbing");
      },

      onDrag() {
        const raw = this.x / sliderWidth;
        const goingLeft = raw < 0;
        let next = activeIndex + (goingLeft ? 1 : -1);
        next = Math.max(0, Math.min(total - 1, next));

        const allowed =
          (goingLeft && activeIndex < total - 1) ||
          (!goingLeft && activeIndex > 0);
        const progress = allowed ? Math.min(1, Math.abs(raw)) : 0;

        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex);
          const to = getConfig(i, next);
          const mix = (p) => from[p] + (to[p] - from[p]) * progress;

          gsap.set(card, {
            xPercent: mix("x"),
            yPercent: mix("y"),
            rotation: mix("rot"),
            scale: mix("s"),
          });

          const visFrom = from.o === 1;
          const visTo = to.o === 1;
          card.style.opacity = visFrom || visTo ? 1 : 0;
          card.style.pointerEvents = card.style.opacity === "0" ? "none" : "";
        });
      },

      onRelease() {
        slider.setAttribute("data-flick-drag-status", "grab");

        const releaseX = this.pointerX;
        const releaseY = this.pointerY;
        const dragDistance = Math.hypot(releaseX - pressX, releaseY - pressY);
        const raw = this.x / sliderWidth;

        if (raw < -threshold && activeIndex < total - 1) {
          activeIndex += 1;
        } else if (raw > threshold && activeIndex > 0) {
          activeIndex -= 1;
        }

        renderCards(activeIndex);

        gsap.to(this.target, { x: 0, duration: 0.3, ease: "power1.out" });

        if (dragDistance < 4) {
          this.target.style.pointerEvents = "none";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(releaseX, releaseY);
              if (el) {
                el.dispatchEvent(
                  new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                  })
                );
              }
              this.target.style.pointerEvents = "auto";
            });
          });
        }
      },
    });

    // --- HOVER & FOCUS ERKENNUNG ---
    let isHovered = false;
    slider.addEventListener("mouseenter", () => (isHovered = true));
    slider.addEventListener("mouseleave", () => (isHovered = false));
    // --- KEYBOARD NAVIGATION ---
    document.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;
      if (slider.offsetWidth === 0) return;

      const isFocused = slider.contains(document.activeElement);
      if (!isHovered && !isFocused) return;

      const activeTag = document.activeElement.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

      if (e.key === "Enter") {
        if (document.activeElement !== cards[activeIndex]) {
          e.preventDefault();
          cards[activeIndex].click();
        }
        return;
      }

      // Pfeiltasten-Logik
      if (e.key === "ArrowRight") {
        if (activeIndex < total - 1) {
          activeIndex += 1;
          renderCards(activeIndex);

          if (isFocused) {
            cards[activeIndex].focus();
          }
          e.preventDefault();
        }
      } else if (e.key === "ArrowLeft") {
        if (activeIndex > 0) {
          activeIndex -= 1;
          renderCards(activeIndex);

          if (isFocused) {
            cards[activeIndex].focus();
          }
          e.preventDefault();
        }
      }
    });

    // Responsiv
    const ro = new ResizeObserver(() => {
      sliderWidth = slider.offsetWidth;
    });
    ro.observe(slider);
  });
}

function initAccordionCSS() {
  nextPage
    .querySelectorAll("[data-accordion-css-init]")
    .forEach((accordion) => {
      const closeSiblings =
        accordion.getAttribute("data-accordion-close-siblings") === "true";

      accordion.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-accordion-toggle]");
        if (!toggle) return; // Exit if the clicked element is not a toggle

        const singleAccordion = toggle.closest("[data-accordion-status]");
        if (!singleAccordion) return; // Exit if no accordion container is found

        const isActive =
          singleAccordion.getAttribute("data-accordion-status") === "active";
        singleAccordion.setAttribute(
          "data-accordion-status",
          isActive ? "not-active" : "active"
        );

        // When [data-accordion-close-siblings="true"]
        if (closeSiblings && !isActive) {
          accordion
            .querySelectorAll('[data-accordion-status="active"]')
            .forEach((sibling) => {
              if (sibling !== singleAccordion)
                sibling.setAttribute("data-accordion-status", "not-active");
            });
        }
      });
    });
}

function initCalendarDate() {
  const calenderWidget = nextPage.querySelector(".calender-widget");
  const dayLettersEl = nextPage.querySelector(".calender-icon-date-letters");
  const dayNumberEl = nextPage.querySelector(".calender-icon-date-number");

  if (!calenderWidget) return;

  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const today = new Date();
  const day = days[today.getDay()];
  const date = today.getDate().toString().padStart(2, "0");

  dayLettersEl.textContent = day;
  dayNumberEl.textContent = date;
}

function initHoverImageFollow() {
  const isHoverSupported = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;
  if (!isHoverSupported) return;

  const hoverImageTargets = nextPage.querySelectorAll(
    "[data-hover-image-target]"
  );

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  hoverImageTargets.forEach((hoverImageTarget) => {
    const hoverImage = hoverImageTarget.querySelector("[data-hover-image]");
    if (!hoverImage) return;

    const video = hoverImage.querySelector("video");
    let pauseTimeout;
    let playTimeout;

    if (video) {
      let src =
        hoverImage.getAttribute("data-video-src") ||
        video.getAttribute("data-video-src");

      if (src && !video.src) {
        video.src = src;

        if (typeof video.load === "function") {
          video.load();
        }
      }

      hoverImageTarget.addEventListener("mouseenter", () => {
        clearTimeout(pauseTimeout);
        playTimeout = setTimeout(() => {
          video
            .play()
            .catch((err) =>
              console.log("Video konnte nicht abgespielt werden:", err)
            );
        }, 100);
      });

      hoverImageTarget.addEventListener("mouseleave", () => {
        clearTimeout(playTimeout);
        pauseTimeout = setTimeout(() => {
          video.pause();
        }, 600);
      });
    }

    const padding = parseFloat(hoverImageTarget.dataset.padding) || 48;

    gsap.set(hoverImage, {
      left: 0,
      top: 0,
      xPercent: -50,
      yPercent: -50,
    });

    const xTo = gsap.quickTo(hoverImage, "x", {
      duration: 0.8,
      ease: "power2.out",
    });
    const yTo = gsap.quickTo(hoverImage, "y", {
      duration: 0.8,
      ease: "power2.out",
    });

    let imgW = hoverImage.offsetWidth;
    let imgH = hoverImage.offsetHeight;

    const updatePosition = () => {
      const rect = hoverImageTarget.getBoundingClientRect();

      const localX = mouseX - rect.left;
      const localY = mouseY - rect.top;

      const halfW = imgW / 2;
      const halfH = imgH / 2;

      const cx = Math.max(
        padding + halfW,
        Math.min(localX, rect.width - padding - halfW)
      );
      const cy = Math.max(
        padding + halfH,
        Math.min(localY, rect.height - padding - halfH)
      );

      xTo(cx);
      yTo(cy);
    };

    hoverImageTarget._update = updatePosition;
    hoverImageTarget._resize = () => {
      imgW = hoverImage.offsetWidth;
      imgH = hoverImage.offsetHeight;
    };

    updatePosition();
  });

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverImageTargets.forEach((hoverImageTarget) => hoverImageTarget._update());
  });

  window.addEventListener(
    "scroll",
    () => {
      hoverImageTargets.forEach((hoverImageTarget) =>
        hoverImageTarget._update()
      );
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    hoverImageTargets.forEach((hoverImageTarget) => {
      hoverImageTarget._resize();
      hoverImageTarget._update();
    });
  });
}

function initModal() {
  let modalLenis = null;
  let animationFrameId = null;
  let previousActiveElement = null; // Speichert das Element, das das Modal geöffnet hat

  const modalGroup = nextPage.querySelector("[data-modal-group-status]");
  const modals = nextPage.querySelectorAll("[data-modal-name]");
  const modalTargets = nextPage.querySelectorAll("[data-modal-target]");
  const closeButtons = nextPage.querySelectorAll("[data-modal-close]");

  // Liste aller Elemente, die per Tab anvisiert werden können
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  // Scroll ControlnextPage
  const lockScroll = () => {
    // Falls lenis global definiert ist
    if (typeof lenis !== "undefined") lenis.stop();
    document.body.classList.add("modal-open");
  };

  const unlockScroll = () => {
    document.body.classList.remove("modal-open");
    if (typeof lenis !== "undefined") lenis.start();
  };

  // Modal Lenis (Dein bestehender Code)
  const initModalLenis = (modal) => {
    const modalScroll = modal.querySelector(".modal__scroll");
    if (!modalScroll || modalLenis) return;

    modalScroll.classList.add("lenis");
    modalLenis = new Lenis({
      wrapper: modalScroll,
      content: modalScroll,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const rafModal = (time) => {
      if (modalLenis) {
        modalLenis.raf(time);
        animationFrameId = requestAnimationFrame(rafModal);
      }
    };
    animationFrameId = requestAnimationFrame(rafModal);
  };

  const destroyModalLenis = () => {
    if (!modalLenis) return;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    const modalScroll = document.querySelector(".modal__scroll");
    if (modalScroll) {
      modalScroll.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
    }
    modalLenis.destroy();
    modalLenis = null;
  };

  // Open Modal
  const openModal = (modalName) => {
    // 1. Speichere das aktuell fokussierte Element (den Button, der geklickt wurde)
    previousActiveElement = document.activeElement;

    modalTargets.forEach((target) =>
      target.setAttribute("data-modal-status", "not-active")
    );
    modals.forEach((modal) =>
      modal.setAttribute("data-modal-status", "not-active")
    );

    const targetBtn = document.querySelector(
      `[data-modal-target="${modalName}"]`
    );
    const activeModal = document.querySelector(
      `[data-modal-name="${modalName}"]`
    );

    if (targetBtn) targetBtn.setAttribute("data-modal-status", "active");
    if (activeModal) activeModal.setAttribute("data-modal-status", "active");
    if (modalGroup)
      modalGroup.setAttribute("data-modal-group-status", "active");

    lockScroll();
    if (activeModal) {
      initModalLenis(activeModal);

      setTimeout(() => {
        const modalContent = activeModal.querySelector(".modal__content");

        if (modalContent) {
          modalContent.setAttribute("tabindex", "0");
          modalContent.style.outline = "none";
          modalContent.focus();
        } else {
          const focusableElements = activeModal.querySelectorAll(
            focusableElementsString
          );
          if (focusableElements.length) focusableElements[0].focus();
        }
      }, 50);
    }
  };

  // Close Modal
  const closeModal = () => {
    modalTargets.forEach((target) =>
      target.setAttribute("data-modal-status", "not-active")
    );
    modals.forEach((modal) =>
      modal.setAttribute("data-modal-status", "not-active")
    );

    if (modalGroup) {
      modalGroup.setAttribute("data-modal-group-status", "not-active");
    }

    destroyModalLenis();
    unlockScroll();

    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const activeModal = document.querySelector(
        '[data-modal-status="active"].modal__card'
      );
      if (!activeModal) return;

      const focusableElements = activeModal.querySelectorAll(
        focusableElementsString
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  modalTargets.forEach((target) => {
    target.addEventListener("click", function () {
      openModal(this.getAttribute("data-modal-target"));
    });
  });

  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  document.addEventListener("keydown", handleKeyDown);

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");

      if (link && link.getAttribute("target") !== "_blank") {
        closeModal();
      }
    });
  });

  // Public API (optional)
  return {
    open: openModal,
    close: closeModal,
  };
}

function initSeoHeaderLoader() {
  const context =
    typeof nextPage !== "undefined" && nextPage ? nextPage : document;
  const container = context.querySelector(".seo-header");

  if (!container) return;

  const nav = document.querySelectorAll(".nav");
  const loadingLetter = container.querySelectorAll(".seo__letter");
  const box = container.querySelectorAll(".seo-loader__box");
  const growingImage = container.querySelectorAll(".seo__growing-image");
  const headingStart = container.querySelectorAll(".seo__h1-start");
  const headingEnd = container.querySelectorAll(".seo__h1-end");
  const coverImageExtra = container.querySelectorAll(".seo__cover-image-extra");
  const heroHeadline = container.querySelector(".seo-heading");
  const heroParagraph = container.querySelector(".seo__p");
  const heroCTA = container.querySelector(".cta-button");

  if (onceFunctionsInitialized && !hasSeoHeaderAnimated) {
    hasSeoHeaderAnimated = true;
  }

  if (hasSeoHeaderAnimated) {
    container.classList.remove("is--hidden", "is--loading");

    if (heroCTA) gsap.set(heroCTA, { clearProps: "all" });

    if (box.length) gsap.set(box, { width: "110vw" });
    if (growingImage.length)
      gsap.set(growingImage, { width: "100vw", height: "100svh" });
    if (headingStart.length) gsap.set(headingStart, { x: "-0.05em" });
    if (headingEnd.length) gsap.set(headingEnd, { x: "0.05em" });
    if (coverImageExtra.length) gsap.set(coverImageExtra, { opacity: 0 });

    if (nav.length) {
      gsap.set(nav, { clearProps: "transform" });
      nav.forEach((el) => el.classList.add("is--visible"));
    }

    if (typeof lenis !== "undefined" && lenis) lenis.start();

    return;
  }

  hasSeoHeaderAnimated = true;

  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  let isInitialized = false;

  document.fonts.ready.then(() => {
    if (isInitialized) return;
    isInitialized = true;

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => {
        container.classList.remove("is--hidden");
        if (typeof lenis !== "undefined" && lenis) lenis.stop();
      },
      onComplete: () => {
        container.classList.remove("is--loading");
        if (typeof lenis !== "undefined" && lenis) lenis.start();
        ScrollTrigger.refresh();
      },
    });

    if (loadingLetter.length) {
      tl.from(loadingLetter, { yPercent: 100, stagger: 0.025, duration: 1.25 });
    }

    if (box.length) {
      tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1 }, "<+=1");
    }

    if (growingImage.length) {
      tl.fromTo(
        growingImage,
        { width: "0%" },
        { width: "100%", duration: 1 },
        "<"
      );
    }

    if (headingStart.length) {
      tl.fromTo(headingStart, { x: "0em" }, { x: "-0.05em", duration: 1 }, "<");
    }

    if (headingEnd.length) {
      tl.fromTo(
        headingEnd,
        { x: "0em", ease: "expo.out" },
        { x: "0.05em", duration: 1 },
        "<"
      );
    }

    if (coverImageExtra.length) {
      tl.fromTo(
        coverImageExtra,
        { opacity: 1 },
        { opacity: 0, duration: 0.05, ease: "none", stagger: 0.25 },
        "-=0.05"
      );
    }

    if (growingImage.length) {
      tl.to(
        growingImage,
        { width: "100vw", height: "100svh", duration: 2 },
        "<+=0.25"
      );
    }

    if (box.length) {
      tl.to(box, { width: "110vw", duration: 2 }, "<");
    }

    if (nav.length) {
      tl.to(
        nav,
        {
          yPercent: 100,
          duration: 2,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(nav, { clearProps: "transform" });
            nav.forEach((el) => el.classList.add("is--visible"));
          },
        },
        "-=1"
      );
    }

    if (heroHeadline) {
      SplitText.create(heroHeadline, {
        type: "words, lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) => {
          let split = gsap.from(self.lines, {
            duration: 1.2,
            yPercent: 120,
            stagger: 0.08,
            ease: "expo.out",
          });
          tl.add(split, "-=1.8");
        },
      });
    }

    if (heroParagraph) {
      SplitText.create(heroParagraph, {
        type: "words, lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) => {
          let split = gsap.from(self.lines, {
            duration: 1.2,
            yPercent: 120,
            stagger: 0.04,
            ease: "expo.out",
          });
          tl.add(split, "-=1.6");
        },
      });
    }

    if (heroCTA) {
      tl.fromTo(
        heroCTA,
        {
          yPercent: 50,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          clearProps: "transform",
        },
        "-=1.4"
      );
    }

    tl.call(
      () => {
        container.classList.remove("is--loading");
        if (typeof lenis !== "undefined" && lenis) lenis.start();
      },
      null,
      "-=1.25"
    );
  });
}

function initSwiperSlider() {
  const swiperSliderGroups = nextPage.querySelectorAll("[data-swiper-group]");
  if (!swiperSliderGroups.length) return;

  const swiperInstances = [];

  // Debounce für Performance
  const debounce = (func, wait) => {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  // Gap-Wert direkt aus CSS Variable
  const getGapInPixels = (wrapper) => {
    if (!wrapper) return 0;

    const gapElement = wrapper.querySelector("[data-swiper-gap]");
    if (!gapElement) return 0;

    const gapValue = getComputedStyle(gapElement)
      .getPropertyValue("--gap")
      .trim();

    if (!gapValue) return 0;

    // Wert in Pixel umrechnen
    const tempEl = document.createElement("div");
    tempEl.style.cssText = `position:absolute;visibility:hidden;width:${gapValue}`;
    gapElement.appendChild(tempEl);

    const pixelValue = tempEl.offsetWidth;
    gapElement.removeChild(tempEl);

    return pixelValue;
  };

  // Swiper initialisieren
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if (!swiperSliderWrap) return;

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    const pagination = swiperGroup.querySelector("[data-swiper-pagination]");

    const initialGap = getGapInPixels(swiperSliderWrap);

    const slideCount =
      swiperSliderWrap.querySelectorAll(".swiper-slide").length;

    const shouldLoop = slideCount > 3;

    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      loop: shouldLoop,
      watchOverflow: true,
      spaceBetween: initialGap,
      speed: 800,
      a11y: {
        slideRole: "listitem",
      },
      mousewheel: {
        forceToAxis: true,
      },
      grabCursor: true,
      breakpoints: {
        480: {
          slidesPerView: 1.8,
          spaceBetween: initialGap,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: initialGap,
        },
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: pagination,
        type: "bullets",
        clickable: false,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });

    swiperInstances.push({
      swiper,
      wrapper: swiperSliderWrap,
    });
  });

  const updateAllGaps = debounce(() => {
    swiperInstances.forEach(({ swiper, wrapper }) => {
      const newGap = getGapInPixels(wrapper);

      swiper.params.spaceBetween = newGap;

      if (swiper.params.breakpoints) {
        Object.keys(swiper.params.breakpoints).forEach((breakpoint) => {
          swiper.params.breakpoints[breakpoint].spaceBetween = newGap;
        });
      }

      swiper.update();
    });
  }, 100);

  window.addEventListener("resize", updateAllGaps);

  return {
    instances: swiperInstances,
    update: updateAllGaps,
  };
}

function initTOC() {
  const toc = nextPage.querySelector(".toc");
  const article = nextPage.querySelector(".u-rich-text");

  const tocContainer = nextPage.querySelector("#toc");
  const tocHeadline = tocContainer
    ? tocContainer.querySelector(".toc__headline")
    : null;

  if (!toc || !article || !tocContainer) return;

  const createTOC = () => {
    const headings = article.querySelectorAll("h2, h3, h4");
    if (headings.length === 0) return;

    const existingUl = tocContainer.querySelector("ul");
    if (existingUl) existingUl.remove();

    const rootUl = document.createElement("ul");
    let stack = [{ ul: rootUl, level: 1 }];

    headings.forEach((heading) => {
      const title = heading.textContent.trim();
      const anchorId = title.toLowerCase().replace(/\s+/g, "-");
      const level = parseInt(heading.tagName.charAt(1), 10);

      heading.id = anchorId;

      while (stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const currentUl = stack[stack.length - 1].ul;

      const li = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.textContent = title;
      anchor.href = `#${anchorId}`;
      li.appendChild(anchor);
      currentUl.appendChild(li);

      const childUl = document.createElement("ul");
      li.appendChild(childUl);
      stack.push({ ul: childUl, level: level });
    });

    rootUl.querySelectorAll("ul:empty").forEach((ul) => ul.remove());

    tocHeadline.insertAdjacentElement("afterend", rootUl);

    requestAnimationFrame(() => {
      tocContainer.classList.add("toc--ready");
    });
  };

  const initTOCSmoothScroll = () => {
    const tocItems = nextPage.querySelectorAll("#toc a");

    tocItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = item.getAttribute("href").substring(1);

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offset =
            targetElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      });
    });
  };

  const initTOCOffset = () => {
    const offsetAnchor = () => {
      if (location.hash.length !== 0) {
        const targetId = location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = targetElement.getBoundingClientRect().top - 100;
          window.scrollTo(window.scrollX, window.scrollY + offset);
        }
      }
    };

    window.removeEventListener("hashchange", window._tocOffsetAnchor);
    window._tocOffsetAnchor = offsetAnchor;
    window.addEventListener("hashchange", window._tocOffsetAnchor);

    window.setTimeout(offsetAnchor, 1);
  };

  createTOC();
  initTOCSmoothScroll();
  initTOCOffset();
}

function initArchivePreview() {
  const listContainer = document.querySelector(".archive-list-wrapper");
  if (!listContainer) return;

  const items = listContainer.querySelectorAll("[data-filter-item]");
  const inner = listContainer.querySelector("[data-archive-inner]");
  const stage = listContainer.querySelector("[data-archive-stage]");

  if (!inner || !stage || items.length === 0) return;

  // Preload Observer
  const isDesktop = window.matchMedia("(min-width: 991px)").matches;
  if (isDesktop) {
    const preloadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const desktopButton = entry.target.querySelector(
              ".archive__list-desktop"
            );

            if (desktopButton) {
              const img = desktopButton.querySelector(
                "img.archive__list-image"
              );
              if (img && img.src) {
                img.removeAttribute("loading");

                const tempImg = new Image();
                tempImg.src = img.src;
              }
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "300px 0px 300px 0px" }
    );

    items.forEach((item) => preloadObserver.observe(item));
  }
  // ---------------------------------------------------

  let hasEnteredOnce = false;
  let mouseY = window.innerHeight / 2;
  let activeItem = null;
  let isMouseMode = true;

  // Initialisierung
  gsap.set(stage, {
    xPercent: 0,
    yPercent: -50,
    scale: 0,
    transformOrigin: "center center",
  });
  gsap.set(inner, { yPercent: 0 });

  const yTo = gsap.quickTo(stage, "y", { duration: 0.6, ease: "power3" });

  const updateY = () => {
    if (!activeItem) return;

    const wrapperRect = listContainer.getBoundingClientRect();
    let targetY;

    if (isMouseMode) {
      targetY = mouseY;
    } else {
      const itemRect = activeItem.getBoundingClientRect();
      targetY = itemRect.top + itemRect.height / 2;
    }

    yTo(targetY - wrapperRect.top);
  };

  window.addEventListener("mousemove", (e) => {
    isMouseMode = true;
    mouseY = e.clientY;
    if (hasEnteredOnce) updateY();
  });

  window.addEventListener(
    "scroll",
    () => {
      if (hasEnteredOnce) updateY();
    },
    { passive: true }
  );

  const showPreview = (item, fromFocus) => {
    if (window.innerWidth < 991) return;

    activeItem = item;
    isMouseMode = !fromFocus;

    const visual = item.querySelector("[data-archive-visual]");
    if (!visual) return;

    inner.innerHTML = "";
    const clone = visual.cloneNode(true);

    if (clone.style) {
      clone.style.width = "100%";
      clone.style.height = "100%";
      clone.style.display = "block";
    } else if (typeof gsap !== "undefined") {
      gsap.set(clone, { width: "100%", height: "100%" });
    }

    inner.appendChild(clone);
    updateY();

    if (!hasEnteredOnce) {
      gsap.fromTo(
        stage,
        { scale: 0 },
        { scale: 1, duration: 0.6, ease: "expo.inOut", overwrite: "auto" }
      );
      hasEnteredOnce = true;
    } else {
      gsap.fromTo(
        clone,
        { scale: 1.2 },
        { scale: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" }
      );
    }
  };

  const hidePreview = () => {
    activeItem = null;
    gsap.to(stage, {
      scale: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        inner.innerHTML = "";
        hasEnteredOnce = false;
      },
    });
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => showPreview(item, false));
    item.addEventListener("focusin", () => showPreview(item, true));
  });

  listContainer.addEventListener("mouseleave", hidePreview);

  listContainer.addEventListener("focusout", (e) => {
    if (!listContainer.contains(e.relatedTarget)) hidePreview();
  });
}

function initVideo() {
  nextPage
    .querySelectorAll("[data-video-src]:not([data-hover])")
    .forEach((el) => {
      const video = el.tagName === "VIDEO" ? el : el.querySelector("video");
      if (!video) return;

      let src = el.getAttribute("data-video-src");

      if (!src) return;

      if (!video.src) {
        video.src = src;

        if (typeof video.load === "function") {
          video.load();
        }
      }
    });
}

function initProjectButtons() {
  ScrollTrigger.matchMedia({
    "(max-width: 767px)": function () {
      const projectButtons = gsap.utils.toArray(".project__btn");
      const projectContentList = document.querySelector(
        ".project__content-list"
      );

      if (!projectButtons) return;

      gsap.fromTo(
        projectButtons,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: 40,
          stagger: {
            each: 0.1,
            from: "end",
          },
          ease: "back.in(4)",
          scrollTrigger: {
            trigger: projectContentList,
            start: "bottom bottom",
            end: "bottom top",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
  });
}

function initTabSystem() {
  const wrappers = nextPage.querySelectorAll('[data-tabs="wrapper"]');

  if (!wrappers) return;

  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');

    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;

    let activeContent = null; // keep track of active item/link
    let activeVisual = null;
    let isAnimating = false;
    let progressBarTween = null; // to stop/start the progress bar

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector(
        '[data-tabs="item-progress"]'
      );
      if (!bar) return;

      // In this function, you can basically do anything you want, that should happen as a tab is active
      // Maybe you have a circle filling, some other element growing, you name it.
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "power1.inOut",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length;
            switchTab(nextIndex); // once bar is full, set next to active – this is important
          }
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;

      isAnimating = true;
      if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here

      const outgoingContent = activeContent;
      const outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector(
        '[data-tabs="item-progress"]'
      );

      const incomingContent = contentItems[index];
      const incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector(
        '[data-tabs="item-progress"]'
      );

      const isMobile = window.innerWidth <= 768;

      outgoingContent?.classList.remove("active");
      outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power3" },
        onComplete: () => {
          activeContent = incomingContent;
          activeVisual = incomingVisual;
          isAnimating = false;
          if (autoplay) startProgressBar(index); // Start autoplay bar here
        },
      });

      // Wrap 'outgoing' in a check to prevent warnings on first run of the function
      // Of course, during first run (on page load), there's no 'outgoing' tab yet!
      if (outgoingContent) {
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
          .to(outgoingVisual, { autoAlpha: 0 }, 0)
          .to(
            outgoingContent.querySelector('[data-tabs="item-details"]'),
            { height: 0 },
            0
          );
      }

      tl.fromTo(
        incomingVisual,
        {
          autoAlpha: 0,
          scale: 1.075,
          xPercent: isMobile ? 0 : 5,
          yPercent: isMobile ? 5 : 0,
        },
        { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0 },
        0.3
      )
        .fromTo(
          incomingContent.querySelector('[data-tabs="item-details"]'),
          { height: 0 },
          { height: "auto" },
          0
        )
        .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    // Setze das erste Element beim Laden sofort auf aktiv, ohne Animation
    activeContent = contentItems[0];
    activeVisual = visualItems[0];
    activeContent.classList.add("active");
    activeVisual.classList.add("active");
    gsap.set(activeContent.querySelector('[data-tabs="item-details"]'), {
      height: "auto",
    });
    gsap.set(activeVisual, { autoAlpha: 1, xPercent: 0, yPercent: 0 });

    // ScrollTrigger - Startet nur die Progressbar (Timer), keine doppelte Bild-Animation
    ScrollTrigger.create({
      trigger: ".active-tab-section",
      start: "top 75%",
      onEnter: () => {
        if (autoplay && !progressBarTween) {
          startProgressBar(0);
        }
      },
      once: true,
    });

    // switch tabs on click
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // ignore click if current one is already active
        switchTab(i);
      })
    );
  });
}

function initFilter() {
  const filterWrappers = nextPage.querySelectorAll(
    "[data-filter-list]:not([data-filter-list=''])"
  );

  if (!filterWrappers.length) return;

  filterWrappers.forEach((wrapper) => {
    const rawFilterType = wrapper.getAttribute("data-filter-list");
    const pillBg = wrapper.querySelector("[data-filter-pill]");
    const filterType = rawFilterType === "pill" || pillBg ? "pill" : "count";
    const filterBtns = wrapper.querySelectorAll("[data-filter]");

    const parentSection =
      wrapper.closest("[data-filter-wrapper]") || wrapper.parentElement;
    const filterSelect = parentSection
      ? parentSection.querySelector("[data-filter-select]")
      : document.querySelector("[data-filter-select]");

    const cmsItems = document.querySelectorAll("[data-filter-item]");

    if (cmsItems.length === 0) return;
    if (filterBtns.length === 0) return;

    let currentFilter = "all";

    const gridContainer = cmsItems[0].parentElement;
    if (gridContainer) {
      const resizeObserver = new ResizeObserver(() => {
        if (typeof lenis !== "undefined" && lenis) lenis.resize();
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      });

      resizeObserver.observe(gridContainer);

      if (typeof registerCleanup === "function") {
        registerCleanup(() => resizeObserver.disconnect());
      }
    }

    function itemMatchesFilter(item, filter) {
      if (filter === "all") return true;
      const categoryEls = item.querySelectorAll("[data-category]");
      const categories = Array.from(categoryEls).map((el) =>
        (el.getAttribute("data-category") || "").toLowerCase()
      );
      return categories.includes(filter.toLowerCase());
    }

    function executeGSAPFilter(category) {
      const toShow = Array.from(cmsItems).filter((item) =>
        itemMatchesFilter(item, category)
      );
      const currentlyVisible = Array.from(cmsItems).filter(
        (item) => !item.hasAttribute("data-filter-hidden")
      );

      const updateLayout = () => {
        if (typeof lenis !== "undefined" && lenis) lenis.resize();
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();

        if (typeof lenis !== "undefined" && lenis) {
          const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          );
          if (window.scrollY > maxScroll) {
            lenis.scrollTo(maxScroll, { immediate: true });
          }
        }

        if (typeof ScrollTrigger !== "undefined") {
          const footers = document.querySelectorAll("[data-footer-parallax]");

          footers.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
              const footerTriggers = ScrollTrigger.getAll().filter(
                (st) => st.trigger === el
              );

              footerTriggers.forEach((st) => {
                if (st.animation) {
                  gsap.to(st.animation, {
                    progress: 1,
                    duration: 0.8,
                    ease: "expo.out",
                    overwrite: "auto",
                  });
                }
              });
            }
          });
        }
      };

      if (typeof gsap === "undefined") {
        cmsItems.forEach((item) => item.setAttribute("data-filter-hidden", ""));
        toShow.forEach((item) => item.removeAttribute("data-filter-hidden"));
        requestAnimationFrame(updateLayout);
        return;
      }

      const tl = gsap.timeline({
        onComplete: updateLayout,
      });

      if (currentlyVisible.length > 0) {
        tl.to(currentlyVisible, {
          opacity: 0,
          y: 40,
          duration: 0.4,
          ease: "expo.in",
        });
      }

      tl.add(() => {
        cmsItems.forEach((item) => item.setAttribute("data-filter-hidden", ""));
        toShow.forEach((item) => item.removeAttribute("data-filter-hidden"));
        gsap.set(toShow, { opacity: 0, y: 30 });

        requestAnimationFrame(() => {
          updateLayout();
          setTimeout(updateLayout, 150);
        });
      });

      if (toShow.length > 0) {
        tl.to(
          toShow,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: { each: 0.06, from: "start" },
            ease: "expo.out",
            clearProps: "all",
          },
          "+=0.1"
        );
      }
    }

    const filterSelectCount = wrapper.querySelector("[data-filter-count]");

    function getCountValue(filter) {
      if (filter === "all") return cmsItems.length;
      return Array.from(cmsItems).filter((item) =>
        itemMatchesFilter(item, filter)
      ).length;
    }

    function getAllBtnText(fallback) {
      const allBtn = Array.from(filterBtns).find(
        (btn) => btn.getAttribute("data-filter") === "all"
      );
      if (!allBtn) return fallback;
      const labelEl = allBtn.querySelector("[data-filter-label]");
      return labelEl ? labelEl.textContent.trim() : allBtn.textContent.trim();
    }

    function runCountLogic() {
      if (filterType !== "count") return;
      filterBtns.forEach((btn) => {
        const filter = btn.getAttribute("data-filter");
        const countEl = btn.querySelector("[data-filter-count]");
        if (countEl) countEl.textContent = getCountValue(filter);
      });
      if (filterSelectCount) {
        filterSelectCount.textContent = `(${getCountValue("all")})`;
      }
    }

    function createSelectOption(val, text) {
      if (!filterSelect) return;
      const option = document.createElement("option");
      option.value = val;
      option.textContent = text;
      filterSelect.appendChild(option);
    }

    function populateSelectForCounts() {
      if (filterType !== "count" || !filterSelect) return;
      filterSelect.innerHTML = "";
      const allText = getAllBtnText("Alle");
      createSelectOption("all", `${allText} (${getCountValue("all")})`);
      filterBtns.forEach((btn) => {
        const filter = btn.getAttribute("data-filter");
        if (!filter || filter === "all") return;
        const labelEl = btn.querySelector("[data-filter-label]");
        let name = labelEl
          ? labelEl.textContent.trim()
          : btn.textContent.trim();
        name = name.replace(/\s*\(\d+\)$/, "");
        createSelectOption(filter, `${name} (${getCountValue(filter)})`);
      });
    }

    function populateSelectForPills() {
      if (filterType !== "pill" || !filterSelect) return;
      filterSelect.innerHTML = "";
      const allText = getAllBtnText("Alle");
      createSelectOption("all", allText);
      filterBtns.forEach((btn) => {
        const filter = btn.getAttribute("data-filter");
        if (!filter || filter === "all") return;
        const labelEl = btn.querySelector("[data-filter-label]") || btn;
        createSelectOption(filter, labelEl.textContent.trim());
      });
    }

    let activeTarget = null;
    let pillX = 0,
      pillY = 0,
      pillW = 0,
      pillH = 0;
    let velX = 0,
      velY = 0,
      velW = 0,
      velH = 0;
    let isFirstMove = true;

    if (filterType === "pill" && pillBg && typeof gsap !== "undefined") {
      gsap.ticker.add(() => {
        if (!activeTarget) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const btnRect = activeTarget.getBoundingClientRect();
        if (btnRect.width === 0) return;

        const targetX = btnRect.left - wrapperRect.left;
        const targetY = btnRect.top - wrapperRect.top;
        const targetW = btnRect.width;
        const targetH = btnRect.height;

        if (isFirstMove) {
          pillX = targetX;
          pillY = targetY;
          pillW = targetW;
          pillH = targetH;
          isFirstMove = false;
        } else {
          const dt = gsap.ticker.deltaRatio();
          const stiffness = 0.125;
          const damping = 0.625;

          velX += (targetX - pillX) * stiffness * dt;
          velY += (targetY - pillY) * stiffness * dt;
          velW += (targetW - pillW) * stiffness * dt;
          velH += (targetH - pillH) * stiffness * dt;

          velX *= damping;
          velY *= damping;
          velW *= damping;
          velH *= damping;

          pillX += velX * dt;
          pillY += velY * dt;
          pillW += velW * dt;
          pillH += velH * dt;
        }

        gsap.set(pillBg, {
          x: pillX,
          y: pillY,
          width: pillW,
          height: pillH,
        });
      });
    }

    function movePill(targetBtn) {
      if (filterType !== "pill" || !pillBg || !targetBtn) return;
      activeTarget = targetBtn;
      filterBtns.forEach((btn) =>
        btn.removeAttribute("data-filter-pill-target")
      );
      targetBtn.setAttribute("data-filter-pill-target", "");
      gsap.to(pillBg, { opacity: 1, duration: 0.3, overwrite: "auto" });
    }

    window.addEventListener("resize", () => {
      if (filterType === "pill") {
        const activeBtn = wrapper.querySelector(
          "[data-filter][data-filter-status='active']"
        );
        isFirstMove = true;
        if (activeBtn) movePill(activeBtn);
      }
    });

    function handleFilterChange(filterSlug, clickedBtn) {
      filterBtns.forEach((b) =>
        b.setAttribute("data-filter-status", "not-active")
      );
      if (clickedBtn) clickedBtn.setAttribute("data-filter-status", "active");

      if (filterSelect) filterSelect.value = filterSlug;
      currentFilter = filterSlug;

      runCountLogic();
      movePill(clickedBtn);
      executeGSAPFilter(filterSlug);
    }

    if (filterType === "pill" && pillBg) {
      filterBtns.forEach((btn) => {
        btn.addEventListener("mouseenter", () => movePill(btn));
      });

      wrapper.addEventListener("mouseleave", () => {
        const activeBtn = wrapper.querySelector(
          "[data-filter][data-filter-status='active']"
        );
        if (activeBtn) movePill(activeBtn);
      });
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        handleFilterChange(filter, btn);
      });
    });

    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        const filter = e.target.value || "all";
        const targetBtn =
          Array.from(filterBtns).find(
            (b) => b.getAttribute("data-filter") === filter
          ) || filterBtns[0];

        handleFilterChange(filter, targetBtn);
      });
    }

    if (filterType === "count") {
      runCountLogic();
      populateSelectForCounts();
    } else if (filterType === "pill") {
      populateSelectForPills();
    }

    const initialBtn =
      wrapper.querySelector("[data-filter][data-filter-status='active']") ||
      filterBtns[0];

    if (initialBtn) {
      initialBtn.setAttribute("data-filter-status", "active");
      if (filterType === "pill") {
        setTimeout(() => movePill(initialBtn), 50);
      }
    }
  });
}

function initImageWall() {
  function waitForGSAP() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      initAllEffects();
    } else {
      setTimeout(waitForGSAP, 50);
    }
  }

  function initAllEffects() {
    const roots = document.querySelectorAll(".mwg023");

    if (!roots) return;

    roots.forEach((root) => {
      initEffect(root);
    });
  }

  function initEffect(root) {
    const medias = root.querySelectorAll(".mwg023-inner-media");
    const mediasTotal = medias.length;

    if (mediasTotal === 0) return;

    const mediasChild = root.querySelectorAll(".mwg023-media");
    const container = root.querySelector(".mwg023-container");
    if (!container) return;

    gsap.set(mediasChild, { yPercent: -50 });

    const angleGap = 12;
    const startRotation = 25;
    const endRotation = -25;

    const centerOffset = ((mediasTotal - 1) * angleGap) / 2;

    medias.forEach((media, index) => {
      gsap.set(media, {
        rotation: centerOffset - angleGap * index,
      });
    });

    gsap.set(container, { rotation: startRotation });

    const bounceEffect = gsap.quickTo(mediasChild, "yPercent", {
      duration: 0.8,
      ease: "power3.out",
    });

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",

      animation: gsap.to(container, {
        rotation: endRotation,
        ease: "none",
      }),
      scrub: 1.5,

      onUpdate: (self) => {
        let velocity = self.getVelocity();
        let val = -Math.abs(velocity / 100) - 50;

        if (val < -90) val = -90;

        bounceEffect(val);
      },
    });

    const observer = new MutationObserver((mutations) => {
      const isRootRemoved = mutations.some(
        (mutation) =>
          mutation.type === "childList" &&
          Array.from(mutation.removedNodes).includes(root)
      );

      if (isRootRemoved) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForGSAP();
}

function initMarqueeScrollDirection() {
  document
    .querySelectorAll("[data-marquee-scroll-direction-target]")

    .forEach((marquee) => {
      // Query marquee elements
      const marqueeContent = marquee.querySelector(
        "[data-marquee-collection-target]"
      );
      const marqueeScroll = marquee.querySelector(
        "[data-marquee-scroll-target]"
      );
      if (!marqueeContent || !marqueeScroll) return;

      // Get data attributes
      const {
        marqueeSpeed: speed,
        marqueeDirection: direction,
        marqueeDuplicate: duplicate,
        marqueeScrollSpeed: scrollSpeed,
      } = marquee.dataset;

      // Convert data attributes to usable types
      const marqueeSpeedAttr = parseFloat(speed);
      const marqueeDirectionAttr = direction === "right" ? 1 : -1; // 1 for right, -1 for left
      const duplicateAmount = parseInt(duplicate || 0);
      const scrollSpeedAttr = parseFloat(scrollSpeed);
      const speedMultiplier =
        window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

      let marqueeSpeed =
        marqueeSpeedAttr *
        (marqueeContent.offsetWidth / window.innerWidth) *
        speedMultiplier;

      // Precompute styles for the scroll container
      marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
      marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

      // Duplicate marquee content
      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }

      // GSAP animation for marquee content
      const marqueeItems = marquee.querySelectorAll(
        "[data-marquee-collection-target]"
      );
      const animation = gsap
        .to(marqueeItems, {
          xPercent: -100, // Move completely out of view
          repeat: -1,
          duration: marqueeSpeed,
          ease: "linear",
        })
        .totalProgress(0.5);

      // Initialize marquee in the correct direction
      gsap.set(marqueeItems, {
        xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
      });
      animation.timeScale(marqueeDirectionAttr); // Set correct direction
      animation.play(); // Start animation immediately

      // Set initial marquee status
      marquee.setAttribute("data-marquee-status", "normal");

      // ScrollTrigger logic for direction inversion
      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const isInverted = self.direction === 1; // Scrolling down
          const currentDirection = isInverted
            ? -marqueeDirectionAttr
            : marqueeDirectionAttr;

          // Update animation direction and marquee status
          animation.timeScale(currentDirection);
          marquee.setAttribute(
            "data-marquee-status",
            isInverted ? "normal" : "inverted"
          );
        },
      });

      // Extra speed effect on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: "0% 100%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      const scrollStart =
        marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
      const scrollEnd = -scrollStart;

      tl.fromTo(
        marqueeScroll,
        { x: `${scrollStart}vw` },
        { x: `${scrollEnd}vw`, ease: "none" }
      );
    });
}

function initAchievementsScrollIn() {
  const achievementsContainer = nextPage.querySelector(".achievements__header");

  if (!achievementsContainer) {
    return;
  }

  const achievementsHeadingWrapper = document.querySelector(
    ".achievements__heading-wrapper"
  );
  const achievementsOutline = document.querySelector(".achievements__outline");
  const achievementsHeading = document.querySelector(".achievements__heading");
  const achievementsCircle = document.querySelector(".achievements__icon");
  const achievementsIcon = document.querySelector(".achievements__icon-svg");
  const achievementsList = document.querySelector(".achievements__list");

  const achievementsItems = achievementsList ? achievementsList.children : [];
  const lvlPercentage = document.querySelectorAll(".achievements_percentage");

  if (!achievementsHeading) return;

  let split = SplitText.create(achievementsHeading, {
    type: "words",
    mask: "words",
  });

  SplitText.create(lvlPercentage, {
    type: "chars",
    mask: "chars",
  });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: achievementsContainer,
      start: "top 75%",
    },
  });

  tl.from(achievementsCircle, {
    scale: 0,
    duration: 0.8,
    ease: "back.inOut",
  })
    .from(
      achievementsOutline,
      {
        opacity: 0,
        scale: 0.6,
        duration: 0.8,
        ease: "expo.inOut",
      },
      "<"
    )
    .fromTo(
      achievementsIcon.children,
      {
        opacity: 0,
        scale: 0,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        stagger: {
          each: 0.007,
          from: "center",
        },
      },
      "<0.25"
    )
    .from(
      achievementsHeadingWrapper,
      {
        width: 0,
        ease: "expo.inOut",
        duration: 1.5,
        clearProps: "width",
      },
      "<0.4"
    )
    .from(
      split.words,
      {
        yPercent: 100,
        duration: 1,
        autoAlpha: 0,
        ease: "expo.out",
        stagger: 0.05,
      },
      "<0.7"
    );

  tl.add("itemsStart", "<0.1");

  Array.from(achievementsItems).forEach((item, index) => {
    const bar = item.querySelector(".achievements__lvl-bar");
    const chars = item.querySelectorAll(".achievements_percentage div");
    const startTime = `itemsStart+=${index * 0.1}`;

    tl.from(
      item,
      {
        autoAlpha: 0,
        yPercent: 50,
        duration: 1.5,
        ease: "expo.out",
      },
      startTime
    );

    if (bar) {
      tl.to(
        bar,
        {
          width: "100%",
          duration: 1.5,
          ease: "expo.out",
        },
        startTime
      );
    }

    if (chars.length > 0) {
      tl.from(
        chars,
        {
          autoAlpha: 0,
          yPercent: 50,
          duration: 1.0,
          ease: "expo.out",
          stagger: { amount: 0.5 },
        },
        startTime
      );
    }
  });
}

function initAboutIntro() {
  const root = document.querySelector(".about-intro");
  if (!root) return;

  const textPath = root.querySelector("#textpath");
  const path = root.querySelector("#path");
  if (!textPath || !path) return;

  const text = textPath.textContent.trim();
  let images = gsap.utils.toArray(
    root.querySelectorAll(".about-intro__parallax-img")
  );

  const preloadImages = () => {
    const promises = images.map((imgWrapper) => {
      return new Promise((resolve) => {
        const img = imgWrapper.querySelector("img");
        if (!img) return resolve();

        if (img.complete && img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    });
    return Promise.all(promises);
  };

  function getTextWidth(text) {
    const canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    const computedStyle = window.getComputedStyle(textPath);
    context.font = computedStyle.font;
    return context.measureText(text).width;
  }

  function getFinalOffset() {
    const textPathLength = getTextWidth(text) * 1.25;
    const pathLength = path.getTotalLength();
    return -((textPathLength * 100) / pathLength);
  }

  preloadImages().then(() => {
    let mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        let { isDesktop } = context.conditions;

        const pinHeight = root.querySelector(".about-intro__pin-height");
        const container = root.querySelector(".about-intro__container");
        const startEl = root.querySelector(".about-intro__start");
        const endEl = root.querySelector(".about-intro__end");

        const endHeading = root.querySelector(".about-intro__end-h");
        const endText = root.querySelector(".about-intro__end-p");

        if (!pinHeight || !container) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinHeight,
            start: "top top",
            end: "bottom bottom",
            pin: container,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Text & SVG
        if (startEl) {
          tl.to(
            startEl,
            { autoAlpha: 0, duration: 0.05, ease: "power1.inOut" },
            0
          );
        }

        tl.to(
          textPath,
          {
            attr: { startOffset: () => getFinalOffset() + "0%" },
            ease: "none",
            duration: 1,
          },
          0
        );

        if (endEl) {
          tl.to(
            endEl,
            { autoAlpha: 1, duration: 0.1, ease: "power1.inOut" },
            0.85
          );
        }

        let introEndHeadingSplit = new SplitText(endHeading, {
          type: "words, lines",
        });

        let introEndSplit = new SplitText(endText, {
          type: "words, lines",
        });

        tl.from(
          introEndHeadingSplit.lines,
          {
            yPercent: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 0.15,
            ease: "power2.out",
          },
          0.85
        );

        tl.from(
          introEndSplit.lines,
          {
            yPercent: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 0.15,
            ease: "power2.out",
          },
          "<0.05"
        );

        // Grid Translate Logik
        const len = images.length;
        const cols = isDesktop ? Math.ceil(Math.sqrt(len * 1.2)) : 3;
        const rows = Math.ceil(len / cols);

        let gridCells = [];
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            gridCells.push({ c, r });
          }
        }
        gridCells = gsap.utils.shuffle(gridCells);

        images.forEach((imgWrapper, i) => {
          const imgElement = imgWrapper.querySelector("img");
          if (!imgElement) return;

          const natWidth = imgElement.naturalWidth || 800;
          const natHeight = imgElement.naturalHeight || 600;
          const aspectRatio = natWidth / natHeight;

          const depth = Math.random();
          const isForeground = depth > 0.5;
          const zIndex = isForeground
            ? gsap.utils.random(11, 13, 1)
            : gsap.utils.random(7, 9, 1);

          const minBaseSize = isDesktop ? 14 : 6;
          const maxBaseSize = isDesktop ? 20 : 12;
          const baseSize = gsap.utils.random(minBaseSize, maxBaseSize);

          const targetArea = baseSize * baseSize;
          const exactHeight = Math.sqrt(targetArea / aspectRatio);
          const exactWidth = exactHeight * aspectRatio;

          const finalRotation = gsap.utils.random(-15, 15);

          const cell = gridCells[i];
          const cellWidthVw = 100 / cols;
          const cellHeightVh = 100 / rows;

          let xTarget = cell.c * cellWidthVw - 50 + cellWidthVw / 2;
          let yTarget = cell.r * cellHeightVh - 50 + cellHeightVh / 2;

          const varianceFactor = isDesktop ? 0.3 : 0.4;
          const xVariance = cellWidthVw * varianceFactor;
          const yVariance = cellHeightVh * varianceFactor;

          xTarget += gsap.utils.random(-xVariance, xVariance);
          yTarget += gsap.utils.random(-yVariance, yVariance);

          const baseTravel = isDesktop ? 35 : 30;
          const depthTravel = isDesktop ? 70 : 60;
          const dist = baseTravel + depth * depthTravel;

          const yStart = yTarget + dist;
          const yEnd = yTarget - dist;

          gsap.set(imgWrapper, {
            autoAlpha: 0,
            scale: 1.1,
            zIndex: zIndex,
            rotation: finalRotation + gsap.utils.random(-5, 5),
            width: exactWidth + "em",
            height: exactHeight + "em",
            x: xTarget + "vw",
            y: yStart + "vh",
          });

          tl.to(imgWrapper, { y: yEnd + "vh", ease: "none", duration: 1 }, 0);

          const fadeInStart = gsap.utils.random(0.0, 0.05);
          const fadeOutStart = gsap.utils.random(0.75, 0.85);

          tl.to(
            imgWrapper,
            {
              autoAlpha: 1,
              scale: 1,
              rotation: finalRotation,
              duration: 0.1,
              ease: "elastic.out(1, 0.6)",
            },
            fadeInStart
          );

          tl.to(
            imgWrapper,
            {
              autoAlpha: 0,
              duration: 0.075,
              scale: 0.5,
              ease: "back.in(3)",
            },
            fadeOutStart
          );
        });

        return () => {
          if (introEndHeadingSplit) introEndHeadingSplit.revert();
          if (introEndSplit) introEndSplit.revert();
        };
      }
    );
  });
}

function initCursor() {
  const isDesktopWithMouse = () =>
    window.innerWidth >= 992 && window.matchMedia("(hover: hover)").matches;

  let mouseX = 0;
  let mouseY = 0;

  const cursor = document.querySelector("[data-cursor]");
  const marqueeContainer = nextPage.querySelector(
    ".about-work__marquee__scroll"
  );
  const cursorText = nextPage.querySelector("[data-cursor-text-target]");
  const scrambleCharacters = "XYZxyz&@$€";

  if (!cursor || !marqueeContainer) return;

  // State Variablen
  let cursorRafId;
  let cursorIsInside = false;
  let lastCursorHoveredItem = null;

  let hoverRafId;
  let hoverIsInside = false;
  let lastHoverItem = null;

  let xTo, yTo;

  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    xTo = gsap.quickTo(cursor, "x", { duration: 0.75, ease: "expo.out" });
    yTo = gsap.quickTo(cursor, "y", { duration: 0.75, ease: "expo.out" });
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor && isDesktopWithMouse() && xTo && yTo) {
      xTo(mouseX);
      yTo(mouseY);
    }
  });

  // 2. CURSOR HIT DETECTION
  function checkCursorHit() {
    if (!cursorIsInside || !isDesktopWithMouse() || !cursor) return;

    const currentElement = document.elementFromPoint(mouseX, mouseY);

    if (currentElement) {
      const hoveredItem = currentElement.closest("[data-cursor-hover]");

      if (hoveredItem) {
        if (hoveredItem !== lastCursorHoveredItem) {
          gsap.to(cursor, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.4,
            ease: "back.out(1.5)",
            overwrite: "auto",
          });

          if (cursorText) {
            const newText =
              hoveredItem.getAttribute("data-cursor-text") || "Zum Projekt";
            gsap.to(cursorText, {
              duration: 0.6,
              overwrite: "auto",
              scrambleText: {
                text: newText,
                chars: scrambleCharacters,
                speed: 1.2,
              },
            });
          }
          lastCursorHoveredItem = hoveredItem;
        }
      } else {
        if (lastCursorHoveredItem !== null) {
          gsap.to(cursor, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          lastCursorHoveredItem = null;
        }
      }
    }

    cursorRafId = requestAnimationFrame(checkCursorHit);
  }

  // 3. HOVER OPACITY DETECTION
  function resetHover() {
    hoverIsInside = false;
    cancelAnimationFrame(hoverRafId);
    lastHoverItem = null;
    const currentItems = marqueeContainer.querySelectorAll(
      "[data-cursor-hover]"
    );
    currentItems.forEach((item) =>
      item.classList.remove("is-hover", "is-not-hover")
    );
  }

  function checkItemHit() {
    if (!hoverIsInside || !isDesktopWithMouse()) {
      resetHover();
      return;
    }

    const currentElement = document.elementFromPoint(mouseX, mouseY);

    if (currentElement) {
      const hoveredItem = currentElement.closest("[data-cursor-hover]");

      if (hoveredItem && hoveredItem !== lastHoverItem) {
        const currentItems = marqueeContainer.querySelectorAll(
          "[data-cursor-hover]"
        );
        currentItems.forEach((item) => {
          if (item === hoveredItem) {
            item.classList.add("is-hover");
            item.classList.remove("is-not-hover");
          } else {
            item.classList.add("is-not-hover");
            item.classList.remove("is-hover");
          }
        });
        lastHoverItem = hoveredItem;
      }
    }
    hoverRafId = requestAnimationFrame(checkItemHit);
  }

  // 4. EVENTS
  marqueeContainer.addEventListener("mouseenter", () => {
    if (!isDesktopWithMouse()) return;

    if (cursor) {
      gsap.set(cursor, { x: mouseX, y: mouseY });

      if (!cursorIsInside) {
        cursorIsInside = true;
        checkCursorHit();
      }
    }

    const currentItems = marqueeContainer.querySelectorAll(
      "[data-cursor-hover]"
    );
    if (currentItems.length && !hoverIsInside) {
      hoverIsInside = true;
      checkItemHit();
    }
  });

  marqueeContainer.addEventListener("mouseleave", () => {
    if (!isDesktopWithMouse()) return;

    // Alles sauber beenden
    cursorIsInside = false;
    cancelAnimationFrame(cursorRafId);
    lastCursorHoveredItem = null;

    if (cursor) {
      gsap.to(cursor, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    const currentItems = marqueeContainer.querySelectorAll(
      "[data-cursor-hover]"
    );
    if (currentItems.length) {
      resetHover();
    }
  });

  window.addEventListener("resize", () => {
    if (!isDesktopWithMouse()) {
      cursorIsInside = false;
      cancelAnimationFrame(cursorRafId);
      lastCursorHoveredItem = null;

      if (cursor) {
        gsap.to(cursor, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
      if (hoverIsInside) resetHover();
    }
  });
}

function prepareUfoAnimation() {
  const ufoImg = nextPage.querySelector(".ufo-img");
  const beamWrapper = nextPage.querySelector(".tractor-beam-wrapper");
  if (!ufoImg || !beamWrapper) return;

  const beamEl = nextPage.querySelector(".tractor-beam");
  const beamPolygon = nextPage.querySelector(".tractor-beam polygon");
  const beamEllipse = nextPage.querySelector(".tractor-beam ellipse");
  const zeroEl = nextPage.querySelector(".number-zero");
  const zeroShadow = nextPage.querySelector(".zero-shadow");

  if (!beamEl || !beamPolygon || !beamEllipse || !zeroEl || !zeroShadow) return;

  const beam = {
    line: { poly: "96,0 104,0 104,290 96,290", rx: 4, ry: 2, cy: 290 },
    cone: { poly: "60,0 140,0 200,280 0,280", rx: 100, ry: 20, cy: 280 },
  };

  // ------------------------------------------------
  // Initial State SOFORT setzen
  // ------------------------------------------------
  gsap.set(ufoImg, {
    x: window.innerWidth * 0.14,
    y: window.innerHeight * -0.24,
    rotation: -10,
    scale: 0.2,
    opacity: 0,
    transformOrigin: "50% 50%",
  });

  gsap.set(beamWrapper, { x: window.innerWidth * 0.14 });

  gsap.set(beamEl, {
    scaleY: 0,
    opacity: 0,
    transformOrigin: "top center",
  });

  gsap.set(beamPolygon, { attr: { points: beam.line.poly } });
  gsap.set(beamEllipse, {
    attr: { rx: beam.line.rx, ry: beam.line.ry, cy: beam.line.cy },
  });

  gsap.set(zeroEl, { x: 0, yPercent: 0, rotation: 0 });
  gsap.set(zeroShadow, { scale: 0, opacity: 1 });
}

function startUfoAnimation() {
  const ufoImg = nextPage.querySelector(".ufo-img");
  const beamWrapper = nextPage.querySelector(".tractor-beam-wrapper");
  if (!ufoImg || !beamWrapper) return;

  const beamEl = nextPage.querySelector(".tractor-beam");
  const beamPolygon = nextPage.querySelector(".tractor-beam polygon");
  const beamEllipse = nextPage.querySelector(".tractor-beam ellipse");
  const zeroEl = nextPage.querySelector(".number-zero");
  const zeroShadow = nextPage.querySelector(".zero-shadow");
  const starsContainer = nextPage.querySelector("#stars-container");

  if (!beamEl || !beamPolygon || !beamEllipse || !zeroEl || !zeroShadow) return;

  const STAR_COUNT = 50;
  const STAR_SIZE_MIN = 1;
  const STAR_SIZE_MAX = 4;
  const STAR_SPEED_MIN = 2;
  const STAR_SPEED_MAX = 4;
  const STAR_DURATION_MIN = 600;
  const STAR_DURATION_MAX = 1000;
  const STAR_FADE_IN_MIN = 0.8;
  const STAR_FADE_IN_MAX = 2;
  const STAR_DELAY_MAX = 3;

  const beam = {
    line: { poly: "96,0 104,0 104,290 96,290", rx: 4, ry: 2, cy: 290 },
    cone: { poly: "60,0 140,0 200,280 0,280", rx: 100, ry: 20, cy: 280 },
  };

  const ZERO_BASE_Y_PERCENT = -35;

  let loopActive = false;
  let outroRunning = false;
  let destroyed = false;

  let masterTl = null;
  let physicsTicker = null;
  let matterEngine = null;

  const groupPos = { xPct: 0, yPct: 0 };
  const zeroTracking = { weight: 0 };
  const stars = [];

  // ------------------------------------------------
  // Sterne erstellen
  // ------------------------------------------------
  function animateStarPhysics(el, startDelay = 0) {
    gsap.to(el, {
      duration: gsap.utils.random(STAR_DURATION_MIN, STAR_DURATION_MAX),
      physics2D: {
        velocity: gsap.utils.random(STAR_SPEED_MIN, STAR_SPEED_MAX),
        angle: gsap.utils.random(0, 360),
        gravity: 0,
        friction: 0,
      },
      delay: startDelay,
    });
  }

  if (starsContainer) {
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const sizePx = gsap.utils.random(STAR_SIZE_MIN, STAR_SIZE_MAX, 0.1);
      const sizeRem = sizePx / 16;

      star.style.width = `${sizeRem}rem`;
      star.style.height = `${sizeRem}rem`;

      const startX = gsap.utils.random(0, window.innerWidth);
      const startY = gsap.utils.random(0, window.innerHeight);

      gsap.set(star, { x: startX, y: startY, opacity: 0 });

      starsContainer.appendChild(star);
      stars.push({ el: star });

      gsap.to(star, {
        opacity: 1,
        duration: gsap.utils.random(STAR_FADE_IN_MIN, STAR_FADE_IN_MAX),
        delay: gsap.utils.random(0, STAR_DELAY_MAX),
        ease: "power1.out",
      });

      animateStarPhysics(star);
    }
  }

  function recycleStarIfNeeded(el) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 60;

    const x = gsap.getProperty(el, "x");
    const y = gsap.getProperty(el, "y");

    if (x < -margin || x > vw + margin || y < -margin || y > vh + margin) {
      gsap.killTweensOf(el);

      const side = Math.floor(gsap.utils.random(0, 4));
      let newX, newY, angle;

      switch (side) {
        case 0:
          newX = -margin;
          newY = gsap.utils.random(margin, vh - margin);
          angle = gsap.utils.random(-45, 45);
          break;
        case 1:
          newX = vw + margin;
          newY = gsap.utils.random(margin, vh - margin);
          angle = gsap.utils.random(135, 225);
          break;
        case 2:
          newX = gsap.utils.random(margin, vw - margin);
          newY = -margin;
          angle = gsap.utils.random(45, 135);
          break;
        default:
          newX = gsap.utils.random(margin, vw - margin);
          newY = vh + margin;
          angle = gsap.utils.random(225, 315);
          break;
      }

      gsap.set(el, { x: newX, y: newY, opacity: 0 });

      gsap.to(el, {
        duration: gsap.utils.random(STAR_DURATION_MIN, STAR_DURATION_MAX),
        physics2D: {
          velocity: gsap.utils.random(STAR_SPEED_MIN, STAR_SPEED_MAX),
          angle,
          gravity: 0,
          friction: 0,
        },
      });

      gsap.to(el, {
        opacity: 1,
        duration: 0.8,
        ease: "power1.out",
      });
    }
  }

  // ------------------------------------------------
  // Ticker
  // ------------------------------------------------
  function ufoTicker() {
    if (destroyed || outroRunning) return;

    if (loopActive) {
      const sharedX = window.innerWidth * (groupPos.xPct / 100);
      const sharedY = window.innerHeight * (groupPos.yPct / 100);

      gsap.set(ufoImg, { x: sharedX, y: sharedY });
      gsap.set(beamWrapper, { x: sharedX });
      gsap.set(zeroEl, { x: sharedX * zeroTracking.weight });
    }

    const curYPct = gsap.getProperty(zeroEl, "yPercent");
    const curX = gsap.getProperty(zeroEl, "x");
    const maxHoverYPct = ZERO_BASE_Y_PERCENT - 15;

    const s = gsap.utils.clamp(
      0,
      1.6,
      gsap.utils.mapRange(0, maxHoverYPct, 0, 1.5, curYPct)
    );

    gsap.set(zeroShadow, { scale: s, x: curX });

    stars.forEach(({ el }) => recycleStarIfNeeded(el));
  }

  gsap.ticker.add(ufoTicker);

  // ------------------------------------------------
  // Intro Timeline
  // ------------------------------------------------
  masterTl = gsap.timeline();

  masterTl
    .to(ufoImg, { duration: 0.6, opacity: 1, ease: "power1.out" }, 0)
    .to(ufoImg, { duration: 2.4, scale: 1, y: 0, ease: "power3.out" }, 0)

    .to(
      [ufoImg, beamWrapper],
      { x: window.innerWidth * -0.04, duration: 0.6, ease: "power2.out" },
      0
    )
    .to(
      [ufoImg, beamWrapper],
      { x: window.innerWidth * 0.02, duration: 0.6, ease: "power2.inOut" },
      0.6
    )
    .to(
      [ufoImg, beamWrapper],
      { x: window.innerWidth * -0.01, duration: 0.6, ease: "power2.inOut" },
      1.2
    )
    .to([ufoImg, beamWrapper], { x: 0, duration: 0.6, ease: "back.out" }, 1.8)

    .to(ufoImg, { rotation: 10, duration: 0.6, ease: "power2.out" }, 0)
    .to(ufoImg, { rotation: -5, duration: 0.6, ease: "power2.inOut" }, 0.6)
    .to(ufoImg, { rotation: 2.5, duration: 0.6, ease: "power2.inOut" }, 1.2)
    .to(ufoImg, { rotation: 0, duration: 0.6, ease: "back.out" }, 1.8)

    .add(() => startUfoHover(), 2.4)

    .to(
      beamEl,
      { duration: 0.3, scaleY: 1, opacity: 1, ease: "power2.out" },
      2.4
    )
    .to(
      beamPolygon,
      { duration: 0.8, attr: { points: beam.cone.poly }, ease: "power2.inOut" },
      2.7
    )
    .to(
      beamEllipse,
      {
        duration: 0.8,
        attr: { rx: beam.cone.rx, ry: beam.cone.ry, cy: beam.cone.cy },
        ease: "power2.inOut",
      },
      2.7
    )

    .to(
      zeroEl,
      {
        duration: 1.8,
        yPercent: ZERO_BASE_Y_PERCENT,
        rotation: -4,
        ease: "sine.inOut",
      },
      3.1
    )
    .to(zeroTracking, { duration: 1.8, weight: 1, ease: "sine.inOut" }, 3.1)
    .add(() => startZeroHover(), 4.9);

  // ------------------------------------------------
  // Hover Funktionen
  // ------------------------------------------------
  function startUfoHover() {
    loopActive = true;

    gsap.to(groupPos, {
      xPct: 0.6,
      duration: 2.5,
      ease: "sine.inOut",
      onComplete: () =>
        gsap.to(groupPos, {
          xPct: -0.6,
          duration: 5.0,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
    });

    gsap.to(groupPos, {
      yPct: 0.3,
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(ufoImg, {
      rotation: 1.5,
      duration: 4.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(beamEl, {
      scaleX: 1.03,
      duration: 3.0,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "top center",
      force3D: true,
    });
  }

  function startZeroHover() {
    gsap.to(zeroEl, {
      yPercent: ZERO_BASE_Y_PERCENT - 10,
      duration: 3.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(zeroEl, {
      rotation: 2,
      duration: 4.0,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  // ------------------------------------------------
  // Cleanup
  // ------------------------------------------------
  function cleanupUfoAnimation() {
    destroyed = true;

    if (masterTl) {
      masterTl.kill();
      masterTl = null;
    }

    gsap.ticker.remove(ufoTicker);

    if (physicsTicker) {
      gsap.ticker.remove(physicsTicker);
      physicsTicker = null;
    }

    gsap.killTweensOf([
      ufoImg,
      beamWrapper,
      beamEl,
      beamPolygon,
      beamEllipse,
      zeroEl,
      zeroShadow,
      groupPos,
      zeroTracking,
    ]);

    stars.forEach(({ el }) => {
      gsap.killTweensOf(el);
      el.remove();
    });
    stars.length = 0;

    if (matterEngine && typeof Matter !== "undefined") {
      Matter.World.clear(matterEngine.world, false);
      Matter.Engine.clear(matterEngine);
      matterEngine = null;
    }
  }

  registerCleanup(cleanupUfoAnimation);

  // ------------------------------------------------
  // OUTRO (wird von Barba aufgerufen)
  // ------------------------------------------------
  // ------------------------------------------------
  // OUTRO (wird von Barba aufgerufen)
  // ------------------------------------------------
  playUfoOutro = function () {
    return new Promise((resolve) => {
      if (outroRunning || destroyed) {
        resolve();
        return;
      }

      outroRunning = true;
      let isResolved = false;

      // NEU: Hilfsfunktion, damit Barba frühzeitig weiterläuft
      const earlyResolve = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      };

      if (masterTl?.isActive()) masterTl.kill();

      gsap.killTweensOf([
        ufoImg,
        beamWrapper,
        zeroEl,
        beamEl,
        groupPos,
        beamPolygon,
        beamEllipse,
        zeroTracking,
      ]);

      const curYPct = gsap.getProperty(zeroEl, "yPercent");
      const isLifted = curYPct < -10;

      const outroTl = gsap.timeline({
        onComplete: () => {
          cleanupUfoAnimation();
          playUfoOutro = null; // Reset für nächste Seite
          earlyResolve(); // Fallback, falls earlyResolve aus irgendeinem Grund nicht lief
        },
      });

      outroTl
        .to(
          beamPolygon,
          {
            duration: 0.4,
            attr: { points: beam.line.poly },
            ease: "power2.inOut",
          },
          0
        )
        .to(
          beamEllipse,
          {
            duration: 0.4,
            attr: { rx: beam.line.rx, ry: beam.line.ry, cy: beam.line.cy },
            ease: "power2.inOut",
          },
          0
        )
        .to(zeroShadow, { duration: 0.3, scale: 0, ease: "power2.in" }, "<")
        .to(beamEl, { duration: 0.3, scaleY: 0, ease: "power2.in" }, 0.4)

        .to(
          [ufoImg, beamWrapper],
          {
            x: "+=" + window.innerWidth * 0.02,
            y: "+=" + window.innerHeight * 0.015,
            duration: 0.35,
            ease: "power2.inOut",
          },
          0.7
        )
        .to(
          ufoImg,
          { rotation: -10, duration: 0.35, ease: "power2.inOut" },
          0.7
        )
        .to(
          [ufoImg, beamWrapper],
          {
            x: "-=" + window.innerWidth * 0.45,
            y: "-=" + window.innerHeight * 0.25,
            duration: 1.0,
            ease: "power3.in",
          },
          1.05
        )
        .to(
          ufoImg,
          {
            scale: 0.08,
            opacity: 0,
            rotation: 18,
            duration: 1.0,
            ease: "power3.in",
          },
          1.05
        );

      outroTl.add(earlyResolve, 1.75);

      if (isLifted && typeof Matter !== "undefined") {
        const { Engine, World, Bodies, Body } = Matter;

        matterEngine = Engine.create({ gravity: { x: 0, y: 1.5 } });

        const box = zeroEl.getBoundingClientRect();
        const w = box.width || 138;
        const h = box.height || 179;

        const startX = gsap.getProperty(zeroEl, "x");
        const startY =
          gsap.getProperty(zeroEl, "y") +
          (h * gsap.getProperty(zeroEl, "yPercent")) / 100;
        const startRot = gsap.getProperty(zeroEl, "rotation");

        gsap.set(zeroEl, { yPercent: 0, y: startY });

        const zeroBody = Bodies.rectangle(startX, startY, w, h, {
          chamfer: { radius: w * 0.45 },
          angle: startRot * (Math.PI / 180),
          restitution: 0.25,
          friction: 0.1,
        });

        const floor = Bodies.rectangle(startX, h / 2 + 25, 3000, 50, {
          isStatic: true,
        });

        World.add(matterEngine.world, [zeroBody, floor]);
        Body.setAngularVelocity(
          zeroBody,
          (Math.random() > 0.5 ? 1 : -1) * 0.03
        );

        physicsTicker = () => {
          Engine.update(matterEngine, 1000 / 60);

          gsap.set(zeroEl, {
            x: zeroBody.position.x,
            y: zeroBody.position.y,
            rotation: zeroBody.angle * (180 / Math.PI),
          });
        };

        gsap.ticker.add(physicsTicker);
      } else if (isLifted) {
        outroTl.to(
          zeroEl,
          {
            duration: 1.0,
            yPercent: 0,
            x: "+=" + window.innerWidth * 0.02,
            rotation: 90,
            ease: "bounce.out",
          },
          0.1
        );
      } else {
        outroTl.to(
          zeroEl,
          { duration: 0.3, yPercent: 0, x: 0, rotation: 0 },
          0.1
        );
      }
    });
  };
}

function initNavClickStates() {
  const navLinks = document.querySelectorAll(".nav-menu_link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Füge die Klasse nur hinzu, wenn es nicht eh schon die aktuelle Seite ist
      if (!this.classList.contains("w--current")) {
        // Entferne evtl. alte pending Klassen
        navLinks.forEach((l) => l.classList.remove("is-pending"));
        // Setze den geklickten Link auf pending
        this.classList.add("is-pending");
      }
    });
  });
}

function initDynamicCurrentYear() {
  const currentYear = new Date().getFullYear();
  const currentYearElements = document.querySelectorAll("[data-current-year]");
  if (!currentYearElements) return;
  currentYearElements.forEach((currentYearElement) => {
    currentYearElement.textContent = currentYear;
  });
}

function initSplitTextScrub() {
  const textElements = document.querySelectorAll("[data-split-scrub]");
  if (!textElements || textElements.length === 0) return;

  textElements.forEach((element) => {
    const isCenter = element.getAttribute("data-split-scrub") === "center";

    if (isCenter) {
      SplitText.create(element, {
        type: "words, chars",
        wordsClass: "split-word",
        charsClass: "split-char",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(self.chars, { opacity: 0.2 });

          return gsap.to(self.chars, {
            opacity: 1,
            stagger: 0.05,
            duration: 1,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 45%",
              scrub: 1,
            },
          });
        },
      });
    } else {
      SplitText.create(element, {
        type: "lines, words, chars",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(self.chars, { opacity: 0.2 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 45%",
              scrub: 1,
            },
          });

          const charStagger = 0.05;
          const charsToWait = 3;
          const lineDelay = charStagger * charsToWait;

          self.lines.forEach((line, index) => {
            const charsInLine = line.querySelectorAll(".split-char");

            tl.to(
              charsInLine,
              {
                opacity: 1,
                stagger: charStagger,
                duration: 1,
              },
              index * lineDelay
            );
          });

          return tl;
        },
      });
    }
  });
}

function initFooterParallax() {
  nextPage.querySelectorAll("[data-footer-parallax]").forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: 1,
      },
    });

    const inner = el.querySelector("[data-footer-parallax-inner]");
    const dark = el.querySelector("[data-footer-parallax-dark]");

    if (inner) {
      tl.from(inner, {
        yPercent: -25,
        ease: "linear",
      });
    }

    if (dark) {
      tl.from(
        dark,
        {
          opacity: 0.5,
          ease: "linear",
        },
        "<"
      );
    }
  });
}

function initHeroParallaxSlider() {
  const slides = gsap.utils.toArray(".hero-slide");
  const images = gsap.utils.toArray(".hero-slide img");

  if (!slides.length || !images.length) return;

  let currentIndex = 0;
  const slideDuration = 1.5;
  const pauseDuration = 1.5;

  gsap.set(slides, { yPercent: 100, visibility: "visible" });
  gsap.set(slides[0], { yPercent: 0 });

  gsap.set(images, { yPercent: -50, scale: 1.1 });
  gsap.set(images[0], { yPercent: 0, scale: 1 });

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;

    const currentSlide = slides[currentIndex];
    const currentImage = images[currentIndex];
    const upcomingSlide = slides[nextIndex];
    const upcomingImage = images[nextIndex];

    const tl = gsap.timeline();

    tl.to(
      currentSlide,
      {
        yPercent: -100,
        duration: slideDuration,
        ease: "power3.inOut",
      },
      0
    )
      .to(
        currentImage,
        {
          yPercent: 50,
          scale: 1.1,
          duration: slideDuration,
          ease: "power3.inOut",
        },
        0
      )

      .fromTo(
        upcomingSlide,
        { yPercent: 100 },
        { yPercent: 0, duration: slideDuration, ease: "power3.inOut" },
        0
      )
      .fromTo(
        upcomingImage,
        { yPercent: -50, scale: 1.1 },
        {
          yPercent: 0,
          scale: 1,
          duration: slideDuration,
          ease: "power3.inOut",
        },
        0
      );

    currentIndex = nextIndex;
    gsap.delayedCall(slideDuration + pauseDuration, nextSlide);
  }

  gsap.delayedCall(pauseDuration, nextSlide);
}

function initContentRevealScroll() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const ctx = gsap.context(() => {
    nextPage.querySelectorAll("[data-reveal-group]").forEach((groupEl) => {
      // Config from attributes or defaults (group-level)
      const groupStaggerSec =
        (parseFloat(groupEl.getAttribute("data-stagger")) || 100) / 1000; // ms → sec
      const groupDistance = groupEl.getAttribute("data-distance") || "2em";
      const triggerStart = groupEl.getAttribute("data-start") || "top 80%";

      const animDuration = 0.8;
      const animEase = "expo.out";

      // Reduced motion: show immediately
      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: "all", y: 0, autoAlpha: 1 });
        return;
      }

      // If no direct children, animate the group element itself
      const directChildren = Array.from(groupEl.children).filter(
        (el) => el.nodeType === 1
      );
      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: () =>
            gsap.to(groupEl, {
              y: 0,
              autoAlpha: 1,
              duration: animDuration,
              ease: animEase,
              onComplete: () => gsap.set(groupEl, { clearProps: "all" }),
            }),
        });
        return;
      }

      // Build animation slots: item or nested (deep layers allowed)
      const slots = [];
      directChildren.forEach((child) => {
        const nestedGroup = child.matches("[data-reveal-group-nested]")
          ? child
          : child.querySelector(":scope [data-reveal-group-nested]");

        if (nestedGroup) {
          const includeParent =
            child.getAttribute("data-ignore") !== "true" &&
            (child.getAttribute("data-ignore") === "false" ||
              nestedGroup.getAttribute("data-ignore") === "false");

          const nestedChildren = Array.from(nestedGroup.children).filter(
            (el) =>
              el.nodeType === 1 && el.getAttribute("data-ignore") !== "true"
          );

          slots.push({
            type: "nested",
            parentEl: child,
            nestedEl: nestedGroup,
            includeParent,
            nestedChildren,
          });
        } else {
          if (child.getAttribute("data-ignore") === "true") return;
          slots.push({ type: "item", el: child });
        }
      });

      // Initial hidden state
      slots.forEach((slot) => {
        if (slot.type === "item") {
          // If the element itself is a nested group, force group distance (prevents it from using its own data-distance)
          const isNestedSelf = slot.el.matches("[data-reveal-group-nested]");
          const d = isNestedSelf
            ? groupDistance
            : slot.el.getAttribute("data-distance") || groupDistance;
          gsap.set(slot.el, { y: d, autoAlpha: 0 });
        } else {
          // Parent follows the group's distance when included, regardless of nested's data-distance
          if (slot.includeParent)
            gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 });
          // Children use nested group's own distance (fallback to group distance)
          const nestedD =
            slot.nestedEl.getAttribute("data-distance") || groupDistance;
          slot.nestedChildren.forEach((target) =>
            gsap.set(target, { y: nestedD, autoAlpha: 0 })
          );
        }
      });

      // Extra safety: if a nested parent is included, re-assert its distance to the group's value
      slots.forEach((slot) => {
        if (slot.type === "nested" && slot.includeParent) {
          gsap.set(slot.parentEl, { y: groupDistance });
        }
      });

      // Reveal sequence
      ScrollTrigger.create({
        trigger: groupEl,
        start: triggerStart,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          slots.forEach((slot, slotIndex) => {
            const slotTime = slotIndex * groupStaggerSec;

            if (slot.type === "item") {
              tl.to(
                slot.el,
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.el, { clearProps: "all" }),
                },
                slotTime
              );
            } else {
              // Optionally include the parent at the same slot time (parent uses group distance)
              if (slot.includeParent) {
                tl.to(
                  slot.parentEl,
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: animDuration,
                    ease: animEase,
                    onComplete: () =>
                      gsap.set(slot.parentEl, { clearProps: "all" }),
                  },
                  slotTime
                );
              }
              // Nested children use nested stagger (ms → sec); fallback to group stagger
              const nestedMs = parseFloat(
                slot.nestedEl.getAttribute("data-stagger")
              );
              const nestedStaggerSec = isNaN(nestedMs)
                ? groupStaggerSec
                : nestedMs / 1000;
              slot.nestedChildren.forEach((nestedChild, nestedIndex) => {
                tl.to(
                  nestedChild,
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: animDuration,
                    ease: animEase,
                    onComplete: () =>
                      gsap.set(nestedChild, { clearProps: "all" }),
                  },
                  slotTime + nestedIndex * nestedStaggerSec
                );
              });
            }
          });
        },
      });
    });
  });

  return () => ctx.revert();
}

function initPpLens() {
  var lensNodes = document.querySelectorAll("[data-pp-lens]");
  var lensCanvas = document.getElementById("pp-lens-canvas");
  
  if (lensNodes.length === 0 && !lensCanvas) {
    return;
  }

  "use strict";

  var ROOT_ATTR = "data-pp-lens-ready";

  var PALETTE = {
    A: new Float32Array([150 / 255, 175 / 255, 185 / 255]),
    M: new Float32Array([255 / 255, 232 / 255, 198 / 255]),
    B: new Float32Array([224 / 255, 158 / 255, 84 / 255]),
    C: new Float32Array([5 / 255, 5 / 255, 6 / 255]),
    ACC: 1,
    CD: 0.12,
    EB: 1.25
  };

  var EASE_LAMBDA = 3.7;
  var IDLE_MS = 3000;
  var MAX_DT = 0.05;
  var SHADER_TIME_SCALE = 0.42;
  var MAX_DPR = 1.5;
  var MIN_DPR = 0.75;
  var SLOW_FRAME_MS = 28;
  var FAST_FRAME_MS = 18;
  var QUALITY_FRAMES = 45;

  var VERT = "attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}";

  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uCam;",
    "uniform vec3 uColA;uniform vec3 uColM;uniform vec3 uColB;uniform vec3 uColC;",
    "uniform float uAccOp;uniform float uCamDim;uniform float uEnvBoost;",
    "const float BG_R=3.3137;const vec3 LENS_C=vec3(0.,1.28,-1.5);",
    "const float LENS_R=1.4;const float TAN_F=.41421356;",
    "float mod289(float x){return x-floor(x*(1./289.))*289.;}",
    "vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}",
    "vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}",
    "float noise(vec3 p){vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.-2.*d);",
    "vec4 b=a.xxyy+vec4(0.,1.,0.,1.);vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);",
    "vec4 c=k2+a.zzzz;vec4 k3=perm(c);vec4 k4=perm(c+1.);",
    "vec4 o1=fract(k3*(1./41.));vec4 o2=fract(k4*(1./41.));",
    "vec4 o3=o2*d.z+o1*(1.-d.z);vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);",
    "return o4.y*d.y+o4.x*(1.-d.y);}",
    "float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}",
    "mat2 rotate2d(float a){float c=cos(a);float s=sin(a);return mat2(c,-s,s,c);}",
    "float lines(in vec2 pos,float b){pos*=10.;",
    "return smoothstep(0.,.5+b*.5,abs((sin(pos.x*3.1415))+b*2.)*.5);}",
    "vec3 bgShade(vec3 l){float bn=noise(l*2.6+uTime);",
    "vec2 bp=rotate2d(bn)*l.xy*.2;",
    "float b1=lines(bp,.5);float b2=lines(bp,.1);",
    "vec3 bm=mix(mix(uColA,uColM,clamp(b1*2.,0.,1.)),uColB,clamp(b1*2.-1.,0.,1.));",
    "return mix(bm,uColC,b2*uAccOp);}",
    "float sphHit(vec3 oc,vec3 rd,float r2,float far){float b=dot(oc,rd);float h=b*b-(dot(oc,oc)-r2);",
    "if(h<0.)return -1.;h=sqrt(h);if(far>0.5)return -b+h;float t=-b-h;if(t<0.)t=-b+h;return t;}",
    "vec3 sampleBg(vec3 ro,vec3 rd,vec3 fw,vec3 fu,vec3 fv,float cam){",
    "float t=sphHit(ro,rd,BG_R*BG_R,length(ro)<BG_R?1.:0.);",
    "if(t<0.)return uColC;vec3 h=ro+rd*t;",
    "vec3 l=vec3(dot(h,fu),dot(h,fv),dot(h,fw))/BG_R;",
    "return bgShade(l)*mix(uEnvBoost,uCamDim,cam);}",
    "void main(){",
    "vec2 fr=gl_FragCoord.xy;",
    "vec2 s=(fr-.5*uRes)/(.5*uRes.y);",
    "vec3 ro=vec3(-uCam.x*.6,-uCam.y*.3,-4.);",
    "vec3 f=normalize(-ro);",
    "vec3 r=normalize(cross(f,vec3(0.,1.,0.)));",
    "vec3 u=cross(r,f);",
    "vec3 rd=normalize(f+TAN_F*(s.x*r+s.y*u));",
    "vec3 fw=normalize(ro);",
    "vec3 fu=normalize(cross(vec3(0.,1.,0.),fw));",
    "vec3 fv=cross(fw,fu);",
    "vec3 col;",
    "float tL=sphHit(ro-LENS_C,rd,LENS_R*LENS_R,0.);",
    "if(tL>0.){",
    "vec3 p=ro+rd*tL;vec3 n=normalize(p-LENS_C);",
    "float F=clamp(.016+2.442*pow(max(1.+dot(rd,n),0.),4.206),0.,1.);",
    "vec3 rr=refract(rd,n,.014);vec3 rg=refract(rd,n,.016);vec3 rb=refract(rd,n,.018);",
    "vec3 rc;",
    "rc.r=sampleBg(LENS_C,rr,fw,fu,fv,0.).r;",
    "rc.g=sampleBg(LENS_C,rg,fw,fu,fv,0.).g;",
    "rc.b=sampleBg(LENS_C,rb,fw,fu,fv,0.).b;",
    "vec3 through=sampleBg(ro,rd,fw,fu,fv,1.);",
    "vec3 body=mix(through,rc,.75);",
    "vec3 refl=sampleBg(LENS_C,reflect(rd,n),fw,fu,fv,0.);",
    "col=mix(body,refl,F);",
    "}else{",
    "col=sampleBg(ro,rd,fw,fu,fv,1.);",
    "}",
    "col+=(random(fr*.75+fract(uTime*7.)*91.)-.5)*.10;",
    "col*=smoothstep(-.95,.15,s.y);",
    "gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function showFallback(root, canvas, message) {
    var p = document.createElement("p");
    p.className = "pp-lens__fallback";
    p.textContent = message;
    if (canvas.parentNode) canvas.parentNode.replaceChild(p, canvas);
  }

  function compile(gl, type, src) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl) {
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return null;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  function initLens(root) {
    if (!root || root.getAttribute(ROOT_ATTR)) return;

    var canvas = root.querySelector(".pp-lens__canvas") || root.querySelector("canvas");
    if (!canvas) return;
    root.setAttribute(ROOT_ATTR, "1");

    var gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    }) || canvas.getContext("experimental-webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      showFallback(root, canvas, "WebGL wird nicht unterstützt.");
      return;
    }

    var prog = createProgram(gl);
    if (!prog) {
      showFallback(root, canvas, "Der Shader konnte nicht geladen werden.");
      return;
    }

    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    function uni(name) {
      return gl.getUniformLocation(prog, name);
    }

    var U = {
      uRes: uni("uRes"),
      uTime: uni("uTime"),
      uCam: uni("uCam"),
      uColA: uni("uColA"),
      uColM: uni("uColM"),
      uColB: uni("uColB"),
      uColC: uni("uColC"),
      uAccOp: uni("uAccOp"),
      uCamDim: uni("uCamDim"),
      uEnvBoost: uni("uEnvBoost")
    };

    gl.uniform3fv(U.uColA, PALETTE.A);
    gl.uniform3fv(U.uColM, PALETTE.M);
    gl.uniform3fv(U.uColB, PALETTE.B);
    gl.uniform3fv(U.uColC, PALETTE.C);
    gl.uniform1f(U.uAccOp, PALETTE.ACC);
    gl.uniform1f(U.uCamDim, PALETTE.CD);
    gl.uniform1f(U.uEnvBoost, PALETTE.EB);

    var quality = 1;
    var slowStreak = 0;
    var fastStreak = 0;
    var W = 0;
    var H = 0;
    var target = { x: 0, y: 0 };
    var pos = { x: 0, y: 0 };
    var lastMove = 0;
    var shaderTime = 0;
    var last = performance.now();
    var raf = 0;
    var running = false;
    var lost = false;
    var inView = true;

    function hostSize() {
      var w = root.clientWidth || canvas.clientWidth;
      var h = root.clientHeight || canvas.clientHeight;
      return { w: w, h: h };
    }

    function dprCap() {
      var raw = window.devicePixelRatio || 1;
      return Math.min(Math.max(raw, 1), MAX_DPR) * quality;
    }

    function resize() {
      var size = hostSize();
      var d = Math.max(MIN_DPR, dprCap());
      var nextW = Math.max(1, Math.floor(size.w * d));
      var nextH = Math.max(1, Math.floor(size.h * d));
      if (nextW === W && nextH === H) return;
      W = nextW;
      H = nextH;
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(U.uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    function setTarget(clientX, clientY) {
      var rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = -((clientY - rect.top) / rect.height - 0.5) * 2;
      lastMove = performance.now();
    }

    var reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var reduceMotion = !!(reduceMotionQuery && reduceMotionQuery.matches);

    function onReduceMotionChange() {
      reduceMotion = !!(reduceMotionQuery && reduceMotionQuery.matches);
    }

    function adaptQuality(frameMs) {
      if (frameMs > SLOW_FRAME_MS) {
        slowStreak += 1;
        fastStreak = 0;
        if (slowStreak >= QUALITY_FRAMES && quality > MIN_DPR / MAX_DPR) {
          quality = Math.max(MIN_DPR / MAX_DPR, quality * 0.85);
          slowStreak = 0;
          W = 0;
          H = 0;
          resize();
        }
      } else if (frameMs < FAST_FRAME_MS && quality < 1) {
        fastStreak += 1;
        slowStreak = 0;
        if (fastStreak >= QUALITY_FRAMES) {
          quality = Math.min(1, quality / 0.85);
          fastStreak = 0;
          W = 0;
          H = 0;
          resize();
        }
      } else {
        slowStreak = 0;
        fastStreak = 0;
      }
    }

    function frame(now) {
      raf = 0;
      if (!running || lost) return;

      var dt = Math.min((now - last) / 1000, MAX_DT);
      var frameMs = now - last;
      last = now;

      if (!reduceMotion) {
        shaderTime += SHADER_TIME_SCALE * dt;
        if (now - lastMove > IDLE_MS) {
          var t = now / 1000;
          target.x = Math.cos(t * 0.3) * 0.6;
          target.y = Math.sin(t * 0.23) * 0.5;
        }
      }

      var ease = 1 - Math.exp(-EASE_LAMBDA * dt);
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;

      gl.uniform1f(U.uTime, shaderTime);
      gl.uniform2f(U.uCam, pos.x, pos.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      adaptQuality(frameMs);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || lost || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function syncPlayback() {
      if (document.hidden || !inView) stop();
      else start();
    }

    function onContextLost(e) {
      e.preventDefault();
      lost = true;
      stop();
    }

    function onContextRestored() {
      lost = false;
      root.removeAttribute(ROOT_ATTR);
      initLens(root);
    }

    function onPointer(e) {
      setTarget(e.clientX, e.clientY);
    }

    function onTouch(e) {
      var t = e.touches[0];
      if (t) setTarget(t.clientX, t.clientY);
    }

    resize();

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(resize);
      ro.observe(root);
    } else {
      window.addEventListener("resize", resize);
      if (window.visualViewport) window.visualViewport.addEventListener("resize", resize);
    }

    if (window.PointerEvent) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    } else {
      window.addEventListener("mousemove", onPointer, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
    }

    if (reduceMotionQuery) {
      if (reduceMotionQuery.addEventListener) {
        reduceMotionQuery.addEventListener("change", onReduceMotionChange);
      } else if (reduceMotionQuery.addListener) {
        reduceMotionQuery.addListener(onReduceMotionChange);
      }
    }

    document.addEventListener("visibilitychange", syncPlayback);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        inView = entries.some(function (entry) { return entry.isIntersecting; });
        syncPlayback();
      }, { threshold: 0.01 });
      io.observe(root);
    }

    syncPlayback();
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-pp-lens]");
    if (!nodes.length) {
      var canvas = document.getElementById("pp-lens-canvas");
      if (canvas && canvas.parentNode) initLens(canvas.parentNode);
      return;
    }
    for (var i = 0; i < nodes.length; i++) initLens(nodes[i]);
  }

  if (window.Webflow && typeof window.Webflow.push === "function") {
    window.Webflow.push(boot);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}

function initNumberOdometer() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const initFlag = 'data-odometer-initialized'
  const activeTweens = new WeakMap()

  // Configuration
  const defaults = {
    duration: 1,
    ease: 'power3.out',
    elementStagger: 0.1,
    digitStagger: 0.04,
    revealDuration: 0.5,
    revealEase: 'power2.out',
    triggerStart: 'top 80%',
    staggerOrder: 'left',
    digitCycles: 2
  }

  // Scroll-triggered groups
  document.querySelectorAll('[data-odometer-group]').forEach(group => {
    if (group.hasAttribute(initFlag)) return
    group.setAttribute(initFlag, '')

    const elements = Array.from(group.querySelectorAll('[data-odometer-element]'))
    if (!elements.length || prefersReducedMotion) return

    const staggerOrder = group.getAttribute('data-odometer-stagger-order') || defaults.staggerOrder
    const triggerStart = group.getAttribute('data-odometer-trigger-start') || defaults.triggerStart
    const elementStagger = parseFloat(group.getAttribute('data-odometer-stagger')) || defaults.elementStagger

    const elementData = elements.map(el => {
      const originalText = el.textContent.trim()
      const hasExplicitStart = el.hasAttribute('data-odometer-start')
      const startValue = parseFloat(el.getAttribute('data-odometer-start')) || 0
      const duration = parseFloat(el.getAttribute('data-odometer-duration')) || defaults.duration
      const step = getLineHeightRatio(el)

      let segments = parseSegments(originalText)
      segments = mapStartDigits(segments, startValue)
      segments = markHiddenSegments(segments, startValue)

      const grow = shouldGrow(el, hasExplicitStart, startValue, segments)
      const { rollers, revealEls } = buildRollerDOM(el, segments, step, grow)

      const fontSize = parseFloat(getComputedStyle(el).fontSize)
      const revealData = revealEls.map(revealEl => {
        const widthEm = revealEl.offsetWidth / fontSize
        gsap.set(revealEl, { width: 0, overflow: 'hidden' })
        return { el: revealEl, widthEm }
      })

      return { el, rollers, duration, step, revealData, originalText }
    })

    const ordered = applyStaggerOrder(elementData, staggerOrder)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: triggerStart,
        once: true
      },
      onComplete() {
        elementData.forEach(({ el, originalText, step }) => {
          cleanupElement(el, originalText)
        })
      }
    })

    ordered.forEach((data, orderIdx) => {
      const { rollers, duration, step, revealData } = data
      const offset = orderIdx * elementStagger

      revealData.forEach(({ el, widthEm }) => {
        tl.to(el, {
          width: widthEm + 'em',
          opacity: 1,
          duration: defaults.revealDuration,
          ease: defaults.revealEase
        }, offset)
      })

      rollers.forEach(({ roller, targetPos }, digitIdx) => {
        const reversedIdx = rollers.length - 1 - digitIdx
        tl.to(roller, {
          y: -targetPos * step + 'em',
          duration,
          ease: defaults.ease,
          force3D: true
        }, offset + reversedIdx * defaults.digitStagger)
      })
    })
  })

  // Programmatic update (optional add-on)
  return function updateOdometer(el, newText, options = {}) {
    const currentText = el.textContent.trim()
    if (currentText === newText) return

    const duration = options.duration || defaults.duration
    const ease = options.ease || defaults.ease
    const step = getLineHeightRatio(el)

    // Kill any running animation and clear its inline style locks
    const existing = activeTweens.get(el)
    if (existing) {
      existing.kill()
      gsap.set(el, { clearProps: 'width,overflow' })
    }

    // Measure current width before rebuilding (in em for responsive scaling)
    const fontSize = parseFloat(getComputedStyle(el).fontSize)
    const oldWidthEm = el.getBoundingClientRect().width / fontSize

    // Parse current text as start, new text as end
    const startSegments = parseSegments(currentText)
    const startDigitsStr = startSegments
      .filter(s => s.type === 'digit')
      .map(s => s.char)
      .join('')
    const startValue = parseInt(startDigitsStr, 10) || 0

    let segments = parseSegments(newText)
    segments = mapStartDigits(segments, startValue)
    segments = markHiddenSegments(segments, startValue)
    const { rollers, revealEls } = buildRollerDOM(el, segments, step, true)

    // Measure new natural width (in em)
    const newWidthEm = el.getBoundingClientRect().width / fontSize
    const widthChanged = Math.abs(oldWidthEm - newWidthEm) > 0.01

    // Lock to old width for smooth transition
    if (widthChanged) {
      gsap.set(el, { width: oldWidthEm + 'em', overflow: 'hidden' })
    }

    const tl = gsap.timeline({
      onComplete() {
        cleanupElement(el, newText)
        activeTweens.delete(el)
      }
    })
    activeTweens.set(el, tl)

    // Animate element width
    if (widthChanged) {
      tl.to(el, {
        width: newWidthEm + 'em',
        duration: defaults.revealDuration,
        ease: defaults.revealEase
      }, 0)
    }

    // Fade in hidden statics
    revealEls.forEach(revealEl => {
      if (revealEl.getAttribute('data-odometer-part') === 'static') {
        tl.to(revealEl, { opacity: 1, duration: 0.2 }, 0)
      }
    })

    // Roll digits
    rollers.forEach(({ roller, targetPos }, digitIdx) => {
      const reversedIdx = rollers.length - 1 - digitIdx
      tl.to(roller, {
        y: -targetPos * step + 'em',
        duration,
        ease,
        force3D: true
      }, reversedIdx * defaults.digitStagger)
    })
  }

  // Helpers
  function getLineHeightRatio(el) {
    const cs = getComputedStyle(el)
    const lh = cs.lineHeight
    if (lh === 'normal') return 1.2
    return parseFloat(lh) / parseFloat(cs.fontSize)
  }

  function parseSegments(text) {
    return [...text].map(char => ({
      type: /\d/.test(char) ? 'digit' : 'static',
      char
    }))
  }

  function mapStartDigits(segments, startValue) {
    const digitSlots = segments.filter(s => s.type === 'digit')
    const padded = String(Math.floor(Math.abs(startValue)))
      .padStart(digitSlots.length, '0')
      .slice(-digitSlots.length)
    let di = 0
    return segments.map(s =>
      s.type === 'digit'
        ? { ...s, startDigit: parseInt(padded[di++], 10) }
        : s
    )
  }

  function markHiddenSegments(segments, startValue) {
    const totalDigits = segments.filter(s => s.type === 'digit').length
    const absStart = Math.floor(Math.abs(startValue))
    const startDigitCount = absStart === 0 ? 1 : String(absStart).length
    const leadingZeros = Math.max(0, totalDigits - startDigitCount)
    if (leadingZeros === 0) return segments
    let digitsSeen = 0
    let firstDigitSeen = false
    let prevDigitHidden = false
    return segments.map(seg => {
      if (seg.type === 'digit') {
        firstDigitSeen = true
        const hidden = digitsSeen < leadingZeros
        prevDigitHidden = hidden
        digitsSeen++
        return { ...seg, hidden }
      }
      const hidden = firstDigitSeen && prevDigitHidden
      return { ...seg, hidden }
    })
  }

  function shouldGrow(el, hasExplicitStart, startValue, segments) {
    if (el.hasAttribute('data-odometer-grow')) {
      return el.getAttribute('data-odometer-grow') !== 'false'
    }
    if (!hasExplicitStart) return false
    const absStart = Math.floor(Math.abs(startValue))
    const startDigitCount = absStart === 0 ? 1 : String(absStart).length
    const endDigitCount = segments.filter(s => s.type === 'digit').length
    return startDigitCount < endDigitCount
  }

  function buildRollerDOM(el, segments, step, grow) {
    el.innerHTML = ''
    el.style.height = ''
    const rollers = []
    const revealEls = []
    const totalCells = 10 * defaults.digitCycles
    segments.forEach(seg => {
      if (seg.type === 'static') {
        const span = document.createElement('span')
        span.setAttribute('data-odometer-part', 'static')
        span.style.height = step + 'em'
        span.style.lineHeight = step
        span.textContent = seg.char
        el.appendChild(span)
        if (grow && seg.hidden) {
          gsap.set(span, { opacity: 0 })
          revealEls.push(span)
        }
        return
      }
      const mask = document.createElement('span')
      mask.setAttribute('data-odometer-part', 'mask')
      mask.style.height = step + 'em'
      mask.style.lineHeight = step
      const roller = document.createElement('span')
      roller.setAttribute('data-odometer-part', 'roller')
      roller.style.lineHeight = step

      const digits = []
      for (let d = 0; d < totalCells; d++) {
        digits.push(d % 10)
      }
      roller.textContent = digits.join('\n')
      mask.appendChild(roller)
      el.appendChild(mask)
      const startDigit = seg.startDigit || 0
      const isReveal = grow && seg.hidden
      gsap.set(roller, { y: isReveal ? step + 'em' : -startDigit * step + 'em' })
      const endDigit = parseInt(seg.char, 10)
      const targetPos = endDigit > startDigit ? endDigit : 10 + endDigit
      rollers.push({ roller, targetPos })
      if (isReveal) revealEls.push(mask)
    })
    return { rollers, revealEls }
  }

  function cleanupElement(el, originalText) {
    el.style.overflow = ''
    el.style.height = ''

    // Remove rollers, set final digit, clear inline bloat (but preserve width)
    const digits = [...originalText].filter(c => /\d/.test(c))
    let di = 0

    el.querySelectorAll('[data-odometer-part="mask"]').forEach(mask => {
      const roller = mask.querySelector('[data-odometer-part="roller"]')
      if (roller) roller.remove()
      mask.textContent = digits[di++] || ''
      mask.style.opacity = ''
      mask.style.overflow = ''
    })

    el.querySelectorAll('[data-odometer-part="static"]').forEach(stat => {
      stat.style.opacity = ''
    })
  }

  function recalcOnResize() {
    document.querySelectorAll('[data-odometer-element]').forEach(el => {
      // Force-complete any running programmatic animation
      const running = activeTweens.get(el)
      if (running) {
        running.progress(1)
        activeTweens.delete(el)
      }

      const hasRollers = el.querySelector('[data-odometer-part="roller"]')

      if (hasRollers) {
        // Pre-triggered: recalculate step-based inline styles
        const step = getLineHeightRatio(el)
        el.querySelectorAll('[data-odometer-part="mask"]').forEach(mask => {
          mask.style.height = step + 'em'
          mask.style.lineHeight = step
        })
        el.querySelectorAll('[data-odometer-part="roller"]').forEach(roller => {
          roller.style.lineHeight = step
        })
        el.querySelectorAll('[data-odometer-part="static"]').forEach(stat => {
          stat.style.lineHeight = step
        })
      }
      // Completed elements: width is em-based, scales automatically, don't touch
    })
    ScrollTrigger.refresh()
  }

  let resizeTimer
  let lastWidth = window.innerWidth
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      recalcOnResize()
    }, 250)
  })

  function applyStaggerOrder(items, order) {
    const arr = [...items]
    if (order === 'right') return arr.reverse()
    if (order === 'random') return shuffleArray(arr)
    return arr
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
}