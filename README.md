# VYRON — Boutique en ligne

Site e-commerce **une seule page** pour la marque streetwear algérienne **VYRON**.
Front-end statique (HTML / CSS / JS), zéro librairie externe.
Les produits se gèrent dans une page privée **`admin.html`**.
Le suivi des commandes se fait via un Google Sheet (`google-apps-script.gs`).

hhh

```
VYRON/
├─ index.html              ← la boutique (à ouvrir / mettre en ligne)
├─ admin.html              ← 🔒 page privée : ajouter / modifier tes produits + le stock
├─ styles.css              ← tout le design (couleurs, mise en page, animations)
├─ script.js               ← la logique + la CONFIG (WhatsApp, Google Sheet, tarifs livraison)
├─ products-data.js        ← TON CATALOGUE (généré par admin.html — ne pas éditer à la main)
├─ google-apps-script.gs   ← backend commandes (Google Sheet)
├─ README.md               ← ce fichier
└─ assets/
   ├─ products/            ← photos produits
   └─ lookbook/            ← photos lookbook
```

> Tous les fichiers doivent rester **dans le même dossier**.
> `admin.html` ne se met **jamais en ligne** — c'est ton outil perso. Tu peux même le
> supprimer du dossier avant d'uploader le site (ou laisser, il est en `noindex`).

Ouvre `index.html` dans un navigateur : la boutique fonctionne immédiatement (panier, filtres,
recherche, checkout, WhatsApp). Réglages restants pour la mise en production : sections 4 à 6.

---

## 1. Ajouter un produit / changer le stock  →  `admin.html`

**Tout se passe dans `admin.html`. Tu ne touches jamais au code.**

### Ajouter un nouveau produit

1. **Photos d'abord** : mets la ou les images dans `assets/products/`
   (`.jpg` ou `.png`, idéalement **1000 × 1250 px**, ratio 4:5).
2. Double-clique **`admin.html`** → bouton **« ＋ Nouveau produit »**.
3. Remplis les champs :
   - Nom **FR + AR**, identifiant (proposé automatiquement)
   - Prix en DA, catégorie
   - Tailles (clique les pastilles S / M / L / XL… ou ajoute une taille sur mesure)
   - Statut : *En stock*, badge *New*, badge *Limited*, *Pièce phare*
   - **Photos** : écris juste le nom du fichier (ex : `mon-tee-1.jpg`) — un aperçu s'affiche
     tout de suite. Tu peux aussi coller une URL `https://…`. Ajoute-en plusieurs pour la galerie.
   - Descriptions **FR + AR** (obligatoires), matière et note de tailles (optionnelles)
4. **Enregistrer le produit**.
5. Bouton **« ⬇ Télécharger products-data.js »** → un fichier `products-data.js` est téléchargé.
6. **Remplace** l'ancien `products-data.js` du dossier VYRON par celui téléchargé.
7. Ré-uploade le dossier chez ton hébergeur (voir section 6). En ligne.

### Changer le stock (rupture / de nouveau dispo)

Dans `admin.html`, la liste des produits a un interrupteur **En stock** sur chaque ligne.
Clique-le → **⬇ Télécharger products-data.js** → remplace le fichier → ré-uploade.
Un produit en rupture reste visible mais le bouton « Ajouter au panier » est désactivé.

### Modifier, dupliquer, supprimer, réordonner

- ✎ éditer · ⧉ dupliquer (pratique pour une variante) · 🗑 supprimer · ▲▼ changer l'ordre.
- **Pièce phare** : un champ réservé pour plus tard. La page d'accueil n'a plus de section
  « Pièces phares » pour l'instant (retirée), donc ce champ n'a aucun effet visible sur le site —
  il ne sert qu'à préparer une éventuelle mise en avant future.

### Bon à savoir

- Tes changements sont **sauvegardés automatiquement dans ton navigateur** (brouillon) tant que
  tu n'as pas téléchargé. Le bandeau « Brouillon non téléchargé » te le rappelle.
