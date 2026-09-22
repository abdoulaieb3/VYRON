# PROMPT FINAL À COLLER DANS CURSOR

---

You are a senior frontend engineer and UI/UX designer. Build a complete, professional, premium e-commerce single-page website for an Algerian streetwear clothing brand called **VYRON**. This must be production-ready — not a template, not a snippet, a full working store.

Output the entire site as **one single `index.html` file** with `<style>` and `<script>` fully embedded (no separate CSS/JS files needed for the front-end), PLUS a separate `google-apps-script.gs` file for the order backend, PLUS a short `README.md`.

## 1. BRAND IDENTITY

- **Name:** VYRON
- **Tagline:** "MADE FROM THE STREET"
- **Sub-line:** "BEAUTY IN DARKNESS"
- **Style:** premium dark streetwear — luxury, underground, mysterious, modern, aggressive but clean. Never cheap, never a generic ecommerce template. Think high-end fashion editorial, not a basic Shopify theme.
- **Main colors:** deep black / charcoal / bloody dark red / off-white
- **Target audience:** young streetwear customers in Algeria, mostly browsing from Instagram on mobile.
- **Design rules:**
  - No bright colors, no modern gradients, no colorful accents anywhere.
  - Keep it mostly black + charcoal + off-white with dark blood red used sparingly (buttons, hover states, prices, accents).
  - Elegant typography with strong letter-spacing on headings; a gothic/display font for the logo and big titles only (e.g. "Cinzel Decorative"), a clean sans-serif for everything else (e.g. "Inter" or "Poppins").
  - Subtle grain/noise texture, soft shadows, thin borders, cinematic fade/parallax animations on scroll.
  - Fully responsive and polished on desktop, tablet, and mobile.

## 2. LANGUAGE — BILINGUAL FR / AR

- Default language: French. Add a small **FR | AR** toggle in the header.
- Store all UI text and product copy in a single JS content object (`content.fr` / `content.ar`) so switching language re-renders the text without a page reload.
- When AR is active, switch `document.dir = "rtl"` and mirror the layout correctly.
- Write full, natural French AND Arabic copy for every section (not just English placeholders).

## 3. SITE SECTIONS

