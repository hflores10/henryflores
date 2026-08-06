const crearMaterialPendiente = (cursoId, carpeta, titulo, descripcion) => ({
  titulo,
  descripcion,
  tipo: "TXT",
  tamano: "1 KB",
  actualizado: "2026-08-06",
  estado: "Pendiente",
  href: `downloads/ciclo-03/${cursoId}/${carpeta}/sube-aqui.txt`,
});

const crearCursoCiclo3 = ({ id, codigo, nombre, creditos, horas, requisitos }) => ({
  id,
  codigo,
  nombre,
  creditos,
  horas,
  requisitos,
  descripcion: `${codigo} · ${creditos} créditos · ${horas.total} total.`,
  documentos: {
    manualCurso: [
      crearMaterialPendiente(
        id,
        "manual-del-curso",
        `Manual del curso - ${nombre}`,
        "Espacio reservado para el manual oficial o separata principal del curso."
      ),
    ],
    silabo: [
      crearMaterialPendiente(
        id,
        "silabo",
        `Sílabo - ${nombre}`,
        "Espacio reservado para el sílabo del curso."
      ),
    ],
  },
  semanas: [
    {
      id: "semana-01",
      nombre: "Semana 1",
      descripcion: "Carpeta inicial para organizar sesiones y materiales del curso.",
      sesiones: [
        {
          id: "sesion-01",
          nombre: "Sesión 1",
          tema: "Materiales iniciales del curso",
          practicas: [
            crearMaterialPendiente(
              id,
              "semana-01/sesion-01/practicas",
              `Prácticas - ${nombre}`,
              "Espacio reservado para prácticas, laboratorios o evidencias."
            ),
          ],
          examenes: [
            crearMaterialPendiente(
              id,
              "semana-01/sesion-01/examenes",
              `Exámenes - ${nombre}`,
              "Espacio reservado para exámenes, simulacros o bancos de preguntas."
            ),
          ],
        },
      ],
    },
  ],
});

