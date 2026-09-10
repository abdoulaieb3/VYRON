# VYRON — Boutique en ligne

Site e-commerce **une seule page** pour la marque streetwear algérienne **VYRON**.
Front-end en 3 fichiers séparés (HTML / CSS / JS), zéro librairie externe.
Le suivi des commandes se fait via un Google Sheet (`google-apps-script.gs`).

```
VYRON/
├─ index.html              ← structure de la page (à ouvrir dans un navigateur)
├─ styles.css              ← tout le design (couleurs, mise en page, animations)
├─ script.js               ← toute la logique + LA CONFIG À ÉDITER (produits, tarifs…)
├─ google-apps-script.gs   ← backend commandes (Google Sheet)
├─ README.md               ← ce fichier
└─ assets/
   ├─ products/            ← photos produits
   └─ lookbook/            ← photos lookbook
```

> Les 3 fichiers doivent rester **dans le même dossier** : `index.html` charge
> `styles.css` et `script.js` par leur nom.
> **Presque tous tes réglages se font désormais dans `script.js`** (sections numérotées en haut du fichier).

Ouvre `index.html` dans un navigateur : le site fonctionne immédiatement (panier, filtres,
recherche, checkout, WhatsApp). Il reste 5 réglages à faire pour la mise en production.

---

## 1. Remplacer les photos produits

Les images sont dans `assets/products/`. Pour changer une photo :

1. Dépose ta nouvelle image dans `assets/products/` (format `.jpg` ou `.png`, idéalement **1000 × 1250 px**, ratio 4:5).
2. Ouvre `script.js`, va dans la section **`2. PRODUITS`**.
3. Dans le produit concerné, modifie le tableau `images` :

```js
images: ["assets/products/mon-tee-1.jpg", "assets/products/mon-tee-2.jpg"],
//         ↑ image principale            ↑ 2e image (survol + galerie)
```

- 1re image = vignette + image principale.
- Les suivantes = galerie dans l'aperçu rapide + effet de survol sur la grille.
- Si une image ne charge pas, un visuel « VYRON » de secours s'affiche automatiquement.

> Les chemins d'images du **lookbook** et du strip **Instagram** sont dans `script.js`
> (fonctions `renderLookbook()` / `renderInstagram()`, commentaire `REPLACE LOOKBOOK IMAGE HERE`).
> Pour le **hero**, ouvre `styles.css`, cherche `.hero__bg` (commentaire `REPLACE HERO IMAGE HERE`)
> et remplace l'URL Unsplash par `assets/hero.jpg`.

---

## 2. Modifier prix / tailles / stock / descriptions

Toujours dans la section **`2. PRODUITS`** de `script.js`. Un produit ressemble à ça :

```js
{
  id: "shadow-beast-tee",        // identifiant unique — ne pas mettre d'espace
  category: "tshirts",           // tshirts | shorts | joggers | jackets | caps
  price: 3800,                   // PRIX EN DA (nombre, sans espace ni "DA")
  images: ["assets/products/shadow-beast-1.jpg"],
  sizes: ["S", "M", "L", "XL", "XXL"],   // tailles proposées
  inStock: true,                 // false  → "Rupture de stock", bouton désactivé
  isNew: true,                   // true   → badge "New" + tri "Nouveautés"
  isLimited: true,               // true   → badge "Limited"
  name:        { fr: "T-Shirt Shadow Beast", ar: "تيشيرت شادو بيست" },
  description: { fr: "…", ar: "…" },
  material:    { fr: "…", ar: "…" },
  sizeGuideNote:{ fr: "…", ar: "…" }
}
```

- **Chaque texte doit être renseigné en français (`fr`) ET en arabe (`ar`).**
- **Ajouter un produit** : copie un bloc `{ … }` entier, colle-le dans le tableau `PRODUCTS`,
  change au minimum `id`, `name`, `price`, `images`, `category`.
- **Retirer un produit** : supprime son bloc `{ … }` (et la virgule).
- **Mettre en rupture** : `inStock: false`.
- **Pièces phares** (section « Collection ») : édite la liste `FEATURED_IDS` juste sous `PRODUCTS`.

Catégories reconnues (pour les filtres) : `tshirts`, `shorts`, `joggers`, `jackets`, `caps`.

---

## 3. Modifier les frais de livraison par wilaya

Section **`3. WILAYAS + FRAIS DE LIVRAISON`** de `script.js`, objet `WILAYA_DELIVERY_FEES`.
Les 58 wilayas y sont déjà listées avec des tarifs **provisoires** :

```js
"16 - Alger":  { home: 450, desk: 300 },
//               ↑ livraison    ↑ stop desk /
//                 à domicile     point relais
```

- `home` = tarif **livraison à domicile** (en DA)
- `desk` = tarif **stop desk / point relais** (en DA)

Modifie chaque ligne selon les tarifs de ton transporteur (Yalidine, ZR Express, Maystro…).
Le site recalcule automatiquement les frais + le total dès que le client choisit sa wilaya
et son type de livraison. Ne change pas les **clés** (`"16 - Alger"`, etc.) : elles servent
aussi de libellés dans le menu déroulant.

---

## 4. Connecter le Google Sheet (suivi des commandes)

But : chaque commande validée s'ajoute automatiquement dans un Google Sheet.

1. Va sur <https://sheets.new>, renomme le fichier **« Commandes VYRON »**.
2. Menu **Extensions → Apps Script**.
3. Efface le code par défaut, colle **tout** le contenu de `google-apps-script.gs`, **Enregistre**.
4. Sélectionne la fonction **`setup`** en haut, clique **Exécuter**, autorise l'accès
   (Avancé → « Accéder à … » → Autoriser). Les onglets et en-têtes se créent.
