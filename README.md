# REAL Bienes Raíces — Sitio web oficial

Sitio estático premium. No requiere instalación ni compilación: solo subir los archivos a cualquier hosting (Netlify, Vercel, Hostinger, cPanel, etc.).

## Ver el sitio en local

```
python -m http.server 8321
```
y abrir http://localhost:8321

## Estructura

| Archivo | Función |
|---|---|
| `index.html` | Página principal (hero, buscador, catálogo, procesos, contacto) |
| `propiedad.html?id=pXX` | Página individual de cada inmueble |
| `assets/js/data.js` | **Base oficial de inmuebles y datos de contacto** |
| `assets/js/main.js` | Interacción de la página principal |
| `assets/js/property.js` | Interacción de la página de inmueble |
| `assets/css/styles.css` | Design system (paleta y tipografía del manual) |
| `assets/img/props/pXX/` | Fotografías oficiales de cada inmueble |
| `assets/img/logo.svg` | Logo oficial vectorial (extraído del manual) |

## Cómo agregar un inmueble nuevo

1. Crear la carpeta `assets/img/props/p13/` y guardar las fotos como `01.jpg`, `02.jpg`, …
   (en el orden original de la galería) y sus miniaturas `01_t.jpg`, `02_t.jpg`, … (~720 px de ancho).
2. Agregar un objeto al arreglo `PROPERTIES` en `assets/js/data.js`:
   - `photos`: número total de fotos.
   - `cover`: número de la foto de fachada / vista exterior (será la portada).
   - `featured: true` para mostrarla en "Propiedades destacadas".
3. Agregar la URL a `sitemap.xml`.

El diseño, carrusel, filtros, galería y botones de WhatsApp se aplican automáticamente.

## Testimonios, estadísticas y blog

Las estructuras están preparadas en `data.js` (`TESTIMONIALS`, `STATS`, `BLOG_POSTS`).
Al llenarlas con datos reales, las secciones se muestran automáticamente.

## Antes de publicar en un dominio

- Reemplazar las rutas relativas de `sitemap.xml`, `robots.txt` y las metas `og:image` /
  `canonical` por URLs absolutas con el dominio final.
- Conectar Google Analytics / Meta Pixel si se desea (estructura lista: agregar el script en el `<head>`).

## Identidad de marca (manual oficial)

- Teal `#2D626C` · Magenta `#BC2896` · Azul `#9EC0CC` · Rosa pálido `#F3E9EA` · Malva `#CFB7C4` · Ciruela `#955F83` · Rosa `#CA5BA9`
- Tipografía de comunicación: **Maven Pro** (la tipografía del logo no se usa en textos).
- WhatsApp oficial: 312 245 8661 · Correo: realbienesraices.col@gmail.com
