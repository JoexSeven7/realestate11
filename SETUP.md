# AY-PRINT — Local Development Setup

## Quick Start (Windows)

1. **Double-click `setup.bat`** to install dependencies and build CSS
2. **Download Font Awesome** (see below)
3. **Replace Formspree ID** (see below)
4. **Deploy!**

---

## Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Tailwind CSS
```bash
npm run build:css
```

### Step 3: Download Font Awesome
1. Go to: https://fontawesome.com/download
2. Download "Free Web" package
3. Extract to temporary folder
4. Copy `webfonts/` folder to project root
5. Copy `css/all.min.css` to `css/fontawesome.min.css`

### Step 4: Replace Formspree ID
In these files, replace `FORMSPREE_ID` with your actual Formspree form ID:
- `index.html` (newsletter)
- `contact.html` (general inquiry)
- `order.html` (quote request)

Get your free form ID at: https://formspree.io

---

## Development

### Watch mode (auto-rebuild on changes)
```bash
npm run watch:css
```

### Run local server
```bash
npx serve
```
Then open: http://localhost:3000

---

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home |
| `products.html` | Card catalog (filter/search/sort) |
| `product-detail.html` | Single product details (`?id=N`) |
| `order.html` | Quote/order request form (`?product=N` prefills) |
| `about.html` | About the company |
| `contact.html` | Contact + FAQ |

## Data
Products are loaded from `data/products.json`. Each page's JS also keeps an
embedded fallback copy so the site works when opened directly via `file://`.

## Production Checklist
- [ ] Run `npm install`
- [ ] Run `npm run build:css`
- [ ] Download & setup Font Awesome
- [ ] Replace `FORMSPREE_ID` in `index.html`, `contact.html`, `order.html`
- [ ] Swap placeholder logo, images, address, phone, email, and social links
- [ ] Test all forms work
- [ ] Deploy to hosting provider

## Troubleshooting
- **"npm is not recognized"** — Install Node.js from https://nodejs.org
- **"Cannot find module 'tailwindcss'"** — Run `npm install`
- **Forms not working** — Replace `FORMSPREE_ID` with your actual Formspree form ID
- **Icons not showing** — Download Font Awesome webfonts folder and place in project root
