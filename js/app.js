(function () {
  const catalog = window.CATALOGO_ACADEMICO;
  const state = {
    path: [],
    query: "",
  };

  const labelsByDepth = [
    "Ciclos disponibles",
    "Cursos del ciclo",
    "Semanas del curso",
    "Sesiones de la semana",
    "Carpetas de la sesión",
    "Archivos descargables",
  ];

  const titlesByDepth = [
    "Selecciona un ciclo",
    "Selecciona un curso",
    "Selecciona una semana",
    "Selecciona una sesión",
    "Selecciona prácticas o manuales",
    "Descarga el material",
  ];

  const nodes = {
    backButton: document.querySelector("#backButton"),
    breadcrumbs: document.querySelector("#breadcrumbs"),
    browserTitle: document.querySelector("#browserTitle"),
    clearSearch: document.querySelector("#clearSearch"),
    courseCount: document.querySelector("#courseCount"),
    cycleCount: document.querySelector("#cycleCount"),
    detailsDescription: document.querySelector("#detailsDescription"),
    detailsList: document.querySelector("#detailsList"),
    detailsTitle: document.querySelector("#detailsTitle"),
    emptyState: document.querySelector("#emptyState"),
    fileCount: document.querySelector("#fileCount"),
    folderGrid: document.querySelector("#folderGrid"),
    levelLabel: document.querySelector("#levelLabel"),
    quickDownloads: document.querySelector("#quickDownloads"),
    recentGrid: document.querySelector("#recentGrid"),
    resultCount: document.querySelector("#resultCount"),
    searchForm: document.querySelector("#searchForm"),
    searchInput: document.querySelector("#searchInput"),
    themeToggle: document.querySelector("#themeToggle"),
  };

  const text = (value) => String(value || "").trim();
  const normalize = (value) =>
    text(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  function init() {
    const savedTheme = localStorage.getItem("hf-theme");
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    }

    renderStats();
    render();
    renderRecent();
    bindEvents();
  }

  function bindEvents() {
    nodes.folderGrid.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-open-id]");
      if (openButton) {
        state.path.push(openButton.dataset.openId);
        state.query = "";
        nodes.searchInput.value = "";
        render();
        return;
      }
    });

    nodes.backButton.addEventListener("click", () => {
      state.path.pop();
      render();
    });

    nodes.breadcrumbs.addEventListener("click", (event) => {
      const crumb = event.target.closest("[data-depth]");
      if (!crumb) return;
      const depth = Number(crumb.dataset.depth);
      state.path = state.path.slice(0, depth);
      render();
    });

    nodes.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    nodes.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });

    nodes.clearSearch.addEventListener("click", () => {
      state.query = "";
      nodes.searchInput.value = "";
      render();
      nodes.searchInput.focus();
    });

    nodes.themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "" : "light";
      if (nextTheme) {
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("hf-theme", nextTheme);
      } else {
        delete document.documentElement.dataset.theme;
        localStorage.removeItem("hf-theme");
      }
    });
  }

  function renderStats() {
    const courses = catalog.ciclos.flatMap((cycle) => cycle.cursos);
    nodes.cycleCount.textContent = catalog.ciclos.length;
    nodes.courseCount.textContent = courses.length;
    nodes.fileCount.textContent = collectFiles().length;
  }

  function render() {
    const query = normalize(state.query);
    const results = query ? searchFiles(query) : getCurrentItems();
    const isFileLevel = query || state.path.length === 5;

    nodes.backButton.disabled = state.path.length === 0;
    nodes.levelLabel.textContent = query ? "Resultados de búsqueda" : labelsByDepth[state.path.length];
    nodes.browserTitle.textContent = query ? `Resultados para "${state.query}"` : titlesByDepth[state.path.length];
    nodes.resultCount.textContent = `${results.length} ${results.length === 1 ? "elemento" : "elementos"}`;

    renderBreadcrumbs();
    renderGrid(results, isFileLevel);
    renderDetails(query ? null : getSelectedTrail());

    nodes.emptyState.hidden = results.length > 0;
  }

  function renderBreadcrumbs() {
    const trail = getSelectedTrail();
    const crumbs = [{ depth: 0, label: "Ciclos" }].concat(
      trail.map((entry, index) => ({
        depth: index + 1,
        label: entry.nombre || entry.titulo,
      }))
    );

    nodes.breadcrumbs.innerHTML = crumbs
      .map(
        (crumb) =>
          `<button class="crumb" type="button" data-depth="${crumb.depth}">${escapeHtml(crumb.label)}</button>`
      )
      .join("");
  }

  function renderGrid(items, isFileLevel) {
    nodes.folderGrid.innerHTML = items
      .map((item) => (isFileLevel ? renderFileCard(item) : renderFolderCard(item)))
      .join("");
  }

  function renderFolderCard(item) {
    const count = item.count ?? countChildren(item);
    const meta = item.meta || getMetaLabel(item);

    return `
      <article class="item-card">
        <div class="item-top">
          <span class="item-icon" aria-hidden="true"></span>
          <div class="item-content">
            <h3>${escapeHtml(item.nombre)}</h3>
            <p>${escapeHtml(item.descripcion || item.tema || "Material académico organizado.")}</p>
          </div>
        </div>
        <div class="meta-row">
          <span class="badge">${escapeHtml(meta)}</span>
          <span class="badge warning">${count} ${count === 1 ? "item" : "items"}</span>
        </div>
        <div class="card-actions">
          <button class="primary-button" type="button" data-open-id="${escapeHtml(item.id)}">Abrir</button>
        </div>
      </article>
    `;
  }

  function renderFileCard(item) {
    const title = item.titulo || item.nombre;
    const trail = item.trail ? `<span class="badge rose">${escapeHtml(item.trail)}</span>` : "";

    return `
      <article class="item-card">
        <div class="item-top">
          <span class="item-icon file" aria-hidden="true"></span>
          <div class="item-content">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(item.descripcion || "Archivo disponible para descarga.")}</p>
          </div>
        </div>
        <div class="meta-row">
          <span class="badge">${escapeHtml(item.tipo || "Archivo")}</span>
          <span class="badge">${escapeHtml(item.tamano || "Disponible")}</span>
          ${trail}
        </div>
        <div class="card-actions">
          <a class="primary-button" href="${encodeURI(item.href)}" download>Descargar</a>
          <a class="secondary-button" href="${encodeURI(item.href)}">Ver</a>
        </div>
      </article>
    `;
  }

  function renderDetails(trail) {
    const selected = trail && trail.length ? trail[trail.length - 1] : null;
    const sessionFiles = getFilesForCurrentContext();

    nodes.detailsTitle.textContent = selected ? selected.nombre || selected.titulo : "Catálogo completo";
    nodes.detailsDescription.textContent = selected
      ? selected.descripcion || selected.tema || "Selecciona el siguiente nivel para continuar."
      : "Navega por las carpetas para llegar a las prácticas y manuales de cada sesión.";

    const detailRows = selected
      ? [
          ["Ruta", buildCurrentPathLabel(trail)],
          ["Siguiente", labelsByDepth[Math.min(state.path.length + 1, labelsByDepth.length - 1)]],
          ["Archivos", `${sessionFiles.length} disponibles`],
        ]
      : [
          ["Ciclos", String(catalog.ciclos.length)],
          ["Cursos", String(catalog.ciclos.flatMap((cycle) => cycle.cursos).length)],
          ["Archivos", String(collectFiles().length)],
        ];

    nodes.detailsList.innerHTML = detailRows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");

    nodes.quickDownloads.innerHTML = sessionFiles.length
      ? sessionFiles
          .slice(0, 5)
          .map(
            (file) => `
              <a class="quick-link" href="${encodeURI(file.href)}" download>
                <strong>${escapeHtml(file.titulo)}</strong>
                <span>${escapeHtml(file.tipo || "Archivo")}</span>
              </a>
            `
          )
          .join("")
      : `<button class="ghost-button" type="button" disabled>Sin descargas en esta ruta</button>`;
  }

  function renderRecent() {
    const recent = collectFiles()
      .sort((a, b) => new Date(b.actualizado || 0) - new Date(a.actualizado || 0))
      .slice(0, 4);

    nodes.recentGrid.innerHTML = recent.map(renderFileCard).join("");
  }

  function getCurrentItems() {
    const [cycleId, courseId, weekId, sessionId, categoryId] = state.path;

    if (!cycleId) return catalog.ciclos;

    const cycle = catalog.ciclos.find((item) => item.id === cycleId);
    if (!courseId) return cycle?.cursos || [];

    const course = cycle?.cursos.find((item) => item.id === courseId);
    if (!weekId) return course?.semanas || [];

    const week = course?.semanas.find((item) => item.id === weekId);
    if (!sessionId) return week?.sesiones || [];

    const session = week?.sesiones.find((item) => item.id === sessionId);
    if (!categoryId) return getSessionCategories(session);

    return categoryId === "practicas" ? session?.practicas || [] : session?.manuales || [];
  }

  function getSelectedTrail() {
    const trail = [];
    const [cycleId, courseId, weekId, sessionId, categoryId] = state.path;
    const cycle = catalog.ciclos.find((item) => item.id === cycleId);
    if (!cycle) return trail;
    trail.push(cycle);

    const course = cycle.cursos.find((item) => item.id === courseId);
    if (!course) return trail;
    trail.push(course);

    const week = course.semanas.find((item) => item.id === weekId);
    if (!week) return trail;
    trail.push(week);

    const session = week.sesiones.find((item) => item.id === sessionId);
    if (!session) return trail;
    trail.push(session);

    if (categoryId) {
      trail.push(getSessionCategories(session).find((item) => item.id === categoryId));
    }

    return trail.filter(Boolean);
  }

  function getSessionCategories(session) {
    if (!session) return [];
    return [
      {
        id: "practicas",
        nombre: "Prácticas",
        descripcion: "Ejercicios, retos y evidencias descargables.",
        count: session.practicas.length,
        meta: "Carpeta",
      },
      {
        id: "manuales",
        nombre: "Manuales",
        descripcion: "Guías, lecturas y referencias de la sesión.",
        count: session.manuales.length,
        meta: "Carpeta",
      },
    ];
  }

  function getFilesForCurrentContext() {
    const [cycleId, courseId, weekId, sessionId, categoryId] = state.path;
    if (!cycleId) return collectFiles();

    const files = collectFiles().filter((file) => {
      const path = file.path;
      return (
        (!cycleId || path.cycleId === cycleId) &&
        (!courseId || path.courseId === courseId) &&
        (!weekId || path.weekId === weekId) &&
        (!sessionId || path.sessionId === sessionId) &&
        (!categoryId || path.categoryId === categoryId)
      );
    });

    return files;
  }

  function collectFiles() {
    const files = [];
    catalog.ciclos.forEach((cycle) => {
      cycle.cursos.forEach((course) => {
        course.semanas.forEach((week) => {
          week.sesiones.forEach((session) => {
            [
              ["practicas", "Prácticas", session.practicas],
              ["manuales", "Manuales", session.manuales],
            ].forEach(([categoryId, categoryLabel, items]) => {
              items.forEach((file) => {
                files.push({
                  ...file,
                  trail: `${cycle.nombre} / ${course.nombre} / ${week.nombre} / ${session.nombre} / ${categoryLabel}`,
                  path: {
                    cycleId: cycle.id,
                    courseId: course.id,
                    weekId: week.id,
                    sessionId: session.id,
                    categoryId,
                  },
                });
              });
            });
          });
        });
      });
    });
    return files;
  }

  function searchFiles(query) {
    return collectFiles().filter((file) => {
      const haystack = [
        file.titulo,
        file.descripcion,
        file.tipo,
        file.trail,
      ]
        .map(normalize)
        .join(" ");

      return haystack.includes(query);
    });
  }

  function countChildren(item) {
    if (item.cursos) return item.cursos.length;
    if (item.semanas) return item.semanas.length;
    if (item.sesiones) return item.sesiones.length;
    if (item.practicas || item.manuales) return (item.practicas?.length || 0) + (item.manuales?.length || 0);
    return 0;
  }

  function getMetaLabel(item) {
    if (item.cursos) return "Ciclo";
    if (item.semanas) return "Curso";
    if (item.sesiones) return "Semana";
    if (item.practicas || item.manuales) return "Sesión";
    return "Carpeta";
  }

  function buildCurrentPathLabel(trail) {
    return trail.map((entry) => entry.nombre || entry.titulo).join(" / ");
  }

  function escapeHtml(value) {
    return text(value).replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return entities[char];
    });
  }

  init();
})();