window.CATALOGO_ACADEMICO = {
  propietario: {
    nombre: "Henry Richard Flores Bazurto",
    etiqueta: "Desarrollo Web Full-Stack + Redes",
    github: "https://github.com/hflores10/henryflores",
  },
  ciclos: [
    {
      id: "ciclo-01",
      nombre: "Ciclo 1",
      descripcion: "Bases de desarrollo web, organización de proyectos y soporte técnico inicial.",
      cursos: [
        {
          id: "desarrollo-web",
          nombre: "Desarrollo Web",
          descripcion: "HTML, CSS, JavaScript y publicación de sitios estáticos.",
          semanas: [
            {
              id: "semana-01",
              nombre: "Semana 1",
              descripcion: "Estructura HTML, estilos base y primeros componentes.",
              sesiones: [
                {
                  id: "sesion-01",
                  nombre: "Sesión 1",
                  tema: "HTML semántico y CSS inicial",
                  practicas: [
                    {
                      titulo: "Práctica 01 - Página personal",
                      descripcion: "Maquetación de una página simple con secciones y navegación.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/desarrollo-web/semana-01/sesion-01/practicas/practica-01-pagina-personal.txt",
                    },
                  ],
                  manuales: [
                    {
                      titulo: "Manual - HTML y CSS base",
                      descripcion: "Guía de etiquetas, selectores y estructura recomendada.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/desarrollo-web/semana-01/sesion-01/manuales/manual-html-css-base.txt",
                    },
                  ],
                },
              ],
            },
            {
              id: "semana-02",
              nombre: "Semana 2",
              descripcion: "Interacción con JavaScript y manejo del DOM.",
              sesiones: [
                {
                  id: "sesion-02",
                  nombre: "Sesión 2",
                  tema: "JavaScript para interfaces",
                  practicas: [
                    {
                      titulo: "Práctica 02 - Navegación dinámica",
                      descripcion: "Eventos, estados y renderizado de listas desde datos.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/desarrollo-web/semana-02/sesion-02/practicas/practica-02-navegacion-dinamica.txt",
                    },
                  ],
                  manuales: [
                    {
                      titulo: "Manual - JavaScript DOM",
                      descripcion: "Referencia rápida para querySelector, eventos y plantillas.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/desarrollo-web/semana-02/sesion-02/manuales/manual-javascript-dom.txt",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "redes-soporte",
          nombre: "Redes y Soporte",
          descripcion: "Diagnóstico, conectividad y documentación de incidencias comunes.",
          semanas: [
            {
              id: "semana-01",
              nombre: "Semana 1",
              descripcion: "Checklists de conectividad y registro de evidencias.",
              sesiones: [
                {
                  id: "sesion-01",
                  nombre: "Sesión 1",
                  tema: "Diagnóstico de red",
                  practicas: [
                    {
                      titulo: "Práctica 01 - Diagnóstico de conectividad",
                      descripcion: "Comandos básicos y plantilla de verificación.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/redes-soporte/semana-01/sesion-01/practicas/practica-01-diagnostico-conectividad.txt",
                    },
                  ],
                  manuales: [
                    {
                      titulo: "Manual - Checklist de red",
                      descripcion: "Secuencia de revisión para incidencias frecuentes.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-01/redes-soporte/semana-01/sesion-01/manuales/manual-checklist-red.txt",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "ciclo-02",
      nombre: "Ciclo 2",
      descripcion: "Algoritmos, estructuras de datos y prácticas de resolución de problemas.",
      cursos: [
        {
          id: "algoritmos-estructura-datos",
          nombre: "Algoritmos y Estructura de Datos",
          descripcion: "Pseudocódigo, análisis, listas, pilas, colas y árboles.",
          semanas: [
            {
              id: "semana-01",
              nombre: "Semana 1",
              descripcion: "Fundamentos de algoritmo, variables y estructuras de control.",
              sesiones: [
                {
                  id: "sesion-01",
                  nombre: "Sesión 1",
                  tema: "Pseudocódigo y complejidad inicial",
                  practicas: [
                    {
                      titulo: "Práctica 01 - Pseudocódigo",
                      descripcion: "Ejercicios de entrada, proceso, salida y condicionales.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-02/algoritmos-estructura-datos/semana-01/sesion-01/practicas/practica-01-pseudocodigo.txt",
                    },
                  ],
                  manuales: [
                    {
                      titulo: "Manual - Complejidad básica",
                      descripcion: "Resumen de tiempos de ejecución y notación Big O.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-02/algoritmos-estructura-datos/semana-01/sesion-01/manuales/manual-complejidad-basica.txt",
                    },
                  ],
                },
              ],
            },
            {
              id: "semana-02",
              nombre: "Semana 2",
              descripcion: "Listas enlazadas y operaciones principales.",
              sesiones: [
                {
                  id: "sesion-02",
                  nombre: "Sesión 2",
                  tema: "Listas enlazadas",
                  practicas: [
                    {
                      titulo: "Práctica 02 - Listas enlazadas",
                      descripcion: "Inserción, búsqueda, eliminación y recorrido.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-02/algoritmos-estructura-datos/semana-02/sesion-02/practicas/practica-02-listas-enlazadas.txt",
                    },
                  ],
                  manuales: [
                    {
                      titulo: "Manual - Listas enlazadas",
                      descripcion: "Nodos, referencias y casos de borde frecuentes.",
                      tipo: "TXT",
                      tamano: "2 KB",
                      actualizado: "2026-08-06",
                      href: "downloads/ciclo-02/algoritmos-estructura-datos/semana-02/sesion-02/manuales/manual-listas-enlazadas.txt",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "ciclo-03",
      nombre: "Ciclo 3",
      descripcion: "Nivel 3: análisis, programación, bases de datos, experiencia formativa y habilidades profesionales.",
      cursos: [
        crearCursoCiclo3({
          id: "analisis-diseno-sistemas-i",
          codigo: "DCGS5362",
          nombre: "Análisis y Diseño de Sistemas I",
          creditos: 5,
          horas: { teo: "0h", lab: "0h", otros: "5h", total: "5h" },
          requisitos: "Modelado de Procesos de Negocio o PRNG2389",
        }),
        crearCursoCiclo3({
          id: "experiencia-formativa-situacion-real-trabajo",
          codigo: "EFSR5590",
          nombre: "Experiencia Formativa en Situación Real de Trabajo",
          creditos: 1,
          horas: { teo: "0h", lab: "0h", otros: "2h", total: "2h" },
          requisitos: "Experiencia Formativa en Situación Real de Trabajo o EFSR4904",
        }),
        crearCursoCiclo3({
          id: "desarrollo-habilidades-profesionales-iii",
          codigo: "EMPL5398",
          nombre: "Desarrollo de Habilidades Profesionales III",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "No tiene requisitos.",
        }),
        crearCursoCiclo3({
          id: "base-datos-avanzado-i",
          codigo: "GDAT5374",
          nombre: "Base de Datos Avanzado I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "3h", total: "3h" },
          requisitos: "Base de Datos o GDAT4685 o GDAT2349",
        }),
        crearCursoCiclo3({
          id: "gestion-datos-dinamicos",
          codigo: "GDAT5460",
          nombre: "Gestión de Datos Dinámicos",
          creditos: 2,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Matemática II o MATE1813",
        }),
        crearCursoCiclo3({
          id: "lenguaje-programacion-i",
          codigo: "PROG5483",
          nombre: "Lenguaje de Programación I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Algoritmos y Estructura de Datos o ALED4683 o ALED1814 o ALED7670",
        }),
        crearCursoCiclo3({
          id: "programacion-orientada-objetos-i",
          codigo: "PROG5505",
          nombre: "Programación Orientada a Objetos I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Desarrollo de Entornos Web o PROG4684 o PROG2351 o PROG7672",
        }),
      ],
    },
  ],
};