1. **Sticky header** — VYRON logo, nav (Accueil / Boutique / Collections / Lookbook / Manifeste / FAQ / Contact), cart icon with item-count badge, FR/AR toggle. On mobile: a smooth animated hamburger menu, all links working, closes on selection or outside click.
2. **Hero** — full-height, dark cinematic background (placeholder image, easy to replace), big gothic-font "VYRON", tagline, one strong CTA to the shop section.
3. **Featured Collection** — a curated set of 3–4 standout products in a large editorial layout.
4. **Latest Drop** — full product grid (see product system below) with category filters and sorting.
5. **Why VYRON** — 4 feature blocks: Qualité Premium / Séries Limitées / Fait Pour La Rue / Livraison Partout en Algérie.
6. **Lookbook** — large editorial images in a premium horizontal or vertical scroll layout, smooth hover zoom/overlay effects, clearly marked `<!-- REPLACE LOOKBOOK IMAGE HERE -->` placeholders.
7. **Manifesto** — a short, striking brand statement section (dark background, centered italic/serif quote-style text).
8. **Instagram/social strip** — handle `@vyron.officiel`, grid of 4–6 placeholder square images linking out, clearly commented for easy replacement.
9. **Newsletter** — simple email capture form (store submissions the same way as orders, in a separate sheet tab, or just log to console with a TODO comment if out of scope).
10. **Footer** — logo, "Made From The Street", Instagram/TikTok/WhatsApp links (all in one config object at the top of the JS so they're easy to edit), Contact, Shipping, Returns, Size Guide, "© 2026 VYRON".

## 4. PRODUCT SYSTEM

Store all products in **one clearly-commented JS array of objects** at the top of the script, so the user can edit it without touching any other code:

```js
const PRODUCTS = [
  {
    id: "shadow-tee",
    name: "T-Shirt Shadow Beast",
    category: "tshirts", // tshirts | shorts | joggers | jackets | caps
    price: 3500, // DA
    images: ["assets/products/shadow-tee-1.jpg", "assets/products/shadow-tee-2.jpg"], // REPLACE PRODUCT IMAGE HERE
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: true,
    isLimited: false,
    description: "…",
    material: "100% coton lourd, impression DTF durable",
    sizeGuideNote: "Coupe oversize — prends une taille en dessous pour un fit ajusté."
  },
  // ...more products: shorts, joggers, jacket, caps
];
```

Each product page/quick-view (modal or expandable card) must show:
- Multiple images (small thumbnail gallery)
- Name, price in DA, stock status ("En stock" / "Rupture de stock")
- Size selector (S/M/L/XL) — **required before "Add to cart" is enabled**
- Quantity selector (+/-, min 1)
- Description + material info
- Size guide (toggle/accordion)
- "Produits similaires" (3–4 related products from the same category)
- "Ajouter au panier" button

## 5. SEARCH & FILTERING

- Live search bar filtering products by name as the user types.
- Category filter pills (Tous / T-Shirts / Shorts / Joggers / Vestes / Casquettes).
- Sort dropdown: Nouveautés / Prix croissant / Prix décroissant.
- All three combine correctly (search + category + sort work together, not just one at a time).

## 6. SHOPPING CART

- Slide-in cart panel (or dedicated cart view) triggered by the header cart icon.
- Add / remove products, increase / decrease quantity per line item.
- Correct subtotal calculation (sum of price × qty).
- Delivery fee line (calculated at checkout — see section 7), shown as "à calculer" until the wilaya is chosen.
- Total price = subtotal + delivery fee.
- Persist the cart in `localStorage` so it survives a page refresh.
- Clean empty-cart state ("Ton panier est vide").
- Clear "Passer à la commande" (Checkout) button that opens the checkout form.

## 7. CHECKOUT — DESIGNED FOR ALGERIA

Checkout form fields:
- Nom complet
- Numéro de téléphone (validate Algerian format, e.g. `0[5-7]XXXXXXXX`)
- Wilaya (select — all 58 wilayas)
- Commune / Ville
- Adresse complète
- Type de livraison: **Livraison à domicile** or **Stop Desk / Point relais**

Add a `WILAYA_DELIVERY_FEES` config object at the top of the JS mapping each wilaya to a home-delivery fee and a stop-desk fee (placeholder values like 400–1200 DA, clearly commented as "MODIFIER CES TARIFS"), so selecting a wilaya + delivery type automatically updates the delivery fee and total shown in the cart/checkout.

Validate: name (required, min 2 words optional), phone (Algerian format), wilaya (required), address (required, min length).

On submit:
1. Client-side validation with inline red error messages under invalid fields.
2. Generate a unique order number (e.g. `VYR-` + timestamp/random).
3. **Send the order to a Google Sheet** (this is the priority — real order tracking): POST the full order as JSON — order number, timestamp, customer info, wilaya, delivery type, each cart item (name/size/qty/price), delivery fee, total — to a Google Apps Script Web App endpoint. Define this clearly at the top of the JS:
   ```js
   const SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
   Since Apps Script often requires `mode: 'no-cors'`, don't block the UI waiting to read the response — send the request and optimistically proceed to the confirmation screen once the fetch call resolves.
4. Also save a local copy of the order (localStorage array of past orders) for demo/reference purposes, and clear the cart.
5. Show a **professional order confirmation modal**: order number, summary of items, total, delivery info, and the message "Merci [Nom] ! Ta commande [numéro] a été reçue. Notre équipe te contactera au [téléphone] pour confirmer."
6. Do **not** pretend a real payment gateway or real delivery-tracking API is connected — this is Cash on Delivery (paiement à la livraison). Structure the checkout code so a real backend/payment API could be swapped in later without a rewrite.

### Also generate `google-apps-script.gs` as a full, working, separate file:
- Header row for the Google Sheet "Commandes VYRON": `N° Commande | Horodatage | Nom | Téléphone | Wilaya | Commune | Adresse | Type Livraison | Produits (résumé) | Sous-total | Frais Livraison | Total`
- A `doPost(e)` function that parses the incoming JSON and appends one row per order (with items summarized into one cell, e.g. `"T-Shirt Shadow Beast (M) x1, Casquette Vyron x2"`)
- Full setup instructions in comments: create the sheet, open Extensions → Apps Script, paste this code, deploy as Web App (execute as "Me", access "Anyone"), copy the URL into `SHEET_ENDPOINT`.

## 8. WHATSAPP ORDER OPTION

Add an "Commander via WhatsApp" button, visible both on product quick-view and at checkout, as a fallback/alternative to the form:
- Generates a clean, pre-filled message including: order/reference number, customer name (if entered), phone, wilaya, delivery type, product list with sizes/quantities, and total price.
- Opens `https://wa.me/<NUMBER>?text=<encoded message>`.
- Put the WhatsApp number in one clearly commented config constant at the top of the JS (`const WHATSAPP_NUMBER = "213XXXXXXXXX";`) so it's a one-line edit.

## 9. NAVIGATION & ACCESSIBILITY

- All nav links scroll smoothly to their section; the mobile hamburger menu must be fully functional (opens/closes, closes on link click, no dead buttons).
- Add accessible labels (`aria-label`, `alt` text on all images), visible focus states, and keyboard support (form fields and buttons reachable and operable via Tab/Enter).
- No console errors of any kind.

## 10. PERFORMANCE & CODE QUALITY

- No heavy external libraries — vanilla JS only. Icons can be simple inline SVGs.
- Clean, semantic HTML5. Organize the embedded CSS with clear comment sections (Header, Hero, Products, Cart, Checkout, Footer, etc.) and CSS variables for all colors/spacing.
- Organize the embedded JS into clearly commented sections: Config (products, wilaya fees, WhatsApp number, sheet endpoint), Language/i18n, Rendering, Filtering/Search, Cart logic, Checkout logic, Animations.
- Keep image sources as placeholders (Unsplash or local `assets/` paths) with `<!-- REPLACE PRODUCT IMAGE HERE -->` / `<!-- REPLACE LOOKBOOK IMAGE HERE -->` comments so the user can swap in real VYRON product photos later without hunting through the code.

## 11. FINAL DELIVERABLE

Return the **complete, full, working code** — not snippets, not partial examples:
1. `index.html` — everything inlined (HTML + `<style>` + `<script>`)
2. `google-apps-script.gs` — full backend code with setup comments
3. `README.md` (in French) explaining step by step how to: replace product photos, edit prices/sizes/stock in the `PRODUCTS` array, edit wilaya delivery fees, connect the Google Sheet, change the WhatsApp number, and deploy the site for free (Netlify/Vercel/GitHub Pages).

Build it all now, fully coded and ready to run in a browser immediately.
