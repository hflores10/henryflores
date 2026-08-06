# henryflores

Sitio web estático para GitHub Pages con un navegador de materiales académicos.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: estilos del sitio.
- `js/catalogo.js`: datos de ciclos, cursos, semanas, sesiones, prácticas y manuales.
- `js/app.js`: lógica del navegador.
- `downloads/`: archivos que se descargan desde la web.

## Publicación en GitHub Pages

Sube estos archivos a la rama que uses para Pages. Como el sitio usa rutas relativas, funciona en `https://hflore10.github.io/henryflores/` sin configurar un servidor adicional.

Para agregar materiales, copia el archivo dentro de `downloads/` y registra su ruta en `js/catalogo.js`.
