# henryflores

Sitio web estático para GitHub Pages con un navegador de materiales académicos.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: estilos del sitio.
- `js/catalogo.js`: datos de ciclos, cursos, semanas, sesiones, prácticas, manuales, sílabos y exámenes.
- `js/app.js`: lógica del navegador.
- `downloads/`: archivos que se descargan desde la web.

## Ciclo 3

Se agregó el Nivel 3 con estos cursos:

- `DCGS5362`: Análisis y Diseño de Sistemas I.
- `EFSR5590`: Experiencia Formativa en Situación Real de Trabajo.
- `EMPL5398`: Desarrollo de Habilidades Profesionales III.
- `GDAT5374`: Base de Datos Avanzado I.
- `GDAT5460`: Gestión de Datos Dinámicos.
- `PROG5483`: Lenguaje de Programación I.
- `PROG5505`: Programación Orientada a Objetos I.

Cada curso tiene carpetas preparadas para:

- `manual-del-curso`
- `silabo`
- `semana-01/sesion-01/practicas`
- `semana-01/sesion-01/examenes`

GitHub no publica carpetas vacías, por eso cada carpeta incluye `sube-aqui.txt`. Cuando tengas los documentos reales, reemplaza ese archivo o sube el PDF/DOCX en la misma carpeta y actualiza su ruta, tipo y tamaño en `js/catalogo.js`.

## Publicación en GitHub Pages

Sube estos archivos a la rama que uses para Pages. Como el sitio usa rutas relativas, funciona en `https://hflores10.github.io/henryflores/` sin configurar un servidor adicional.

Para agregar materiales, copia el archivo dentro de `downloads/` y registra su ruta en `js/catalogo.js`.
