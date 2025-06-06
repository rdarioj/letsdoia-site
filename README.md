# letsdoia-site

Landing page multilenguaje para letsdoia.com  
Idiomas soportados: Español, Inglés, Italiano

---

## 📁 Estructura de carpetas

```
letsdoia-site/
│
├── index.html              # Español (por defecto)
├── en/
│   └── index.html          # Inglés
├── it/
│   └── index.html          # Italiano
├── assets/
│   └── css/
│       └── main.css        # Estilos compartidos
├── images/
│   └── ...                 # Imágenes y logos
└── README.md               # Este archivo
```

---

## 🌐 Navegación de idiomas

- El selector de idioma en el navbar permite cambiar entre español, inglés e italiano.
- Cada idioma tiene su propio archivo `index.html` en la carpeta correspondiente.
- Las rutas relativas aseguran que los assets (CSS, imágenes) se compartan entre idiomas.

---

## ✏️ ¿Cómo editar el contenido?

- **Español:**  
  Edita `/index.html`
- **Inglés:**  
  Edita `/en/index.html`
- **Italiano:**  
  Edita `/it/index.html`

> **Tip:** Mant��n la estructura y las secciones iguales en todos los idiomas para facilitar el mantenimiento.

---

## 🖼️ Assets compartidos

- Coloca imágenes y archivos CSS en las carpetas `/images/` y `/assets/css/` respectivamente.
- Usa rutas relativas (`../images/`, `../assets/css/`) en los archivos de inglés e italiano.

---

## 🚀 Recomendaciones

- Si agregas una nueva sección, hazlo en los tres archivos de idioma.
- Para SEO, cada idioma tiene su propio `<html lang="...">` y `<title>`.
- Si el sitio crece, considera migrar a un framework con soporte i18n (Next.js, Astro, Hugo, etc.).

---

## 📞 Contacto

Para dudas o soporte, escribe a [info@letsdoia.com](mailto:info@letsdoia.com)