# henryflores

Sitio web estático para GitHub Pages con un navegador de materiales académicos.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: estilos del sitio.
- `js/catalogo.js`: datos de ciclos, cursos, semanas, sesiones, prácticas, manuales, audios, sílabos y exámenes.
- `js/app.js`: lógica del navegador.
- `downloads/`: archivos que se descargan desde la web.

## Ciclos académicos

El catálogo incluye los ciclos 1, 2, 3 y 4. Para los ciclos 2, 3 y 4, cada curso tiene:

- `manual-del-curso`
- `silabo`
- `semana-01` a `semana-05`
- 2 sesiones por semana hasta completar `sesion-01` a `sesion-10`
- carpetas `practicas` y `examenes` dentro de cada sesión

El curso `Inglés` se agregó solamente en el ciclo 1, replicando la jerarquía base de un curso del ciclo 2 y con una carpeta adicional `audios` dentro de cada sesión para publicar múltiples archivos cortos en formato MP3.

## Ciclo 1

- Desarrollo Web.
- Redes y Soporte.
- `INGL1401`: Inglés.

## Ciclo 2

- `ALED5358`: Algoritmos y Estructura de Datos.
- `EFSR5589`: Experiencia Formativa en Situación Real de Trabajo.
- `EMPL5397`: Desarrollo de Habilidades Profesionales II.
- `GDAT5373`: Base de Datos.
- `MATE5491`: Matemática II.
- `PRNG5492`: Modelado de Procesos de Negocio.
- `PROG5394`: Desarrollo de Entornos Web.

## Ciclo 3

- `DCGS5362`: Análisis y Diseño de Sistemas I.
- `EFSR5590`: Experiencia Formativa en Situación Real de Trabajo.
- `EMPL5398`: Desarrollo de Habilidades Profesionales III.
- `GDAT5374`: Base de Datos Avanzado I.
- `GDAT5460`: Gestión de Datos Dinámicos.
- `PROG5483`: Lenguaje de Programación I.
- `PROG5505`: Programación Orientada a Objetos I.

## Ciclo 4

- `EFSR5591`: Experiencia Formativa en Situación Real de Trabajo.
- `EMPL5399`: Desarrollo de Habilidades Profesionales IV.
- `GDAT5375`: Base de Datos Avanzado II.
- `PROG5484`: Lenguaje de Programación II.
- `PROG5506`: Programación Orientada a Objetos II.
- `SPTI5445`: Gestión de Servicios de TI.
- `DCGS5363`: Análisis y Diseño de Sistemas II.

GitHub no publica carpetas vacías, por eso cada carpeta preparada incluye `sube-aqui.txt`. Cuando tengas los documentos reales, reemplaza ese archivo o sube el PDF/DOCX en la misma carpeta y actualiza su ruta, tipo y tamaño en `js/catalogo.js`.

## Publicación en GitHub Pages

Sube estos archivos a la rama que uses para Pages. Como el sitio usa rutas relativas, funciona en `https://hflores10.github.io/henryflores/` sin configurar un servidor adicional.

Para agregar materiales, copia el archivo dentro de `downloads/` y registra su ruta en `js/catalogo.js`.
