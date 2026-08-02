// ========================================
// Kubernetes Learning Guide - Behaviour
// ========================================

(function () {
  "use strict";

  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuToggle = document.getElementById("menuToggle");
  const searchInput = document.getElementById("searchInput");
  const backToTop = document.getElementById("backToTop");
  const noResults = document.getElementById("noResults");

  // ---------- Theme ----------
  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("k8s-guide-theme", theme);
    if (themeBtn) themeBtn.textContent = currentIsDark() ? "☀️" : "🌙";
  }

  function currentIsDark() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const savedTheme = localStorage.getItem("k8s-guide-theme");
  if (savedTheme) applyTheme(savedTheme);
  else if (themeBtn) themeBtn.textContent = currentIsDark() ? "☀️" : "🌙";

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(currentIsDark() ? "light" : "dark");
    });
  }

  // ---------- Mobile sidebar ----------
  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
  if (menuToggle) menuToggle.addEventListener("click", openSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);
  sidebar.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (window.innerWidth <= 900) closeSidebar();
    })
  );

  // ---------- Copy buttons ----------
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const block = btn.closest(".code-block");
      const codeEl = block.querySelector("pre code");
      const text = codeEl.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1500);
      });
    });
  });

  // ---------- Scroll spy ----------
  const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
  const targets = navLinks
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );
  targets.forEach((t) => spyObserver.observe(t));

  // ---------- Search / filter ----------
  const concepts = Array.from(document.querySelectorAll(".concept-card"));
  const categories = Array.from(document.querySelectorAll(".category"));

  function normalize(str) {
    return str.toLowerCase();
  }

  function clearHighlights(el) {
    el.querySelectorAll("mark").forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function highlight(el, term) {
    if (!term) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentNode.closest("pre")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    nodes.forEach((node) => {
      if (!re.test(node.nodeValue)) return;
      re.lastIndex = 0;
      const span = document.createElement("span");
      span.innerHTML = node.nodeValue.replace(re, "<mark>$1</mark>");
      node.parentNode.replaceChild(span, node);
    });
  }

  let debounceTimer;
  function runSearch() {
    const term = normalize(searchInput.value.trim());
    let anyVisible = false;

    concepts.forEach((card) => clearHighlights(card));

    concepts.forEach((card) => {
      const haystack = normalize(card.dataset.search || card.textContent);
      const match = !term || haystack.includes(term);
      card.classList.toggle("hidden", !match);
      if (match) {
        anyVisible = true;
        if (term) highlight(card, searchInput.value.trim());
      }
    });

    categories.forEach((cat) => {
      const visibleCards = cat.querySelectorAll(".concept-card:not(.hidden)").length;
      const isCheatsheet = cat.classList.contains("no-cards-filter");
      cat.classList.toggle("hidden", !isCheatsheet && term && visibleCards === 0);
    });

    noResults.classList.toggle("hidden", anyVisible || !term);
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 120);
    });
  }

  // ---------- Back to top ----------
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
