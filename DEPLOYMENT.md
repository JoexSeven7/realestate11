# AY-PRINT — Deployment Guide

This project is a **fully static website** (HTML + CSS + vanilla JS). No backend,
database, or server runtime is required in production. Host it on any static host:
Netlify, GitHub Pages, Cloudflare Pages, Vercel, or a traditional cPanel host.

---

## 1. Pre‑Deployment Checklist (do these BEFORE going live)

- [x] **CSP allows Formspree** — `connect-src` and `form-action` permit
      `https://formspree.io` in all HTML pages.
- [x] **Contact + newsletter + order forms** bind to `id="contactForm"`,
      `id="newsletterForm"`, and `id="orderForm"` for AJAX submit.
- [ ] **[YOU MUST DO] Replace `FORMSPREE_ID` placeholders** with real Formspree
      form IDs in:
        - `index.html` → newsletter form
        - `contact.html` → general inquiry form
        - `order.html` → quote request form
      Get IDs at https://formspree.io (one form per purpose, or reuse one).
- [ ] **[YOU MUST DO] Swap placeholder branding:**
      logo (`images/logo.png`), product images (`images/*.jpeg` are stand-ins),
      address, phone (`+234 801 234 5678`), WhatsApp (`+234 902 773 0330`),
      email (`info@ayprint.com`), and social links.
- [ ] **[RECOMMENDED] Rebuild Tailwind CSS** after editing classes:
      `npm install` then `npm run build:css`.
- [ ] **Verify all images exist** — product `image` paths live in
      `data/products.json` and the embedded copies in `js/products.js` and
      `js/product-detail.js`. `onerror` fallbacks point to `images/build1.jpeg`.

### How the site loads data
`js/main.js`, `js/products.js`, and `js/product-detail.js` call
`fetch('data/products.json')`. This needs a web server (HTTP), not `file://`.
If the fetch fails, pages fall back to embedded data in the JS. Keep
`data/products.json` as the source of truth and keep embedded copies in sync
when you edit products.

---

## 2. Build (optional but recommended)
```bash
npm install
npm run build:css      # regenerates css/output.css from css/input.css
```
Node.js is needed only on your machine to build CSS, not on the server.

---

## 3. Deployment Options (pick one)
Upload the project folder contents (HTML/CSS/JS/images/data). Do **not** upload
`node_modules/` or `package-lock.json`.

- **Netlify Drop** — https://app.netlify.com/drop, drag the folder.
- **Netlify / Cloudflare Pages (Git)** — Build: `npm run build:css`, Output: `.`
- **GitHub Pages** — Settings → Pages → `main` branch, `/ (root)`.
- **cPanel** — File Manager → `public_html`, upload files.

---

## 4. Post‑Deploy Verification
1. Homepage hero + stat counters animate.
2. **Products** page loads listings from `data/products.json` (DevTools → Network →
   confirm `products.json` returns 200).
3. **Product detail** opens via `product-detail.html?id=1` with gallery + specs.
4. **Forms**: newsletter, contact, and order/quote submit successfully (success alert
   + Formspree email). Failures are almost always the `FORMSPREE_ID` placeholders.
5. **Icons** render (Font Awesome, local `css/fontawesome.min.css`).
6. DevTools → Console shows no red CSP/404 errors.

---

## 5. Known Limitations / Future Work
- Products live in `data/products.json` + duplicated embedded copies in `js/*.js`.
  Keep them in sync when editing.
- Images and business details are placeholders until real assets are supplied.
