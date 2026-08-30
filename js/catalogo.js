const FECHA_ACTUALIZACION = "2026-08-06";
const FECHA_AUDIO_INGLES = "2026-08-13";

const dosDigitos = (numero) => String(numero).padStart(2, "0");

const crearMaterialPendiente = (cicloId, cursoId, carpeta, titulo, descripcion) => ({
  titulo,
  descripcion,
  tipo: "TXT",
  tamano: "1 KB",
  actualizado: FECHA_ACTUALIZACION,
  estado: "Pendiente",
  href: `downloads/${cicloId}/${cursoId}/${carpeta}/sube-aqui.txt`,
});

const normalizarMateriales = (materiales) => (Array.isArray(materiales) ? materiales : [materiales]);

const crearAudiosSesion = (cicloId, cursoId, semanaId, sesionId, nombreCurso, sesionNumero) => {
  if (cursoId === "ingles" && sesionNumero === 1) {
    return [
      {
        titulo: "English Language Instruction - Past Tense and Common Phrases",
        descripcion: "Audio de práctica para pasado simple y frases comunes en inglés.",
        tipo: "MP3",
        tamano: "19.5 MB",
        actualizado: FECHA_AUDIO_INGLES,
        href: `downloads/${cicloId}/${cursoId}/${semanaId}/${sesionId}/audios/English Language Instruction_ Past Tense and Common Phrases.mp3`,
      },
    ];
  }

  return [];
};

const crearSesiones = (cicloId, cursoId, nombreCurso, semanaNumero, opciones = {}) =>
  [1, 2].map((posicion) => {
    const sesionNumero = (semanaNumero - 1) * 2 + posicion;
    const semanaId = `semana-${dosDigitos(semanaNumero)}`;
    const sesionId = `sesion-${dosDigitos(sesionNumero)}`;

    const sesion = {
      id: sesionId,
      nombre: `Sesión ${sesionNumero}`,
      tema: `Materiales de ${nombreCurso} - Sesión ${sesionNumero}`,
      practicas: [
        crearMaterialPendiente(
          cicloId,
          cursoId,
          `${semanaId}/${sesionId}/practicas`,
          `Prácticas - ${nombreCurso} - Sesión ${sesionNumero}`,
          "Espacio reservado para prácticas, laboratorios o evidencias."
        ),
      ],
      examenes: [
        crearMaterialPendiente(
          cicloId,
          cursoId,
          `${semanaId}/${sesionId}/examenes`,
          `Exámenes - ${nombreCurso} - Sesión ${sesionNumero}`,
          "Espacio reservado para exámenes, simulacros o bancos de preguntas."
        ),
      ],
    };

    if (opciones.generarAudios) {
      sesion.audios = crearAudiosSesion(cicloId, cursoId, semanaId, sesionId, nombreCurso, sesionNumero);
    }

    return sesion;
  });

const crearSemanasCurso = (cicloId, cursoId, nombreCurso, opciones = {}) =>
  Array.from({ length: 5 }, (_, index) => {
    const semanaNumero = index + 1;
    const primeraSesion = (semanaNumero - 1) * 2 + 1;
    const segundaSesion = primeraSesion + 1;
    const descripcion = opciones.generarAudios
      ? `Sesiones ${primeraSesion} y ${segundaSesion} para organizar prácticas, exámenes y audios.`
      : `Sesiones ${primeraSesion} y ${segundaSesion} para organizar prácticas y exámenes.`;

    return {
      id: `semana-${dosDigitos(semanaNumero)}`,
      nombre: `Semana ${semanaNumero}`,
      descripcion,
      sesiones: crearSesiones(cicloId, cursoId, nombreCurso, semanaNumero, opciones),
    };
  });

const crearCursoAcademico = ({
  cicloId,
  id,
  codigo,
  nombre,
  creditos,
  horas,
  profesor,
  codigoCurso,
  nivel,
  requisitos,
  manualCurso,
  silabo,
  generarAudios = false,
}) => ({
  id,
  codigo,
  nombre,
  creditos,
  horas,
  profesor,
  codigoCurso,
  nivel,
  requisitos,
  descripcion: `${codigo} · ${creditos} créditos · ${horas.total} total.`,
  documentos: {
    manualCurso: manualCurso
      ? normalizarMateriales(manualCurso)
      : [
          crearMaterialPendiente(
            cicloId,
            id,
            "manual-del-curso",
            `Manual del curso - ${nombre}`,
            "Espacio reservado para el manual oficial o separata principal del curso."
          ),
        ],
    silabo: silabo
      ? normalizarMateriales(silabo)
      : [
          crearMaterialPendiente(
            cicloId,
            id,
            "silabo",
            `Sílabo - ${nombre}`,
            "Espacio reservado para el sílabo del curso."
          ),
        ],
  },
  semanas: crearSemanasCurso(cicloId, id, nombre, { generarAudios }),
});

