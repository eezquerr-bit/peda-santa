# PEDA Secret Santa 2026 – versión GitHub Pages

## Publicar (5 minutos)
1. Entra en github.com → **New repository** → nombre p. ej. `peda-santa` → **Public** → Create.
2. En el repositorio: **Add file → Upload files** → arrastra TODOS los archivos de esta carpeta → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. En 1–2 minutos la web estará en: `https://TU-USUARIO.github.io/peda-santa/`

## Archivos
- `index.html` – página pública (vídeo de entrada, info, botones Sí/No que te envían un email) y, con enlace personal, la revelación del regalo.
- `organiser.html` – tu panel: `https://TU-USUARIO.github.io/peda-santa/organiser.html`
- `roster.js` – nombres, emails y fotos **cifrados** (no se ven sin clave).
- `intro.mp4`, `poster.jpg`, `common.css`, `common.js`.

## Clave de organizador
Está en el archivo aparte `organiser_key.txt` (NO lo subas a GitHub). La pegas una vez en `organiser.html`.

## Flujo
1. Envía el correo con el enlace a `index.html`.
2. Cada uno pulsa *Count me in* / *Not this year* → te llega un email.
3. El 13/11 abre `organiser.html`, marca a los que dijeron sí, pega sus listas de deseos y pulsa **Draw**.
4. Pulsa **✉ Email link** en cada fila → se abre Outlook con el correo listo → Enviar.
   El enlace es opaco: tú no ves a quién le toca cada uno.
5. Usa siempre el mismo ordenador y navegador para el panel (se guarda en el navegador).