5. **Déployer → Nouveau déploiement** :
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
   - **Déployer**, puis **copie l'URL** `…/exec`.
6. Dans `script.js`, section **`1. CONFIG`** (tout en haut du fichier), remplace :

```js
const SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```

   par ton URL, par exemple :

```js
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy..../exec";
```

7. Enregistre `script.js`, recharge le site, passe une commande test → une ligne apparaît
   dans l'onglet **Commandes VYRON**.

Colonnes du sheet :
`N° Commande | Horodatage | Nom | Téléphone | Wilaya | Commune | Adresse | Type Livraison | Produits (résumé) | Sous-total | Frais Livraison | Total`

Les inscriptions **newsletter** arrivent dans un 2e onglet **Newsletter VYRON**
(`Horodatage | Email`).

> Tant que `SHEET_ENDPOINT` n'est pas configuré, le site **fonctionne quand même** :
> la commande est enregistrée en local (`localStorage`) et visible dans la console
> du navigateur (`console`), et le client peut commander via WhatsApp.
> À chaque modif du script `.gs` : **Déployer → Gérer les déploiements → crayon →
> Nouvelle version → Déployer** (l'URL ne change pas).

---

## 5. Changer le numéro WhatsApp (et les réseaux)

Section **`1. CONFIG`** de `script.js` :

```js
// Format international, SANS "+" ni espaces : 213 suivi du numéro sans le 0
const WHATSAPP_NUMBER = "213555000000";   // ← ton numéro

const SOCIAL = {
  instagram: "https://instagram.com/vyron.officiel",
  tiktok:    "https://tiktok.com/@vyron.officiel",
  whatsapp:  "https://wa.me/" + WHATSAPP_NUMBER   // se met à jour tout seul
};
```

Exemple : le numéro `0555 12 34 56` s'écrit `213555123456`.

Le bouton « Commander via WhatsApp » (présent dans l'aperçu produit, au checkout et sur
la confirmation) génère un message pré-rempli : réf. commande, nom, téléphone, wilaya,
type de livraison, liste des articles avec tailles/quantités, et total.

---

## 6. Mettre le site en ligne gratuitement

Le site est un simple dossier de fichiers statiques : il s'héberge gratuitement partout.

### Option A — Netlify (le plus simple, glisser-déposer)
1. Crée un compte sur <https://app.netlify.com>.
2. Onglet **Sites → Add new site → Deploy manually**.
3. Glisse le **dossier `VYRON`** entier dans la zone de dépôt.
4. En ligne en ~20 secondes sur une URL `xxxx.netlify.app` (renommable, domaine perso possible).
5. Pour mettre à jour : re-glisse le dossier.

### Option B — Vercel
1. Compte sur <https://vercel.com>, installe l'outil : `npm i -g vercel`.
2. Dans le dossier `VYRON` : lance `vercel` et suis les questions (tout par défaut).
3. Ou connecte un dépôt GitHub → déploiement auto à chaque `push`.

### Option C — GitHub Pages
1. Crée un dépôt GitHub, pousse le contenu du dossier `VYRON`.
2. **Settings → Pages → Branch : `main` / `root` → Save**.
3. Disponible sur `https://<ton-user>.github.io/<repo>/` après 1–2 min.

> Peu importe l'hébergeur : le Google Sheet et WhatsApp fonctionnent pareil, ce sont des
> services externes appelés depuis le navigateur.

---

## Récapitulatif des réglages (section `1. CONFIG` de `script.js`)

| Constante | Rôle |
|---|---|
| `WHATSAPP_NUMBER` | Numéro WhatsApp (format `213…`) |
| `SHEET_ENDPOINT` | URL du Web App Google Apps Script |
| `SOCIAL.instagram` / `SOCIAL.tiktok` | Liens réseaux sociaux |
| `PRODUCTS` | Catalogue produits (prix, tailles, stock, textes FR/AR) |
| `FEATURED_IDS` | Produits affichés en « Pièces phares » |
| `WILAYA_DELIVERY_FEES` | Frais de livraison par wilaya (`home` / `desk`) |

---

## Notes techniques

- **3 fichiers, aucune librairie externe** : `index.html` (structure) + `styles.css` (design)
  + `script.js` (logique + config). Icônes en SVG inline. À garder dans le même dossier.
  Seule ressource distante : Google Fonts (Cinzel Decorative / Inter / Noto Kufi Arabic).
- **Aucun build** : rien à compiler. On modifie les fichiers, on recharge la page.
- **Bilingue FR/AR** : bouton `FR | AR` dans l'en-tête. En arabe, la page passe en RTL
  (`document.dir = "rtl"`) et tout le texte est ré-affiché sans recharger.
- **Panier persistant** : sauvegardé dans `localStorage` (`vyron_cart_v1`), survit au rafraîchissement.
- **Commandes locales** : historique gardé dans `localStorage` (`vyron_orders_v1`) pour référence/démo.
- **Paiement à la livraison uniquement** (Cash on Delivery) — aucune passerelle de paiement
  ni API de suivi n'est simulée. Le code checkout est isolé pour pouvoir brancher un vrai
  backend plus tard sans tout réécrire.
- **Validation checkout** : nom requis, téléphone algérien (`0[5-7]XXXXXXXX`), wilaya,
  commune, adresse (longueur mini). Messages d'erreur rouges sous chaque champ.
- **Accessibilité** : `aria-label`, `alt` sur les images, focus visibles, navigation
  clavier (Tab/Entrée), fermeture des panneaux avec `Échap`.

© 2026 VYRON — Made From The Street