const crearDocumentoIngles = (cicloId, carpeta, titulo, descripcion) => ({
  titulo,
  descripcion,
  tipo: "TXT",
  tamano: "1 KB",
  actualizado: FECHA_AUDIO_INGLES,
  estado: "Pendiente",
  href: `downloads/${cicloId}/ingles/${carpeta}/sube-aqui.txt`,
});

const crearCursoIngles = ({ cicloId, codigo, codigoCurso, profesor, nivel, requisitos }) =>
  crearCursoAcademico({
    cicloId,
    id: "ingles",
    codigo,
    codigoCurso,
    nombre: "Inglés",
    profesor,
    nivel,
    creditos: 2,
    horas: { teo: "1h", lab: "2h", otros: "1h", total: "4h" },
    requisitos,
    generarAudios: true,
    manualCurso: crearDocumentoIngles(
      cicloId,
      "manual-del-curso",
      "Manual del curso - Inglés",
      "Espacio reservado para el manual del curso de Inglés."
    ),
    silabo: crearDocumentoIngles(
      cicloId,
      "silabo",
      "Sílabo - Inglés",
      "Espacio reservado para el sílabo del curso de Inglés."
    ),
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

          documentos: {
            manualCurso: [
              {
                titulo: "Manual del curso - Desarrollo Web",
                descripcion: "Manual oficial del curso en formato PDF.",
                tipo: "PDF",
                tamano: "11.6 MB",
                actualizado: "2026-08-06",
                href: "downloads/ciclo-01/desarrollo-web/manual-del-curso/manual-desarrollo-web.pdf",
              },
            ],
            silabo: [
              {
                titulo: "Sílabo - Desarrollo Web",
                descripcion: "Sílabo del curso en formato PDF.",
                tipo: "PDF",
                tamano: "1.2 MB",
                actualizado: "2026-08-06",
                href: "downloads/ciclo-01/desarrollo-web/silabo/Silabo_del_curso.pdf",
              },
            ],
          },
          
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
        crearCursoIngles({
          cicloId: "ciclo-01",
          codigo: "INGL1401",
          codigoCurso: "ING-A1-1401",
          profesor: "Valeria Quispe Navarro",
          nivel: "Inglés básico A1",
          requisitos: "No tiene requisitos.",
        }),
      ],
    },
    {
      id: "ciclo-02",
      nombre: "Ciclo 2",
      descripcion: "Nivel 2: algoritmos, bases de datos, matemática, procesos, desarrollo web y experiencia formativa.",
      cursos: [
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "algoritmos-estructura-datos",
          codigo: "ALED5358",
          nombre: "Algoritmos y Estructura de Datos",
          creditos: 4,
          horas: { teo: "0h", lab: "0h", otros: "5h", total: "5h" },
          requisitos: "Introducción a la Algoritmia o ALED2326 o ALED7669",
          manualCurso: [
            {
              titulo: "Manual del curso - Algoritmos y Estructura de Datos",
              descripcion: "Manual oficial del curso en formato PDF.",
              tipo: "PDF",
              tamano: "4.1 MB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/algoritmos-estructura-datos/manual-del-curso/manual-algoritmos-estructura-datos.pdf",
            },
            {
              titulo: "Guía del curso - Algoritmos y Estructura de Datos",
              descripcion: "Guía del curso en formato PDF.",
              tipo: "PDF",
              tamano: "223 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/algoritmos-estructura-datos/manual-del-curso/guia-del-curso.pdf",
            },
          ],
          silabo: [
            {
              titulo: "Sílabo - Algoritmos y Estructura de Datos",
              descripcion: "Sílabo del curso en formato PDF.",
              tipo: "PDF",
              tamano: "300 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/algoritmos-estructura-datos/silabo/silabo-del-curso.pdf",
            },
            {
              titulo: "Proyecto del curso - Algoritmos y Estructura de Datos",
              descripcion: "Archivo del proyecto del curso en formato PDF.",
              tipo: "PDF",
              tamano: "370 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/algoritmos-estructura-datos/silabo/proyecto-del-curso-algoritmos-estructura-datos.pdf",
            },
          ],
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "experiencia-formativa-situacion-real-trabajo",
          codigo: "EFSR5589",
          nombre: "Experiencia Formativa en Situación Real de Trabajo",
          creditos: 1,
          horas: { teo: "0h", lab: "0h", otros: "2h", total: "2h" },
          requisitos: "No tiene requisitos.",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "desarrollo-habilidades-profesionales-ii",
          codigo: "EMPL5397",
          nombre: "Desarrollo de Habilidades Profesionales II",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "No tiene requisitos.",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "base-datos",
          codigo: "GDAT5373",
          nombre: "Base de Datos",
          creditos: 4,
          horas: { teo: "0h", lab: "0h", otros: "5h", total: "5h" },
          requisitos: "Tecnologías de la Información o SPTI2334",
          manualCurso: [
            {
              titulo: "Proyecto del curso - Base de Datos",
              descripcion: "Documento del proyecto del curso en formato PDF.",
              tipo: "PDF",
              tamano: "572 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/base-datos/manual-del-curso/proyecto-del-curso-base-datos.pdf",
            },
            {
              titulo: "Proyecto Base de Datos Alojamiento - Demo",
              descripcion: "Documento demo del proyecto de alojamiento en formato PDF.",
              tipo: "PDF",
              tamano: "786 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/base-datos/manual-del-curso/proyecto-base-datos-alojamiento-demo.pdf",
            },
          ],
          silabo: [
            {
              titulo: "Sílabo - Base de Datos",
              descripcion: "Sílabo del curso en formato PDF.",
              tipo: "PDF",
              tamano: "302 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/base-datos/silabo/silabo-base-datos.pdf",
            },
            {
              titulo: "Rúbrica de Evaluación de Proyectos de BD",
              descripcion: "Rúbrica de evaluación de proyectos en formato Excel.",
              tipo: "XLSX",
              tamano: "15 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-02/base-datos/silabo/rubrica-evaluacion-proyectos-bd.xlsx",
            },
          ],
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "matematica-ii",
          codigo: "MATE5491",
          nombre: "Matemática II",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Matemática I o MATE1800",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "modelado-procesos-negocio",
          codigo: "PRNG5492",
          nombre: "Modelado de Procesos de Negocio",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Fundamentos de Gestión Empresarial o PRNG2317 o ADMI7668",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-02",
          id: "desarrollo-entornos-web",
          codigo: "PROG5394",
          nombre: "Desarrollo de Entornos Web",
          creditos: 2,
          horas: { teo: "0h", lab: "0h", otros: "3h", total: "3h" },
          requisitos: "Arquitectura de Entornos Web o PROG1802 o PROG4658 o PROG7667",
        }),
      ],
    },
    {
      id: "ciclo-03",
      nombre: "Ciclo 3",
      descripcion: "Nivel 3: análisis, programación, bases de datos, experiencia formativa y habilidades profesionales.",
      cursos: [
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "analisis-diseno-sistemas-i",
          codigo: "DCGS5362",
          nombre: "Análisis y Diseño de Sistemas I",
          creditos: 5,
          horas: { teo: "0h", lab: "0h", otros: "5h", total: "5h" },
          requisitos: "Modelado de Procesos de Negocio o PRNG2389",
          manualCurso: {
            titulo: "Manual del curso - Análisis y Diseño de Sistemas I",
            descripcion: "Manual oficial del curso en formato PDF.",
            tipo: "PDF",
            tamano: "17.8 MB",
            actualizado: "2026-08-08",
            href: "downloads/ciclo-03/analisis-diseno-sistemas-i/manual-del-curso/manual-analisis-diseno-sistemas-i.pdf",
          },
          silabo: {
            titulo: "Sílabo - Análisis y Diseño de Sistemas I",
            descripcion: "Sílabo del curso en formato PDF.",
            tipo: "PDF",
            tamano: "257 KB",
            actualizado: "2026-08-08",
            href: "downloads/ciclo-03/analisis-diseno-sistemas-i/silabo/silabo-del-curso.pdf",
          },
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "experiencia-formativa-situacion-real-trabajo",
          codigo: "EFSR5590",
          nombre: "Experiencia Formativa en Situación Real de Trabajo",
          creditos: 1,
          horas: { teo: "0h", lab: "0h", otros: "2h", total: "2h" },
          requisitos: "Experiencia Formativa en Situación Real de Trabajo o EFSR4904",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "desarrollo-habilidades-profesionales-iii",
          codigo: "EMPL5398",
          nombre: "Desarrollo de Habilidades Profesionales III",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "No tiene requisitos.",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "base-datos-avanzado-i",
          codigo: "GDAT5374",
          nombre: "Base de Datos Avanzado I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "3h", total: "3h" },
          requisitos: "Base de Datos o GDAT4685 o GDAT2349",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "gestion-datos-dinamicos",
          codigo: "GDAT5460",
          nombre: "Gestión de Datos Dinámicos",
          creditos: 2,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Matemática II o MATE1813",
          manualCurso: [
            {
              titulo: "Manual del curso - Gestión de Datos Dinámicos",
              descripcion: "Manual oficial del curso en formato PDF.",
              tipo: "PDF",
              tamano: "31.5 MB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-03/gestion-datos-dinamicos/manual-del-curso/manual-gestion-datos-dinamicos.pdf",
            },
            {
              titulo: "Guía del curso - Gestión de Datos Dinámicos",
              descripcion: "Guía del curso en formato PDF.",
              tipo: "PDF",
              tamano: "183 KB",
              actualizado: "2026-08-08",
              href: "downloads/ciclo-03/gestion-datos-dinamicos/manual-del-curso/guia-del-curso.pdf",
            },
          ],
          silabo: {
            titulo: "Sílabo - Gestión de Datos Dinámicos",
            descripcion: "Sílabo del curso en formato PDF.",
            tipo: "PDF",
            tamano: "211 KB",
            actualizado: "2026-08-08",
            href: "downloads/ciclo-03/gestion-datos-dinamicos/silabo/silabo-del-curso.pdf",
          },
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "lenguaje-programacion-i",
          codigo: "PROG5483",
          nombre: "Lenguaje de Programación I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Algoritmos y Estructura de Datos o ALED4683 o ALED1814 o ALED7670",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-03",
          id: "programacion-orientada-objetos-i",
          codigo: "PROG5505",
          nombre: "Programación Orientada a Objetos I",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Desarrollo de Entornos Web o PROG4684 o PROG2351 o PROG7672",
        }),
      ],
    },
    {
      id: "ciclo-04",
      nombre: "Ciclo 4",
      descripcion: "Nivel 4: programación avanzada, datos, servicios de TI, análisis de sistemas y experiencia formativa.",
      cursos: [
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "experiencia-formativa-situacion-real-trabajo",
          codigo: "EFSR5591",
          nombre: "Experiencia Formativa en Situación Real de Trabajo",
          creditos: 2,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Experiencia Formativa en Situación Real de Trabajo o EFSR4906",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "desarrollo-habilidades-profesionales-iv",
          codigo: "EMPL5399",
          nombre: "Desarrollo de Habilidades Profesionales IV",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "No tiene requisitos.",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "base-datos-avanzado-ii",
          codigo: "GDAT5375",
          nombre: "Base de Datos Avanzado II",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Base de Datos Avanzado I o GDAT4686 o GDAT2393",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "lenguaje-programacion-ii",
          codigo: "PROG5484",
          nombre: "Lenguaje de Programación II",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "3h", total: "3h" },
          requisitos: "Lenguaje de Programación I o PROG4688 o PROG1891",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "programacion-orientada-objetos-ii",
          codigo: "PROG5506",
          nombre: "Programación Orientada a Objetos II",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "3h", total: "3h" },
          requisitos: "Programación Orientada a Objetos I o PROG4689 o PROG1892",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "gestion-servicios-ti",
          codigo: "SPTI5445",
          nombre: "Gestión de Servicios de TI",
          creditos: 3,
          horas: { teo: "0h", lab: "0h", otros: "4h", total: "4h" },
          requisitos: "Gestión de Datos Dinámicos o GDAT2394",
        }),
        crearCursoAcademico({
          cicloId: "ciclo-04",
          id: "analisis-diseno-sistemas-ii",
          codigo: "DCGS5363",
          nombre: "Análisis y Diseño de Sistemas II",
          creditos: 3,
          horas: { teo: "2h", lab: "2h", otros: "4h", total: "8h" },
          requisitos: "Análisis y Diseño de Sistemas I o DCGS2392",
        }),
      ],
    },
  ],
};
