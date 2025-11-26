# Línea del tiempo de la historia de Internet (Vanilla JS)

Una línea del tiempo interactiva y pequeña de eventos relevantes de Internet, implementada con JavaScript y CSS puros.

### Características
- Línea del tiempo horizontal escalada por año
- Búsqueda y filtros por categoría
- Haz clic en un elemento para ver detalles
- Diseño responsive
- No necesita pasos de compilación — abre `index.html` o sirve con un servidor estático simple

### Ejecutar localmente
Abre `index.html` en un navegador moderno o sirve la carpeta con un servidor estático:

PowerShell (Windows):

```powershell
cd "c:\Users\r\Downloads\java\internet-timeline"
python -m http.server 8000
# Open http://localhost:8000
```

### Archivos
- `index.html` — HTML principal
- `styles.css` — estilos
- `timeline.js` — lógica de la interfaz y filtros
- `data.js` — lista de eventos de la línea del tiempo (editar/agregar eventos)

### Personalizar
- Agrega nuevos eventos en `data.js` usando la estructura: { year, title, description, category, link }
- Agrega más categorías y colores en `styles.css`

Licencia: MIT (demo)
