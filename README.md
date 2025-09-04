# The New Inn — Static Website

A fast, no-fuss website for The New Inn (Wilsden, Bradford) built as plain static files. 
No backend, no CMS, just HTML/CSS/JS with YAML for content.

## Edit content (non-technical friendly)

Update the files in `/data/` directly in GitHub’s web UI:

- `data/site.yaml` — phone, email, Facebook, address, opening hours.
- `data/events.yaml` — add/edit upcoming events.
- `data/cask_ales.yaml` — update the cask list.

The site reads these at runtime and updates the page automatically.

## Local preview

Just open `index.html` in a browser. For strict browsers blocking `file://` fetch, serve locally:

```bash
# using Python 3
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy (options)

- **GitHub Pages**: push this folder to a repo and enable Pages (root).
- **Netlify / Cloudflare Pages / Vercel**: drag‑and‑drop this folder.
- **Static hosting** on any server: upload the files via SFTP.

## Accessibility & performance

- Semantic HTML, high colour contrast, keyboard‑friendly.
- No heavy frameworks; one small YAML parser included (`js-yaml`).
- Responsive layout with CSS grid and flexbox.

## Licence

All code and SVGs are MIT. Replace SVGs with real photos as you like.
