(function () {
  const catalog = window.CATALOGO_ACADEMICO;
  const state = {
    path: [],
    query: "",
  };

  const labelsByDepth = [
    "Ciclos disponibles",
    "Cursos del ciclo",
    "Carpetas del curso",
    "Sesiones de la semana",
    "Carpetas de la sesión",
    "Archivos descargables",
  ];

  const titlesByDepth = [
    "Selecciona un ciclo",
    "Selecciona un curso",
    "Selecciona documentos o una semana",
    "Selecciona una sesión",
    "Selecciona prácticas, manuales, audios o exámenes",
    "Descarga el material",
  ];

  const courseDocumentDefinitions = [
    {
      id: "manual-del-curso",
      key: "manualCurso",
      nombre: "Manual del curso",
      descripcion: "Guía principal, separatas o manual institucional del curso.",
      meta: "Documentos del curso",
    },
    {
      id: "silabo",
      key: "silabo",
      nombre: "Sílabo",
      descripcion: "Plan de contenidos, evaluación, competencias y bibliografía.",
      meta: "Documentos del curso",
    },
  ];

  const sessionDocumentDefinitions = [
    {
      id: "practicas",
      key: "practicas",
      nombre: "Prácticas",
      descripcion: "Ejercicios, retos y evidencias descargables.",
    },
    {
      id: "manuales",
      key: "manuales",
      nombre: "Manuales",
      descripcion: "Guías, lecturas y referencias de la sesión.",
    },
    {
      id: "audios",
      key: "audios",
      nombre: "Audios",
      descripcion: "Pistas cortas en MP3 para escucha, vocabulario y pronunciación.",
    },
    {
      id: "examenes",
      key: "examenes",
      nombre: "Exámenes",
      descripcion: "Evaluaciones, bancos de preguntas y simulacros.",
    },
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
    const view = query
      ? {
          items: searchFiles(query),
          isFileLevel: true,
          label: "Resultados de búsqueda",
          title: `Resultados para "${state.query}"`,
        }
      : getCurrentView();

    nodes.backButton.disabled = state.path.length === 0;
    nodes.levelLabel.textContent = view.label;
    nodes.browserTitle.textContent = view.title;
    nodes.resultCount.textContent = `${view.items.length} ${view.items.length === 1 ? "elemento" : "elementos"}`;

    renderBreadcrumbs();
    renderGrid(view.items, view.isFileLevel);
    renderDetails(query ? null : getSelectedTrail());

    nodes.emptyState.hidden = view.items.length > 0;
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
    const status = item.estado ? `<span class="badge warning">${escapeHtml(item.estado)}</span>` : "";

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
          ${status}
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
    const contextFiles = getFilesForCurrentContext();

    nodes.detailsTitle.textContent = selected ? selected.nombre || selected.titulo : "Catálogo completo";
    nodes.detailsDescription.textContent = selected
      ? selected.descripcion || selected.tema || "Selecciona el siguiente nivel para continuar."
      : "Navega por las carpetas para llegar a las prácticas y manuales de cada sesión.";

    const detailRows = selected
      ? buildDetailRows(selected, trail, contextFiles.length)
      : [
          ["Ciclos", String(catalog.ciclos.length)],
          ["Cursos", String(catalog.ciclos.flatMap((cycle) => cycle.cursos).length)],
          ["Archivos", String(collectFiles().length)],
        ];

    nodes.detailsList.innerHTML = detailRows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");

    nodes.quickDownloads.innerHTML = contextFiles.length
      ? contextFiles
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

  function getCurrentView() {
    const items = getCurrentItems();
    const isFileLevel = items.length > 0 && items.every((item) => item.href);
    const depth = Math.min(state.path.length, labelsByDepth.length - 1);

    return {
      items,
      isFileLevel,
      label: isFileLevel ? "Archivos descargables" : labelsByDepth[depth],
      title: isFileLevel ? "Descarga el material" : titlesByDepth[depth],
    };
  }

  function getCurrentItems() {
    const [cycleId, courseId, courseChildId, sessionId, categoryId] = state.path;
    const { cycle, course, courseChild, week, session, category } = resolvePath();

    if (!cycleId) return catalog.ciclos;
    if (!courseId) return cycle?.cursos || [];
    if (!courseChildId) return getCourseChildren(course);
    if (courseChild?.files) return courseChild.files;
    if (!sessionId) return week?.sesiones || [];
    if (!categoryId) return getSessionCategories(session);

    return category?.files || [];
  }

  function getSelectedTrail() {
    const trail = [];
    const { cycle, course, courseChild, session, category } = resolvePath();

    if (cycle) trail.push(cycle);
    if (course) trail.push(course);
    if (courseChild) trail.push(courseChild);
    if (session) trail.push(session);
    if (category) trail.push(category);

    return trail;
  }

  function resolvePath() {
    const [cycleId, courseId, courseChildId, sessionId, categoryId] = state.path;
    const cycle = catalog.ciclos.find((item) => item.id === cycleId);
    const course = cycle?.cursos.find((item) => item.id === courseId);
    const courseChild = course ? getCourseChildren(course).find((item) => item.id === courseChildId) : null;
    const week = courseChild && !courseChild.files ? courseChild : null;
    const session = week?.sesiones.find((item) => item.id === sessionId);
    const category = session ? getSessionCategories(session).find((item) => item.id === categoryId) : null;

    return { cycle, course, courseChild, week, session, category };
  }

  function getCourseChildren(course) {
    if (!course) return [];

    const documentFolders = courseDocumentDefinitions
      .map((definition) => {
        const files = course.documentos?.[definition.key] || [];
        if (!files.length) return null;

        return {
          id: definition.id,
          nombre: definition.nombre,
          descripcion: definition.descripcion,
          files,
          count: files.length,
          meta: definition.meta,
        };
      })
      .filter(Boolean);

    return documentFolders.concat(course.semanas || []);
  }

  function getSessionCategories(session) {
    if (!session) return [];

    return sessionDocumentDefinitions
      .map((definition) => {
        const files = session[definition.key] || [];
        if (!files.length) return null;

        return {
          id: definition.id,
          nombre: definition.nombre,
          descripcion: definition.descripcion,
          files,
          count: files.length,
          meta: "Carpeta",
        };
      })
      .filter(Boolean);
  }

  function getFilesForCurrentContext() {
    if (!state.path.length) return collectFiles();

    return collectFiles().filter((file) =>
      state.path.every((pathId, index) => file.ancestors[index] === pathId)
    );
  }

  function collectFiles() {
    const files = [];

    catalog.ciclos.forEach((cycle) => {
      cycle.cursos.forEach((course) => {
        getCourseChildren(course)
          .filter((folder) => folder.files)
          .forEach((folder) => {
            addFiles(files, folder.files, [cycle, course, folder], [cycle.id, course.id, folder.id]);
          });

        (course.semanas || []).forEach((week) => {
          (week.sesiones || []).forEach((session) => {
            getSessionCategories(session).forEach((category) => {
              addFiles(
                files,
                category.files,
                [cycle, course, week, session, category],
                [cycle.id, course.id, week.id, session.id, category.id]
              );
            });
          });
        });
      });
    });

    return files;
  }

  function addFiles(target, files, trailEntries, ancestors) {
    files.forEach((file) => {
      target.push({
        ...file,
        trail: trailEntries.map((entry) => entry.nombre).join(" / "),
        ancestors,
      });
    });
  }

  function searchFiles(query) {
    return collectFiles().filter((file) => {
      const haystack = [file.titulo, file.descripcion, file.tipo, file.trail]
        .map(normalize)
        .join(" ");

      return haystack.includes(query);
    });
  }

  function countChildren(item) {
    if (item.cursos) return item.cursos.length;
    if (item.codigo) return getCourseChildren(item).length;
    if (item.files) return item.files.length;
    if (item.sesiones) return item.sesiones.length;
    if (item.practicas || item.manuales || item.audios || item.examenes) return getSessionCategories(item).length;
    if (item.semanas) return item.semanas.length;
    return 0;
  }

  function getMetaLabel(item) {
    if (item.cursos) return "Ciclo";
    if (item.codigo) return `${item.codigo}${item.creditos ? ` · ${item.creditos} créditos` : ""}`;
    if (item.files) return "Documentos";
    if (item.semanas) return "Curso";
    if (item.sesiones) return "Semana";
    if (item.practicas || item.manuales || item.audios || item.examenes) return "Sesión";
    return "Carpeta";
  }

  function buildDetailRows(selected, trail, fileCount) {
    const rows = [["Ruta", buildCurrentPathLabel(trail)]];

    if (selected.codigo) {
      rows.push(["Código", selected.codigo]);
      if (selected.codigoCurso) rows.push(["Código curso", selected.codigoCurso]);
      if (selected.nivel) rows.push(["Nivel", selected.nivel]);
      if (selected.profesor) rows.push(["Profesor", selected.profesor]);
      rows.push(["Créditos", String(selected.creditos || "No indicado")]);
      rows.push(["Horas", formatHours(selected.horas)]);
      rows.push(["Requisitos", selected.requisitos || "No tiene requisitos."]);
    }

    rows.push(["Siguiente", getNextLabel()]);
    rows.push(["Archivos", `${fileCount} disponibles`]);

    return rows;
  }

  function getNextLabel() {
    const items = getCurrentItems();
    if (items.length > 0 && items.every((item) => item.href)) return "Descarga";

    return labelsByDepth[Math.min(state.path.length + 1, labelsByDepth.length - 1)];
  }

  function formatHours(hours) {
    if (!hours) return "No indicado";
    return `TEO ${hours.teo} · LAB ${hours.lab} · Otros ${hours.otros} · Total ${hours.total}`;
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
