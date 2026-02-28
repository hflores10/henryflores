(() => {
  const page = document.querySelector(".page");
  const menu = document.getElementById("navMenu");
  const toggle = document.querySelector(".nav__toggle");
  const themeBtn = document.querySelector(".nav__theme");
  const year = document.getElementById("year");

  // Año en footer
  if (year) year.textContent = String(new Date().getFullYear());

  // Menú móvil
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Cierra al hacer click en un link
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement && target.classList.contains("nav__link")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Tema (dark/light)
  const THEME_KEY = "hf_theme";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") page.setAttribute("data-theme", saved);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = page.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      page.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // Filtros de proyectos
  const chips = document.querySelectorAll(".chip");
  const projects = document.querySelectorAll(".project");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      const filter = chip.getAttribute("data-filter") || "all";

      projects.forEach((p) => {
        const category = p.getAttribute("data-category");
        const show = filter === "all" || category === filter;
        p.style.display = show ? "block" : "none";
      });
    });
  });
})();