- Menu **⋯** : *Importer* un `products-data.js` existant (ex : depuis un autre PC),
  *Repartir du fichier*, *Vider le brouillon local*.
- `admin.html` vérifie tout avant l'export : si un produit a un champ manquant, il te liste
  les erreurs et bloque le téléchargement.
- Si une photo ne charge pas sur le site, un visuel « VYRON » de secours s'affiche à la place.

> **Lookbook / Instagram / Hero** ne passent pas par `admin.html` :
> lookbook + Instagram = `script.js` (`renderLookbook()` / `renderInstagram()`),
> hero = `styles.css` (`.hero__bg`, commentaire `REPLACE HERO IMAGE HERE`).

---

## 2. Éditer un produit à la main (optionnel)

Si tu préfères, `products-data.js` est juste une liste JavaScript. Un produit :

```js
{
  id: "shadow-beast-tee",        // identifiant unique, minuscules et tirets
  category: "tshirts",           // tshirts | shorts | joggers | jackets | caps
  price: 3800,                   // PRIX EN DA (nombre)
  images: ["assets/products/shadow-beast-1.jpg"],
  sizes: ["S", "M", "L", "XL", "XXL"],
  inStock: true,                 // false → "Rupture de stock", bouton désactivé
  isNew: true,                   // badge "New"
  isLimited: true,               // badge "Limited"
  name:        { fr: "T-Shirt Shadow Beast", ar: "تيشيرت شادو بيست" },
  description: { fr: "…", ar: "…" },
  material:    { fr: "…", ar: "…" },
  sizeGuideNote:{ fr: "…", ar: "…" }
}
```

La liste `window.VYRON_FEATURED` en bas du fichier existe pour un usage futur (champ *Pièce phare*
dans `admin.html`) — elle n'est lue par aucune section du site actuellement.
Si tu édites `products-data.js` à la main, ré-importe-le ensuite dans `admin.html` (menu ⋯ → Importer)
pour que les deux restent synchro.

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
5. Pour mettre à jour : re-glisse le dossier (avec le nouveau `products-data.js` et les photos).

> `admin.html` peut rester dans le dossier (il est en `noindex` et ne peut rien casser sur le
> site en ligne), ou tu peux le retirer avant d'uploader si tu préfères qu'il soit vraiment privé.

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

## Récapitulatif — où régler quoi

| Quoi | Où |
|---|---|
| Produits, stock, pièces phares | **`admin.html`** (génère `products-data.js`) |
| Numéro WhatsApp — `WHATSAPP_NUMBER` | `script.js`, section `1. CONFIG` (format `213…`) |
| URL Google Sheet — `SHEET_ENDPOINT` | `script.js`, section `1. CONFIG` |
| Liens réseaux — `SOCIAL.instagram` / `.tiktok` | `script.js`, section `1. CONFIG` |
| Frais de livraison — `WILAYA_DELIVERY_FEES` | `script.js`, section `3` (`home` / `desk` par wilaya) |
| Photo du hero | `styles.css`, `.hero__bg` |
| Images lookbook / Instagram | `script.js`, `renderLookbook()` / `renderInstagram()` |

---

## Notes techniques

- **Aucune librairie externe, aucun build** : `index.html` + `styles.css` + `script.js`
  + `products-data.js` (catalogue) + `admin.html` (outil produits, hors ligne). Icônes en SVG
  inline. Tout dans le même dossier. Seule ressource distante : Google Fonts.
- **`products-data.js`** est chargé avant `script.js` et fournit `window.VYRON_PRODUCTS`
  (le catalogue affiché) et `window.VYRON_FEATURED` (réservé, pas encore utilisé sur le site).
  C'est le fichier généré par `admin.html`.
- **`admin.html`** : 100 % local, stocke ton brouillon dans `localStorage` (`vyron_admin_v2`),
  n'envoie rien nulle part. À ne pas mettre en ligne (marqué `noindex` par sécurité).
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
