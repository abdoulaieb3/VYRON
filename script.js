/* =====================================================================
   VYRON — SCRIPT
   Sommaire :
   1. CONFIG        — WhatsApp, endpoint Google Sheet, réseaux sociaux
   2. PRODUITS      — tableau éditable
   3. WILAYAS + FRAIS DE LIVRAISON
   4. I18N          — contenu FR / AR
   5. STATE
   6. HELPERS
   7. RENDU         — nav, featured, produits, why, lookbook, instagram
   8. FILTRES / RECHERCHE / TRI
   9. QUICK-VIEW
   10. PANIER
   11. CHECKOUT + GOOGLE SHEET + WHATSAPP
   12. CONFIRMATION
   13. LANGUE
   14. ANIMATIONS
   15. INIT
   ===================================================================== */

/* ------------------------------------------------------------------
   1. CONFIG  —  ⚙️  MODIFIE UNIQUEMENT CES LIGNES
   ------------------------------------------------------------------ */

// Numéro WhatsApp au format international SANS le "+" ni espaces (213 + numéro sans le 0)
const WHATSAPP_NUMBER = "0556094047"; // ⚙️ MODIFIER

// URL du Web App Google Apps Script (voir google-apps-script.gs + README)
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyM213ERKBsuqXl61qolFz5Wx1Cq2A-IEUmmak5Y1a4XOVqNrcpl2Aw9KTKRsGJwM1i/exec"; // ⚙️ MODIFIER

// Liens réseaux sociaux (utilisés partout sur le site)
const SOCIAL = {
  instagram: "https://www.instagram.com/v.yron_official/", // ⚙️ MODIFIER
  tiktok:    "https://tiktok.com/@vyron.officiel",    // ⚙️ MODIFIER
  whatsapp:  "https://wa.me/" + WHATSAPP_NUMBER
};

const CURRENCY = "DA";

/* ------------------------------------------------------------------
   2. PRODUITS
   Le catalogue vit dans le fichier  products-data.js  (chargé juste
   avant ce script). Pour ajouter / modifier un produit ou changer le
   stock : ouvre  admin.html , fais tes changements, télécharge le
   nouveau  products-data.js  et remplace le fichier. Aucun code à toucher ici.
   ------------------------------------------------------------------ */
const PRODUCTS = Array.isArray(window.VYRON_PRODUCTS) ? window.VYRON_PRODUCTS : [];
const FEATURED_IDS = (Array.isArray(window.VYRON_FEATURED) && window.VYRON_FEATURED.length)
  ? window.VYRON_FEATURED
  : PRODUCTS.filter(p => p.isNew).slice(0, 4).map(p => p.id);

if (!PRODUCTS.length){
  console.error("[VYRON] products-data.js introuvable ou vide — la boutique n'a aucun produit à afficher. Vérifie que le fichier est bien à la racine du site.");
}

/* ------------------------------------------------------------------
   3. WILAYAS + FRAIS DE LIVRAISON
   ⚙️  MODIFIER CES TARIFS — { domicile, stopDesk } en DA
   ------------------------------------------------------------------ */
const WILAYA_DELIVERY_FEES = {
  "01 - Adrar":            { home: 1000, desk: 700 },
  "02 - Chlef":            { home: 700,  desk: 400 },
  "03 - Laghouat":         { home: 850,  desk: 550 },
  "04 - Oum El Bouaghi":   { home: 750,  desk: 450 },
  "05 - Batna":            { home: 750,  desk: 450 },
  "06 - Béjaïa":           { home: 700,  desk: 400 },
  "07 - Biskra":           { home: 800,  desk: 500 },
  "08 - Béchar":           { home: 1000, desk: 700 },
  "09 - Blida":            { home: 500,  desk: 350 },
  "10 - Bouira":           { home: 650,  desk: 400 },
  "11 - Tamanrasset":      { home: 1200, desk: 900 },
  "12 - Tébessa":          { home: 800,  desk: 500 },
  "13 - Tlemcen":          { home: 750,  desk: 450 },
  "14 - Tiaret":           { home: 750,  desk: 450 },
  "15 - Tizi Ouzou":       { home: 650,  desk: 400 },
  "16 - Alger":            { home: 450,  desk: 300 },
  "17 - Djelfa":           { home: 800,  desk: 500 },
  "18 - Jijel":            { home: 700,  desk: 400 },
  "19 - Sétif":            { home: 700,  desk: 400 },
  "20 - Saïda":            { home: 800,  desk: 500 },
  "21 - Skikda":           { home: 700,  desk: 400 },
  "22 - Sidi Bel Abbès":   { home: 750,  desk: 450 },
  "23 - Annaba":           { home: 700,  desk: 400 },
  "24 - Guelma":           { home: 750,  desk: 450 },
  "25 - Constantine":      { home: 700,  desk: 400 },
  "26 - Médéa":            { home: 600,  desk: 400 },
  "27 - Mostaganem":       { home: 750,  desk: 450 },
  "28 - M'Sila":           { home: 750,  desk: 450 },
  "29 - Mascara":          { home: 750,  desk: 450 },
  "30 - Ouargla":          { home: 950,  desk: 650 },
  "31 - Oran":             { home: 700,  desk: 400 },
  "32 - El Bayadh":        { home: 950,  desk: 650 },
  "33 - Illizi":           { home: 1200, desk: 900 },
  "34 - Bordj Bou Arréridj":{ home: 700, desk: 400 },
  "35 - Boumerdès":        { home: 550,  desk: 350 },
  "36 - El Tarf":          { home: 750,  desk: 450 },
  "37 - Tindouf":          { home: 1200, desk: 900 },
  "38 - Tissemsilt":       { home: 800,  desk: 500 },
  "39 - El Oued":          { home: 900,  desk: 600 },
  "40 - Khenchela":        { home: 800,  desk: 500 },
  "41 - Souk Ahras":       { home: 800,  desk: 500 },
  "42 - Tipaza":           { home: 550,  desk: 350 },
  "43 - Mila":             { home: 700,  desk: 400 },
  "44 - Aïn Defla":        { home: 650,  desk: 400 },
  "45 - Naâma":            { home: 1000, desk: 700 },
  "46 - Aïn Témouchent":   { home: 750,  desk: 450 },
  "47 - Ghardaïa":         { home: 900,  desk: 600 },
  "48 - Relizane":         { home: 750,  desk: 450 },
  "49 - Timimoun":         { home: 1100, desk: 800 },
  "50 - Bordj Badji Mokhtar":{ home: 1300, desk: 1000 },
  "51 - Ouled Djellal":    { home: 850,  desk: 550 },
  "52 - Béni Abbès":       { home: 1100, desk: 800 },
  "53 - In Salah":         { home: 1300, desk: 1000 },
  "54 - In Guezzam":       { home: 1400, desk: 1100 },
  "55 - Touggourt":        { home: 950,  desk: 650 },
  "56 - Djanet":           { home: 1400, desk: 1100 },
  "57 - El M'Ghair":       { home: 900,  desk: 600 },
  "58 - El Meniaa":        { home: 1000, desk: 700 }
};

/* ------------------------------------------------------------------
   4. I18N  —  CONTENU FR / AR
   ------------------------------------------------------------------ */
const I18N = {
  fr: {
    nav: [
      { label: "Accueil", href: "#accueil" },
      { label: "Boutique", href: "#boutique" },
      { label: "Collections", href: "#collections" },
      { label: "Lookbook", href: "#lookbook" },
      { label: "Manifeste", href: "#manifeste" },
      { label: "FAQ", href: "#" , info: "faq" },
      { label: "Contact", href: "#contact" }
    ],
    "hero.eyebrow": "Streetwear · Algérie · Séries limitées",
    "hero.tagline": "Made From The Street",
    "hero.subline": "Beauty in Darkness",
    "hero.ctaShop": "Voir la boutique",
    "hero.ctaLook": "Lookbook",
    "hero.scroll": "Scroll",
    "featured.eyebrow": "Collection",
    "featured.title": "Pièces phares",
    "shop.eyebrow": "Latest Drop",
    "shop.title": "La boutique",
    "shop.sortNew": "Nouveautés",
    "shop.sortAsc": "Prix croissant",
    "shop.sortDesc": "Prix décroissant",
    "shop.noResults": "Aucun produit ne correspond à ta recherche.",
    "shop.searchPlaceholder": "Rechercher un produit…",
    "shop.results": (n) => n + (n > 1 ? " produits" : " produit"),
    filters: { all: "Tous", tshirts: "T-Shirts", shorts: "Shorts", joggers: "Joggers", jackets: "Vestes", caps: "Casquettes" },
    "why.eyebrow": "Pourquoi VYRON",
    "why.title": "Ce qui nous sépare",
    why: [
      { t: "Qualité Premium", d: "Cotons lourds, coutures renforcées, prints qui ne craquellent pas. Testé sur le terrain." },
      { t: "Séries Limitées", d: "Chaque drop est produit en quantité réduite. Une fois épuisé, il ne revient pas." },
      { t: "Fait Pour La Rue", d: "Coupes oversize pensées pour le mouvement, le skate, la nuit et la ville." },
      { t: "Livraison Partout en Algérie", d: "58 wilayas. Domicile ou stop desk. Paiement à la livraison." }
    ],
    "lookbook.eyebrow": "Éditorial",
    "lookbook.title": "Lookbook",
    lookbookCaps: ["Shadow Beast — Alger", "VYRON 01 — Black Edition", "Drop 01 — Limited", "Beauty in Darkness"],
    "manifesto.eyebrow": "Manifeste",
    "manifesto.quote": "Nés dans l'ombre des rues. VYRON n'est pas une marque, c'est une réponse. Chaque pièce est une armure — coupée pour ceux qui avancent quand la ville dort. La beauté vit dans l'obscurité.",
    "manifesto.sign": "— VYRON, Made From The Street",
    "ig.eyebrow": "Communauté",
    "ig.title": "@vyron.officiel",
    "ig.follow": "Suivre sur Instagram →",
    "nl.eyebrow": "Newsletter",
    "nl.title": "Reste dans l'ombre",
    "nl.text": "Accès prioritaire aux drops, offres privées et coulisses. Zéro spam.",
    "nl.btn": "Je m'inscris",
    "nl.ok": "Bienvenue dans l'ombre. Vérifie ta boîte mail.",
    "nl.err": "Adresse e-mail invalide.",
    "footer.shop": "Boutique", "footer.all": "Tous les produits", "footer.featured": "Pièces phares",
    "footer.lookbook": "Lookbook", "footer.newsletter": "Newsletter",
    "footer.help": "Aide", "footer.contact": "Contact", "footer.shipping": "Livraison",
    "footer.returns": "Retours", "footer.size": "Guide des tailles",
    "footer.follow": "Suivre", "footer.rights": "Tous droits réservés · Alger, Algérie",
    "cart.title": "Panier",
    "cart.subtotal": "Sous-total", "cart.delivery": "Livraison", "cart.total": "Total",
    "cart.tbd": "à calculer",
    "cart.note": "Frais de livraison calculés au moment du choix de la wilaya.",
    "cart.checkout": "Passer à la commande",
    "cart.empty": "Ton panier est vide",
    "cart.emptyCta": "Découvrir la boutique",
    "cart.size": "Taille", "cart.qty": "Qté", "cart.remove": "Retirer",
    "toast.added": "Ajouté au panier",
    "toast.removed": "Retiré du panier",
    "toast.orderSent": "Commande envoyée",
    qv: {
      inStock: "En stock", outStock: "Rupture de stock",
      selectSize: "Choisis une taille", sizeErr: "Sélectionne une taille avant d'ajouter au panier.",
      qty: "Quantité", material: "Matière & entretien", sizeGuide: "Guide des tailles",
      addCart: "Ajouter au panier", wa: "Commander via WhatsApp",
      related: "Produits similaires", from: "à partir de"
    },
    checkout: {
      eyebrow: "Commande · Paiement à la livraison", title: "Finaliser",
      contact: "Tes coordonnées", name: "Nom complet", phone: "Numéro de téléphone",
      address: "Adresse de livraison", wilaya: "Wilaya", wilayaPlaceholder: "Choisir…",
      commune: "Commune / Ville", fullAddress: "Adresse complète",
      deliveryType: "Type de livraison", home: "Livraison à domicile", desk: "Stop Desk / Point relais",
      summary: "Récapitulatif", confirm: "Confirmer la commande", whatsapp: "Commander via WhatsApp",
      codNote: "Paiement à la livraison (Cash on Delivery). Notre équipe te contacte pour confirmer avant expédition.",
      errName: "Merci d'indiquer ton nom.",
      errPhone: "Numéro algérien invalide (ex : 0555 12 34 56).",
      errWilaya: "Choisis ta wilaya.",
      errCommune: "Indique ta commune.",
      errAddress: "Adresse trop courte.",
      sending: "Envoi…"
    },
    confirm: {
      title: "Commande reçue",
      msg: (name, num, phone) => "Merci " + name + " ! Ta commande " + num + " a été reçue. Notre équipe te contactera au " + phone + " pour confirmer.",
      items: "Articles", delivery: "Livraison", total: "Total", deliveryTo: "Livraison vers",
      close: "Continuer mes achats", waBtn: "Envoyer aussi sur WhatsApp"
    },
    info: {
      faq: { title: "FAQ", html: "<p><strong>Comment commander ?</strong><br>Ajoute tes pièces au panier, choisis ta wilaya et ton mode de livraison, puis confirme. Tu peux aussi commander via WhatsApp.</p><p><strong>Quels sont les délais ?</strong><br>2 à 5 jours ouvrés selon la wilaya.</p><p><strong>Comment payer ?</strong><br>Paiement à la livraison (cash), partout en Algérie.</p><p><strong>Puis-je échanger une taille ?</strong><br>Oui, sous 7 jours, pièce non portée avec étiquette. Voir Retours.</p>" },
      contact: { title: "Contact", html: "<p>Écris-nous, on répond vite.</p><p>Instagram : <strong>@vyron.officiel</strong><br>WhatsApp : <strong>+" + WHATSAPP_NUMBER + "</strong><br>Email : <strong>contact@vyron.dz</strong></p><p>Alger, Algérie.</p>" },
      shipping: { title: "Livraison", html: "<p>Livraison dans les 58 wilayas via nos partenaires transporteurs.</p><p><strong>Domicile</strong> : le livreur t'appelle avant de passer.<br><strong>Stop Desk</strong> : tu récupères ton colis au point relais de ta ville (moins cher).</p><p>Frais calculés automatiquement selon la wilaya au moment de la commande. Délais : 2 à 5 jours ouvrés.</p>" },
      returns: { title: "Retours & Échanges", html: "<p>Tu as <strong>7 jours</strong> après réception pour demander un échange de taille ou un retour.</p><p>Conditions : pièce non portée, non lavée, étiquettes attachées, emballage d'origine.</p><p>Les frais de retour sont à la charge du client sauf erreur de notre part. Contacte-nous sur WhatsApp pour lancer la procédure.</p>" },
      size: { title: "Guide des tailles", html: "<p>Mesures approximatives à plat (cm), tolérance ±2 cm.</p><table style='width:100%;border-collapse:collapse;font-size:13px'><tr style='color:#a5a19a'><td style='padding:6px 0'>Taille</td><td>Poitrine</td><td>Longueur</td></tr><tr><td style='padding:6px 0'>S</td><td>52</td><td>70</td></tr><tr><td style='padding:6px 0'>M</td><td>55</td><td>72</td></tr><tr><td style='padding:6px 0'>L</td><td>58</td><td>74</td></tr><tr><td style='padding:6px 0'>XL</td><td>61</td><td>76</td></tr><tr><td style='padding:6px 0'>XXL</td><td>64</td><td>78</td></tr></table><p style='margin-top:12px'>Nos coupes sont oversize : pour un fit ajusté, prends une taille en dessous.</p>" }
    }
  },
  ar: {
    nav: [
      { label: "الرئيسية", href: "#accueil" },
      { label: "المتجر", href: "#boutique" },
      { label: "المجموعات", href: "#collections" },
      { label: "لوك بوك", href: "#lookbook" },
      { label: "البيان", href: "#manifeste" },
      { label: "أسئلة شائعة", href: "#", info: "faq" },
      { label: "اتصل بنا", href: "#contact" }
    ],
    "hero.eyebrow": "ستريت وير · الجزائر · إصدارات محدودة",
    "hero.tagline": "Made From The Street",
    "hero.subline": "Beauty in Darkness",
    "hero.ctaShop": "تصفّح المتجر",
    "hero.ctaLook": "لوك بوك",
    "hero.scroll": "انزل",
    "featured.eyebrow": "المجموعة",
    "featured.title": "القطع المميزة",
    "shop.eyebrow": "أحدث دروب",
    "shop.title": "المتجر",
    "shop.sortNew": "الجديد",
    "shop.sortAsc": "السعر تصاعدياً",
    "shop.sortDesc": "السعر تنازلياً",
    "shop.noResults": "لا يوجد منتج يطابق بحثك.",
    "shop.searchPlaceholder": "ابحث عن منتج…",
    "shop.results": (n) => n + " منتج",
    filters: { all: "الكل", tshirts: "تيشيرت", shorts: "شورت", joggers: "جوغرز", jackets: "جواكيت", caps: "كاسكيطات" },
    "why.eyebrow": "لماذا فايرون",
    "why.title": "ما يميّزنا",
    why: [
      { t: "جودة عالية", d: "أقمشة قطنية ثقيلة، خياطة مقوّاة، طباعة لا تتشقق. مُختبرة في الشارع." },
      { t: "إصدارات محدودة", d: "كل دروب يُنتَج بكميات قليلة. بعد نفاده لا يعود." },
      { t: "مصمّم للشارع", d: "قصّات واسعة مدروسة للحركة والسكيت والليل والمدينة." },
      { t: "توصيل لكل الجزائر", d: "58 ولاية. للمنزل أو ستوب ديسك. الدفع عند الاستلام." }
    ],
    "lookbook.eyebrow": "تحرير",
    "lookbook.title": "لوك بوك",
    lookbookCaps: ["شادو بيست — الجزائر", "فايرون 01 — النسخة السوداء", "دروب 01 — محدود", "الجمال في العتمة"],
    "manifesto.eyebrow": "البيان",
    "manifesto.quote": "وُلدنا في ظلّ الشوارع. فايرون ليست علامة، بل ردّ. كل قطعة درعٌ — مُفصّلة لمن يتقدّمون حين تنام المدينة. الجمال يعيش في العتمة.",
    "manifesto.sign": "— فايرون، Made From The Street",
    "ig.eyebrow": "المجتمع",
    "ig.title": "@vyron.officiel",
    "ig.follow": "تابعنا على إنستغرام →",
    "nl.eyebrow": "النشرة",
    "nl.title": "ابقَ في العتمة",
    "nl.text": "أولوية الوصول للدروبات، عروض خاصة وكواليس. بدون إزعاج.",
    "nl.btn": "اشترك",
    "nl.ok": "أهلاً بك في العتمة. تحقّق من بريدك.",
    "nl.err": "بريد إلكتروني غير صالح.",
    "footer.shop": "المتجر", "footer.all": "كل المنتجات", "footer.featured": "القطع المميزة",
    "footer.lookbook": "لوك بوك", "footer.newsletter": "النشرة",
    "footer.help": "المساعدة", "footer.contact": "اتصل بنا", "footer.shipping": "التوصيل",
    "footer.returns": "الإرجاع", "footer.size": "دليل المقاسات",
    "footer.follow": "تابعنا", "footer.rights": "كل الحقوق محفوظة · الجزائر العاصمة",
    "cart.title": "السلة",
    "cart.subtotal": "المجموع الفرعي", "cart.delivery": "التوصيل", "cart.total": "الإجمالي",
    "cart.tbd": "يُحتسب لاحقاً",
    "cart.note": "تُحتسب رسوم التوصيل عند اختيار الولاية.",
    "cart.checkout": "إتمام الطلب",
    "cart.empty": "سلّتك فارغة",
    "cart.emptyCta": "اكتشف المتجر",
    "cart.size": "المقاس", "cart.qty": "الكمية", "cart.remove": "حذف",
    "toast.added": "أُضيف إلى السلة",
    "toast.removed": "حُذف من السلة",
    "toast.orderSent": "تم إرسال الطلب",
    qv: {
      inStock: "متوفر", outStock: "نفد المخزون",
      selectSize: "اختر المقاس", sizeErr: "اختر مقاساً قبل الإضافة إلى السلة.",
      qty: "الكمية", material: "الخامة والعناية", sizeGuide: "دليل المقاسات",
      addCart: "أضف إلى السلة", wa: "اطلب عبر واتساب",
      related: "منتجات مشابهة", from: "ابتداءً من"
    },
    checkout: {
      eyebrow: "الطلب · الدفع عند الاستلام", title: "إتمام الطلب",
      contact: "معلوماتك", name: "الاسم الكامل", phone: "رقم الهاتف",
      address: "عنوان التوصيل", wilaya: "الولاية", wilayaPlaceholder: "اختر…",
      commune: "البلدية / المدينة", fullAddress: "العنوان الكامل",
      deliveryType: "نوع التوصيل", home: "توصيل للمنزل", desk: "ستوب ديسك / نقطة استلام",
      summary: "ملخص الطلب", confirm: "تأكيد الطلب", whatsapp: "اطلب عبر واتساب",
      codNote: "الدفع عند الاستلام. فريقنا سيتصل بك للتأكيد قبل الإرسال.",
      errName: "من فضلك أدخل اسمك.",
      errPhone: "رقم جزائري غير صالح (مثال: 0555 12 34 56).",
      errWilaya: "اختر ولايتك.",
      errCommune: "أدخل بلديتك.",
      errAddress: "العنوان قصير جداً.",
      sending: "جارٍ الإرسال…"
    },
    confirm: {
      title: "تم استلام الطلب",
      msg: (name, num, phone) => "شكراً " + name + " ! تم استلام طلبك " + num + ". سيتصل بك فريقنا على " + phone + " للتأكيد.",
      items: "المنتجات", delivery: "التوصيل", total: "الإجمالي", deliveryTo: "التوصيل إلى",
      close: "متابعة التسوّق", waBtn: "أرسل أيضاً عبر واتساب"
    },
    info: {
      faq: { title: "أسئلة شائعة", html: "<p><strong>كيف أطلب؟</strong><br>أضف قطعك إلى السلة، اختر الولاية ونوع التوصيل ثم أكّد. يمكنك أيضاً الطلب عبر واتساب.</p><p><strong>ما هي المدة؟</strong><br>من 2 إلى 5 أيام عمل حسب الولاية.</p><p><strong>كيف أدفع؟</strong><br>الدفع عند الاستلام نقداً، في كل الجزائر.</p><p><strong>هل يمكن تبديل المقاس؟</strong><br>نعم خلال 7 أيام، قطعة غير ملبوسة مع العلامة.</p>" },
      contact: { title: "اتصل بنا", html: "<p>راسلنا، نردّ بسرعة.</p><p>إنستغرام: <strong>@vyron.officiel</strong><br>واتساب: <strong>+" + WHATSAPP_NUMBER + "</strong><br>البريد: <strong>contact@vyron.dz</strong></p><p>الجزائر العاصمة.</p>" },
      shipping: { title: "التوصيل", html: "<p>التوصيل إلى 58 ولاية عبر شركات الشحن الشريكة.</p><p><strong>للمنزل</strong>: يتصل بك عامل التوصيل قبل المجيء.<br><strong>ستوب ديسك</strong>: تستلم الطرد من نقطة الاستلام في مدينتك (أرخص).</p><p>تُحتسب الرسوم تلقائياً حسب الولاية. المدة: 2 إلى 5 أيام عمل.</p>" },
      returns: { title: "الإرجاع والتبديل", html: "<p>لديك <strong>7 أيام</strong> بعد الاستلام لطلب تبديل المقاس أو الإرجاع.</p><p>الشروط: قطعة غير ملبوسة وغير مغسولة، العلامات موجودة، التغليف الأصلي.</p><p>رسوم الإرجاع على العميل إلا في حال خطأ منّا. تواصل معنا عبر واتساب.</p>" },
      size: { title: "دليل المقاسات", html: "<p>قياسات تقريبية مسطّحة (سم)، هامش ±2 سم.</p><table style='width:100%;border-collapse:collapse;font-size:13px'><tr style='color:#a5a19a'><td style='padding:6px 0'>المقاس</td><td>الصدر</td><td>الطول</td></tr><tr><td style='padding:6px 0'>S</td><td>52</td><td>70</td></tr><tr><td style='padding:6px 0'>M</td><td>55</td><td>72</td></tr><tr><td style='padding:6px 0'>L</td><td>58</td><td>74</td></tr><tr><td style='padding:6px 0'>XL</td><td>61</td><td>76</td></tr><tr><td style='padding:6px 0'>XXL</td><td>64</td><td>78</td></tr></table><p style='margin-top:12px'>قصّاتنا واسعة: لفيت أضيق اختر مقاساً أصغر.</p>" }
    }
  }
};

/* ------------------------------------------------------------------
   5. STATE
   ------------------------------------------------------------------ */
const LS_CART = "vyron_cart_v1";
const LS_ORDERS = "vyron_orders_v1";
const LS_LANG = "vyron_lang_v1";

const state = {
  lang: localStorage.getItem(LS_LANG) || "fr",
  cart: loadJSON(LS_CART, []),          // [{id, size, qty}]
  filter: "all",
  search: "",
  sort: "new",
  wilaya: "",
  deliveryType: "home",
  currentProduct: null,
  currentSize: null,
  currentQty: 1
};

/* ------------------------------------------------------------------
   6. HELPERS
   ------------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function loadJSON(key, fallback){
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
  catch(e){ return fallback; }
}
function saveJSON(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }

function t(){ return I18N[state.lang]; }
function money(n){ return new Intl.NumberFormat(state.lang === "ar" ? "ar-DZ" : "fr-DZ").format(n) + " " + CURRENCY; }
function getProduct(id){ return PRODUCTS.find(p => p.id === id); }
function pName(p){ return p.name[state.lang]; }

// Image de secours si une URL ne charge pas (SVG data-uri, aucun réseau) — sobre et raccord avec l'identité
const PLACEHOLDER_IMG = "data:image/svg+xml," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'>" +
    "<defs><radialGradient id='g' cx='50%' cy='40%' r='75%'>" +
      "<stop offset='0' stop-color='#171717'/><stop offset='1' stop-color='#0b0b0b'/>" +
    "</radialGradient></defs>" +
    "<rect width='400' height='500' fill='url(#g)'/>" +
    "<text x='200' y='250' fill='#34302b' font-family='Georgia, serif' font-size='44' font-weight='700' letter-spacing='6' text-anchor='middle'>VYRON</text>" +
    "<rect x='170' y='272' width='60' height='2' fill='#7c1420'/>" +
    "<text x='200' y='300' fill='#2b2926' font-family='Arial, sans-serif' font-size='9' letter-spacing='3' text-anchor='middle'>MADE FROM THE STREET</text>" +
  "</svg>"
);
function imgTag(src, alt, cls){
  return "<img src='" + src + "' alt='" + escapeAttr(alt) + "'" + (cls ? " class='" + cls + "'" : "") +
         " loading='lazy' onerror=\"this.onerror=null;this.src='" + PLACEHOLDER_IMG + "'\">";
}
function escapeAttr(s){ return String(s).replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g,"&lt;"); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

function toast(msg){
  const el = $("[data-toast]");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function lockScroll(lock){
  document.body.classList.toggle("no-scroll", lock);
}

/* ------------------------------------------------------------------
   7. RENDU
   ------------------------------------------------------------------ */
function renderNav(){
  const items = t().nav;
  const desktop = $("[data-nav]");
  const mobile  = $("[data-mobile-nav]");
  const build = (arr) => arr.map(it =>
    `<a href="${it.href}"${it.info ? ` data-open-info="${it.info}"` : ""}>${escapeHtml(it.label)}</a>`
  ).join("");
  desktop.innerHTML = build(items);
  mobile.innerHTML = build(items) +
    `<div class="mm-foot">
       <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a>
       <a href="${SOCIAL.tiktok}" target="_blank" rel="noopener">TikTok</a>
       <a href="${SOCIAL.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
     </div>`;
}

function renderFeatured(){
  const wrap = $("[data-featured]");
  const list = FEATURED_IDS.map(getProduct).filter(Boolean);
  wrap.innerHTML = list.map((p, i) => {
    const tag = p.isLimited
      ? { label: "Limited", cls: "tag--limited" }
      : (p.isNew ? { label: "New", cls: "tag--new" } : { label: "VYRON", cls: "" });
    return `
    <article class="feat reveal d${(i%4)+1}" data-quick="${p.id}" tabindex="0" role="button" aria-label="${escapeAttr(pName(p))}">
      ${imgTag(p.images[0], pName(p))}
      <div class="feat__body">
        <span class="tag ${tag.cls}">${tag.label}</span>
        <h3>${escapeHtml(pName(p))}</h3>
        <span class="price">${money(p.price)}</span>
      </div>
    </article>`;
  }).join("");
}

function renderFilters(){
  const wrap = $("[data-filters]");
  const f = t().filters;
  const cats = ["all", "tshirts", "shorts", "joggers", "jackets", "caps"];
  wrap.innerHTML = cats.map(c =>
    `<button class="pill${state.filter === c ? " active" : ""}" data-filter="${c}" type="button">${escapeHtml(f[c])}</button>`
  ).join("");
}

function renderWhy(){
  const wrap = $("[data-why]");
  const icons = [
    "<path d='M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z'/>",
    "<path d='M12 3v18M4 8l8-5 8 5M4 8v8l8 5 8-5V8'/>",
    "<path d='M4 20l6-16 4 9 3-5 3 12'/>",
    "<circle cx='12' cy='10' r='3'/><path d='M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Z'/>"
  ];
  wrap.innerHTML = t().why.map((c, i) => `
    <div class="why-cell reveal d${i+1}">
      <svg class="wi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${icons[i]}</svg>
      <h3>${escapeHtml(c.t)}</h3>
      <p>${escapeHtml(c.d)}</p>
    </div>
  `).join("");
}

function renderLookbook(){
  const wrap = $("[data-lookbook]");
  const imgs = ["assets/lookbook/look-1.jpg","assets/lookbook/look-2.jpg","assets/lookbook/look-3.jpg","assets/lookbook/look-4.jpg"];
  const caps = t().lookbookCaps;
  wrap.innerHTML = imgs.map((src, i) => `
    <!-- REPLACE LOOKBOOK IMAGE HERE -->
    <figure class="look">
      ${imgTag(src, caps[i] || "VYRON Lookbook")}
      <figcaption class="look__cap">${escapeHtml(caps[i] || "")}</figcaption>
    </figure>
  `).join("");
}

function renderInstagram(){
  const wrap = $("[data-ig]");
  // <!-- REPLACE INSTAGRAM IMAGE HERE : mets 6 images carrées dans assets/social/ -->
  const imgs = [
    "assets/products/shadow-beast-2.jpg",
    "assets/products/vyron01-2.jpg",
    "assets/lookbook/look-3.jpg",
    "assets/products/beauty-darkness-1.jpg",
    "assets/products/monarch-1.png",
    "assets/products/vyron01-1.jpg"
  ];
  wrap.innerHTML = imgs.map((src, i) => `
    <a class="ig-cell" href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Publication Instagram ${i+1}">
      ${imgTag(src, "VYRON sur Instagram")}
    </a>
  `).join("");
}

/* ------------------------------------------------------------------
   8. FILTRES / RECHERCHE / TRI  (les 3 se combinent)
   ------------------------------------------------------------------ */
function getVisibleProducts(){
  let list = PRODUCTS.slice();
  if (state.filter !== "all") list = list.filter(p => p.category === state.filter);
  if (state.search.trim()){
    const q = state.search.trim().toLowerCase();
    list = list.filter(p =>
      p.name.fr.toLowerCase().includes(q) ||
      p.name.ar.toLowerCase().includes(q)
    );
  }
  switch (state.sort){
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    default:           list.sort((a,b) => (b.isNew?1:0) - (a.isNew?1:0)); // Nouveautés d'abord
  }
  return list;
}

function renderProducts(){
  const grid = $("[data-product-grid]");
  const list = getVisibleProducts();
  const q = t();

  $("[data-results-count]").textContent = q["shop.results"](list.length);
  $("[data-no-results]").hidden = list.length !== 0;

  grid.innerHTML = list.map((p, i) => {
    const badges = [];
    if (!p.inStock) badges.push(`<span class="badge badge--out">${q.qv.outStock}</span>`);
    if (p.isNew)    badges.push(`<span class="badge badge--new">New</span>`);
    if (p.isLimited)badges.push(`<span class="badge badge--limited">Limited</span>`);
    const second = p.images[1]
      ? `<img class="img-2" src="${p.images[1]}" alt="" loading="lazy" onerror="this.style.display='none'">`
      : "";
    return `
      <article class="card${p.inStock ? "" : " is-out"} reveal d${(i%4)+1}">
        <div class="card__media" data-quick="${p.id}" role="button" tabindex="0" aria-label="${escapeAttr(pName(p))}">
          ${badges.length ? `<div class="badges">${badges.join("")}</div>` : ""}
          ${imgTag(p.images[0], pName(p))}
          ${second}
          <div class="card__quick">
            <button class="btn btn--solid btn--sm btn--full" data-quick="${p.id}" type="button">
              ${state.lang === "ar" ? "عرض سريع" : "Aperçu rapide"}
            </button>
          </div>
        </div>
        <div class="card__body">
          <span class="card__cat">${escapeHtml(q.filters[p.category] || p.category)}</span>
          <span class="card__name">${escapeHtml(pName(p))}</span>
          <span class="card__price">${money(p.price)}</span>
        </div>
      </article>`;
  }).join("");

  observeReveals();
}

/* ------------------------------------------------------------------
   9. QUICK-VIEW (modal produit)
   ------------------------------------------------------------------ */
function openQuickView(id){
  const p = getProduct(id);
  if (!p) return;
  state.currentProduct = p;
  state.currentSize = null;
  state.currentQty = 1;

  const q = t();
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const relatedFallback = PRODUCTS.filter(x => x.id !== p.id).slice(0, 4);
  const rel = (related.length ? related : relatedFallback);

  const panel = $("[data-modal-panel]");
  panel.innerHTML = `
    <button class="modal__close" data-close-modal type="button" aria-label="Fermer">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <div class="qv">
      <div class="qv__gallery">
        <div class="qv__main">${imgTag(p.images[0], pName(p))}</div>
        ${p.images.length > 1 ? `<div class="qv__thumbs">${p.images.map((src, i) =>
          `<button type="button" class="${i===0?"active":""}" data-qv-thumb="${i}" aria-label="Image ${i+1}">${imgTag(src, "")}</button>`
        ).join("")}</div>` : ""}
      </div>
      <div class="qv__info">
        <span class="cat">${escapeHtml(q.filters[p.category] || p.category)}</span>
        <h3>${escapeHtml(pName(p))}</h3>
        <div class="qv__price">${money(p.price)}</div>
        <div class="qv__stock ${p.inStock ? "in" : "out"}">${p.inStock ? q.qv.inStock : q.qv.outStock}</div>
        <p class="qv__desc">${escapeHtml(p.description[state.lang])}</p>

        <div>
          <span class="field-label">${q.qv.selectSize}</span>
          <div class="size-row" data-qv-sizes>
            ${p.sizes.map(s => `<button type="button" class="size-btn" data-size="${escapeAttr(s)}">${escapeHtml(s)}</button>`).join("")}
          </div>
          <p class="size-error" data-size-error>${q.qv.sizeErr}</p>
        </div>

        <div>
          <span class="field-label">${q.qv.qty}</span>
          <div class="qty-row" data-qv-qty>
            <button type="button" data-qty="-1" aria-label="Diminuer">−</button>
            <span data-qty-value>1</span>
            <button type="button" data-qty="1" aria-label="Augmenter">+</button>
          </div>
        </div>

        <div class="accordion" data-accordion>
          <button type="button"><span>${q.qv.material}</span><span class="plus">+</span></button>
          <div class="accordion__body"><p>${escapeHtml(p.material[state.lang])}</p></div>
        </div>
        <div class="accordion" data-accordion>
          <button type="button"><span>${q.qv.sizeGuide}</span><span class="plus">+</span></button>
          <div class="accordion__body"><p>${escapeHtml(p.sizeGuideNote[state.lang])}</p></div>
        </div>

        <div class="qv__actions">
          <button class="btn btn--solid btn--full" data-qv-add ${p.inStock ? "" : "disabled"} type="button">${q.qv.addCart}</button>
          <button class="btn btn--wa btn--full" data-qv-wa type="button">${q.qv.wa}</button>
        </div>
      </div>
    </div>

    <div class="related">
      <h4>${q.qv.related}</h4>
      <div class="related-grid">
        ${rel.map(r => `
          <div class="related-card" data-quick="${r.id}" role="button" tabindex="0" aria-label="${escapeAttr(pName(r))}">
            <div class="rc-media">${imgTag(r.images[0], pName(r))}</div>
            <p>${escapeHtml(pName(r))}</p>
            <span>${money(r.price)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  $("[data-modal]").classList.add("show");
  $("[data-modal]").setAttribute("aria-hidden", "false");
  $("[data-overlay]").classList.add("show");
  lockScroll(true);
}

function closeQuickView(){
  $("[data-modal]").classList.remove("show");
  $("[data-modal]").setAttribute("aria-hidden", "true");
  maybeReleaseOverlay();
}

/* ------------------------------------------------------------------
   10. PANIER
   ------------------------------------------------------------------ */
function cartCount(){ return state.cart.reduce((s, l) => s + l.qty, 0); }
function cartSubtotal(){
  return state.cart.reduce((s, l) => {
    const p = getProduct(l.id);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
}
function deliveryFee(){
  if (!state.wilaya || !WILAYA_DELIVERY_FEES[state.wilaya]) return null;
  const fees = WILAYA_DELIVERY_FEES[state.wilaya];
  return state.deliveryType === "desk" ? fees.desk : fees.home;
}
function cartTotal(){
  const d = deliveryFee();
  return cartSubtotal() + (d || 0);
}

function addToCart(id, size, qty){
  const line = state.cart.find(l => l.id === id && l.size === size);
  if (line) line.qty += qty;
  else state.cart.push({ id, size, qty });
  persistCart();
  toast(t()["toast.added"]);
}
function removeLine(idx){
  state.cart.splice(idx, 1);
  persistCart();
  toast(t()["toast.removed"]);
}
function setLineQty(idx, delta){
  state.cart[idx].qty = Math.max(1, state.cart[idx].qty + delta);
  persistCart();
}
function persistCart(){
  saveJSON(LS_CART, state.cart);
  renderCart();
  updateCartBadge();
}
function updateCartBadge(){
  const n = cartCount();
  const badge = $("[data-cart-count]");
  badge.textContent = n;
  badge.classList.toggle("show", n > 0);
}

function renderCart(){
  const body = $("[data-cart-body]");
  const foot = $("[data-cart-foot]");
  const q = t();

  if (!state.cart.length){
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <span>${q["cart.empty"]}</span>
        <button class="btn btn--ghost btn--sm" data-close-cart type="button">${q["cart.emptyCta"]}</button>
      </div>`;
    foot.hidden = true;
    return;
  }

  body.innerHTML = state.cart.map((l, idx) => {
    const p = getProduct(l.id);
    if (!p) return "";
    return `
      <div class="cart-line">
        <img class="cart-line__img" src="${p.images[0]}" alt="${escapeAttr(pName(p))}" onerror="this.src='${PLACEHOLDER_IMG}'">
        <div class="cart-line__info">
          <span class="n">${escapeHtml(pName(p))}</span>
          <span class="meta">${q["cart.size"]}: ${escapeHtml(l.size)} · ${money(p.price)}</span>
          <div class="cart-line__ctrl">
            <div class="mini-qty">
              <button type="button" data-line-qty="${idx}" data-delta="-1" aria-label="−">−</button>
              <span>${l.qty}</span>
              <button type="button" data-line-qty="${idx}" data-delta="1" aria-label="+">+</button>
            </div>
            <button class="remove-line" type="button" data-remove-line="${idx}">${q["cart.remove"]}</button>
          </div>
        </div>
      </div>`;
  }).join("");

  foot.hidden = false;
  $("[data-cart-subtotal]").textContent = money(cartSubtotal());
  const d = deliveryFee();
  $("[data-cart-delivery]").textContent = d === null ? q["cart.tbd"] : money(d);
  $("[data-cart-total]").textContent = money(cartTotal());
}

function openCart(){
  renderCart();
  $("[data-cart-panel]").classList.add("show");
  $("[data-cart-panel]").setAttribute("aria-hidden", "false");
  $("[data-overlay]").classList.add("show");
  lockScroll(true);
}
function closeCart(){
  $("[data-cart-panel]").classList.remove("show");
  $("[data-cart-panel]").setAttribute("aria-hidden", "true");
  maybeReleaseOverlay();
}

function maybeReleaseOverlay(){
  const anyOpen =
    $("[data-cart-panel]").classList.contains("show") ||
    $("[data-modal]").classList.contains("show") ||
    $("[data-info-modal]").classList.contains("show");
  if (!anyOpen){
    $("[data-overlay]").classList.remove("show");
    lockScroll(false);
  }
}

/* ------------------------------------------------------------------
   11. CHECKOUT + GOOGLE SHEET + WHATSAPP
   ------------------------------------------------------------------ */
function populateWilayas(){
  const sel = $("[data-wilaya-select]");
  const first = sel.querySelector("option");
  sel.innerHTML = "";
  sel.appendChild(first);
  Object.keys(WILAYA_DELIVERY_FEES).forEach(w => {
    const o = document.createElement("option");
    o.value = w; o.textContent = w;
    sel.appendChild(o);
  });
}

function openCheckout(){
  if (!state.cart.length){ toast(t()["cart.empty"]); return; }
  renderCheckoutSummary();
  updateDeliveryPrices();
  $("[data-checkout-panel]").classList.add("show");
  $("[data-checkout-panel]").setAttribute("aria-hidden", "false");
  closeCart();
  lockScroll(true);
  $("[data-overlay]").classList.remove("show");
}
function closeCheckout(){
  $("[data-checkout-panel]").classList.remove("show");
  $("[data-checkout-panel]").setAttribute("aria-hidden", "true");
  lockScroll(false);
}

function updateDeliveryPrices(){
  const q = t();
  const fees = state.wilaya ? WILAYA_DELIVERY_FEES[state.wilaya] : null;
  $("[data-delivery-home-price]").textContent = fees ? money(fees.home) : (state.lang === "ar" ? "حسب الولاية" : "selon wilaya");
  $("[data-delivery-desk-price]").textContent = fees ? money(fees.desk) : (state.lang === "ar" ? "حسب الولاية" : "selon wilaya");
  renderCheckoutSummary();
  renderCart();
}

function renderCheckoutSummary(){
  const q = t();
  const linesWrap = $("[data-checkout-lines]");
  linesWrap.innerHTML = state.cart.map(l => {
    const p = getProduct(l.id);
    if (!p) return "";
    return `<div class="os-line">
      <span>${escapeHtml(pName(p))} <span class="q">(${escapeHtml(l.size)}) ×${l.qty}</span></span>
      <span>${money(p.price * l.qty)}</span>
    </div>`;
  }).join("");
  $("[data-ck-subtotal]").textContent = money(cartSubtotal());
  const d = deliveryFee();
  $("[data-ck-delivery]").textContent = d === null ? q["cart.tbd"] : money(d);
  $("[data-ck-total]").textContent = money(cartTotal());
}

// Validation
const PHONE_RE = /^0[5-7][0-9]{8}$/;
function validateCheckout(){
  const q = t();
  const form = $("[data-checkout-form]");
  let ok = true;
  const setErr = (name, bad) => {
    const field = form.querySelector(`[name="${name}"]`).closest(".field");
    field.classList.toggle("invalid", bad);
    if (bad) ok = false;
  };
  const v = (name) => (form.querySelector(`[name="${name}"]`).value || "").trim();

  setErr("name", v("name").length < 2);
  setErr("phone", !PHONE_RE.test(v("phone").replace(/[\s.-]/g, "")));
  setErr("wilaya", !v("wilaya"));
  setErr("commune", v("commune").length < 2);
  setErr("address", v("address").length < 8);

  if (!ok){
    const firstBad = form.querySelector(".field.invalid");
    if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return ok;
}

function collectOrder(){
  const form = $("[data-checkout-form]");
  const v = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
  const deliveryType = form.querySelector('[name="deliveryType"]:checked')?.value || "home";
  const d = deliveryFee();
  const items = state.cart.map(l => {
    const p = getProduct(l.id);
    return { id: l.id, name: p ? p.name.fr : l.id, size: l.size, qty: l.qty, price: p ? p.price : 0 };
  });
  return {
    orderNumber: "VYR-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random()*900+100),
    timestamp: new Date().toISOString(),
    customer: { name: v("name"), phone: v("phone").replace(/[\s.-]/g, "") },
    wilaya: v("wilaya"),
    commune: v("commune"),
    address: v("address"),
    deliveryType: deliveryType === "desk" ? "Stop Desk" : "Domicile",
    items,
    subtotal: cartSubtotal(),
    deliveryFee: d || 0,
    total: cartTotal()
  };
}

function itemsSummaryString(order){
  return order.items.map(it => `${it.name} (${it.size}) x${it.qty}`).join(", ");
}

// Envoi vers Google Sheet — mode no-cors, on ne bloque pas l'UI
async function sendToSheet(order){
  if (!SHEET_ENDPOINT || SHEET_ENDPOINT.startsWith("PASTE_")){
    console.warn("[VYRON] SHEET_ENDPOINT non configuré — commande non envoyée à Google Sheet.", order);
    return;
  }
  try {
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // évite le pré-vol CORS
      body: JSON.stringify({ type: "order", ...order })
    });
  } catch (e){
    console.error("[VYRON] Échec envoi Google Sheet :", e);
  }
}

async function submitOrder(){
  if (!validateCheckout()) return;
  const btn = $("[data-submit-order]");
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = t().checkout.sending;

  const order = collectOrder();

  // 3. Envoi Google Sheet (priorité — mais on n'attend pas la réponse longtemps)
  await sendToSheet(order);

  // 4. Copie locale + vidage du panier
  const past = loadJSON(LS_ORDERS, []);
  past.push(order);
  saveJSON(LS_ORDERS, past);

  state.cart = [];
  persistCart();

  btn.disabled = false;
  btn.textContent = original;

  // 5. Confirmation
  closeCheckout();
  showConfirmation(order);
  toast(t()["toast.orderSent"]);
}

/* WhatsApp — message pré-rempli propre */
function buildWhatsAppMessage(ref){
  const q = t();
  const form = $("[data-checkout-form]");
  const g = (name) => (form?.querySelector(`[name="${name}"]`)?.value || "").trim();

  const lines = [];
  lines.push("*VYRON — Nouvelle commande*");
  if (ref) lines.push("Réf : " + ref);
  if (g("name")) lines.push("Nom : " + g("name"));
  if (g("phone")) lines.push("Tél : " + g("phone"));
  if (g("wilaya")) lines.push("Wilaya : " + g("wilaya"));
  if (g("commune")) lines.push("Commune : " + g("commune"));
  if (g("address")) lines.push("Adresse : " + g("address"));
  const dt = form?.querySelector('[name="deliveryType"]:checked')?.value;
  lines.push("Livraison : " + (dt === "desk" ? "Stop Desk" : "Domicile"));
  lines.push("");
  lines.push("*Articles :*");
  state.cart.forEach(l => {
    const p = getProduct(l.id);
    if (p) lines.push("• " + p.name.fr + " (" + l.size + ") x" + l.qty + " — " + money(p.price * l.qty));
  });
  lines.push("");
  lines.push("Sous-total : " + money(cartSubtotal()));
  const d = deliveryFee();
  lines.push("Livraison : " + (d === null ? "à calculer" : money(d)));
  lines.push("*Total : " + money(cartTotal()) + "*");
  lines.push("");
  lines.push("Paiement à la livraison.");
  return lines.join("\n");
}
function openWhatsApp(ref){
  if (!state.cart.length){ toast(t()["cart.empty"]); return; }
  const msg = buildWhatsAppMessage(ref);
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
}

/* ------------------------------------------------------------------
   12. CONFIRMATION
   ------------------------------------------------------------------ */
let LAST_ORDER = null;
function showConfirmation(order){
  LAST_ORDER = order;
  const q = t();
  const panel = $("[data-confirm-panel]");
  panel.innerHTML = `
    <div class="check">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
    </div>
    <h3>${q.confirm.title}</h3>
    <div class="ordernum">${order.orderNumber}</div>
    <p class="cmsg">${escapeHtml(q.confirm.msg(order.customer.name, order.orderNumber, order.customer.phone))}</p>
    <div class="confirm-summary">
      ${order.items.map(it => `<div class="cs-line"><span>${escapeHtml(it.name)} (${escapeHtml(it.size)}) ×${it.qty}</span><span>${money(it.price*it.qty)}</span></div>`).join("")}
      <div class="cs-line"><span>${q.confirm.delivery} — ${escapeHtml(order.deliveryType)}</span><span>${money(order.deliveryFee)}</span></div>
      <div class="cs-line tot"><span>${q.confirm.total}</span><span>${money(order.total)}</span></div>
    </div>
    <p class="cmsg" style="font-size:12px">${q.confirm.deliveryTo} : ${escapeHtml(order.wilaya)}, ${escapeHtml(order.commune)}</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
      <button class="btn btn--wa btn--full" data-confirm-wa type="button">${q.confirm.waBtn}</button>
      <button class="btn btn--ghost btn--full" data-confirm-close type="button">${q.confirm.close}</button>
    </div>
  `;
  const m = $("[data-confirm]");
  m.classList.add("show");
  m.setAttribute("aria-hidden", "false");
  lockScroll(true);
}
function closeConfirmation(){
  $("[data-confirm]").classList.remove("show");
  $("[data-confirm]").setAttribute("aria-hidden", "true");
  lockScroll(false);
}

/* ------------------------------------------------------------------
   13. LANGUE
   ------------------------------------------------------------------ */
function applyStaticI18n(){
  const q = t();
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    let val = key.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), q);
    if (val === undefined) val = q[key];
    if (typeof val === "string") el.textContent = val;
  });
  // placeholders
  $("[data-search]").placeholder = q["shop.searchPlaceholder"];
  const email = $("[data-newsletter] input");
  if (email) email.placeholder = state.lang === "ar" ? "بريدك@example.com" : "ton@email.com";
}

function setLang(lang){
  state.lang = lang;
  localStorage.setItem(LS_LANG, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  $$(".lang-toggle button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));

  renderNav();
  renderFilters();
  renderFeatured();
  renderWhy();
  renderLookbook();
  renderInstagram();
  renderProducts();
  applyStaticI18n();
  renderCart();
  renderCheckoutSummary();
  updateDeliveryPrices();
  bindSocialLinks();
  observeReveals();
}

function bindSocialLinks(){
  $$("[data-social]").forEach(a => {
    const k = a.getAttribute("data-social");
    if (SOCIAL[k]) a.href = SOCIAL[k];
  });
}

/* ------------------------------------------------------------------
   14. ANIMATIONS AU SCROLL
   ------------------------------------------------------------------ */
let revealObserver;
function observeReveals(){
  if (!revealObserver){
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  $$(".reveal:not(.in)").forEach(el => revealObserver.observe(el));
}

function initParallax(){
  const bg = $("[data-parallax]");
  if (!bg) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight){
        bg.style.transform = "scale(1.08) translateY(" + (y * 0.18) + "px)";
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ------------------------------------------------------------------
   15. INIT + ÉVÉNEMENTS
   ------------------------------------------------------------------ */
function initEvents(){

  // Header scrolled
  const header = $(".header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Langue
  $$(".lang-toggle button").forEach(b =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );

  // Menu mobile
  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    $("[data-toggle-menu]").setAttribute("aria-expanded", String(open));
    lockScroll(open);
  };
  $("[data-toggle-menu]").addEventListener("click", () => toggleMenu());

  // Délégation de clics globale
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-quick],[data-filter],[data-open-cart],[data-close-cart],[data-checkout],[data-close-checkout],[data-close-modal],[data-open-info],[data-close-info],[data-confirm-close],[data-confirm-wa],[data-submit-order],[data-wa-checkout],[data-qv-add],[data-qv-wa],[data-qv-thumb],[data-size],[data-qty],[data-accordion] button,[data-line-qty],[data-remove-line],a[href^='#']");
    if (!el) return;

    // Nav interne -> ferme le menu mobile
    if (el.matches("a[href^='#']") && !el.hasAttribute("data-open-info")){
      if (document.body.classList.contains("menu-open")) toggleMenu(false);
      return; // smooth scroll natif
    }

    if (el.hasAttribute("data-quick")){ e.preventDefault(); openQuickView(el.getAttribute("data-quick")); return; }

    if (el.hasAttribute("data-filter")){
      state.filter = el.getAttribute("data-filter");
      renderFilters(); renderProducts(); return;
    }

    if (el.hasAttribute("data-open-cart")){ openCart(); return; }
    if (el.hasAttribute("data-close-cart")){ closeCart(); return; }
    if (el.hasAttribute("data-checkout")){ openCheckout(); return; }
    if (el.hasAttribute("data-close-checkout")){ closeCheckout(); return; }
    if (el.hasAttribute("data-close-modal")){ closeQuickView(); return; }

    if (el.hasAttribute("data-open-info")){
      e.preventDefault();
      if (document.body.classList.contains("menu-open")) toggleMenu(false);
      openInfo(el.getAttribute("data-open-info")); return;
    }
    if (el.hasAttribute("data-close-info")){ closeInfo(); return; }

    if (el.hasAttribute("data-confirm-close")){ closeConfirmation(); return; }
    if (el.hasAttribute("data-confirm-wa")){ openWhatsApp(LAST_ORDER ? LAST_ORDER.orderNumber : ""); return; }

    if (el.hasAttribute("data-submit-order")){ submitOrder(); return; }
    if (el.hasAttribute("data-wa-checkout")){ openWhatsApp(""); return; }

    // Quick-view : thumbs
    if (el.hasAttribute("data-qv-thumb")){
      const i = +el.getAttribute("data-qv-thumb");
      const p = state.currentProduct;
      $(".qv__main img").src = p.images[i];
      $$("[data-qv-thumb]").forEach(b => b.classList.toggle("active", b === el));
      return;
    }
    // Quick-view : size
    if (el.hasAttribute("data-size")){
      state.currentSize = el.getAttribute("data-size");
      $$("[data-qv-sizes] .size-btn").forEach(b => b.classList.toggle("active", b === el));
      $("[data-size-error]").classList.remove("show");
      return;
    }
    // Quick-view : qty
    if (el.hasAttribute("data-qty")){
      const delta = +el.getAttribute("data-qty");
      state.currentQty = Math.max(1, state.currentQty + delta);
      $("[data-qty-value]").textContent = state.currentQty;
      return;
    }
    // Accordéons
    if (el.closest("[data-accordion]") && el.tagName === "BUTTON"){
      el.closest("[data-accordion]").classList.toggle("open");
      return;
    }
    // Quick-view : add to cart
    if (el.hasAttribute("data-qv-add")){
      if (!state.currentSize){
        $("[data-size-error]").classList.add("show");
        return;
      }
      addToCart(state.currentProduct.id, state.currentSize, state.currentQty);
      closeQuickView();
      openCart();
      return;
    }
    // Quick-view : WhatsApp (ajoute d'abord au panier si taille choisie)
    if (el.hasAttribute("data-qv-wa")){
      if (state.currentSize){
        addToCart(state.currentProduct.id, state.currentSize, state.currentQty);
      }
      openWhatsApp("");
      return;
    }
    // Panier : quantités & suppression
    if (el.hasAttribute("data-line-qty")){
      setLineQty(+el.getAttribute("data-line-qty"), +el.getAttribute("data-delta"));
      return;
    }
    if (el.hasAttribute("data-remove-line")){
      removeLine(+el.getAttribute("data-remove-line"));
      return;
    }
  });

  // Overlay -> ferme panneaux
  $("[data-overlay]").addEventListener("click", () => {
    closeCart(); closeQuickView(); closeInfo();
  });

  // Clic sur le fond (backdrop) d'une modale -> ferme
  $("[data-modal]").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeQuickView(); });
  $("[data-info-modal]").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeInfo(); });
  $("[data-confirm]").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeConfirmation(); });

  // Fermeture menu mobile en cliquant en dehors des liens
  $("[data-mobile-nav]").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) toggleMenu(false);
  });

  // Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      closeCart(); closeQuickView(); closeInfo(); closeConfirmation();
      if (document.body.classList.contains("menu-open")) toggleMenu(false);
    }
  });

  // Recherche / tri
  $("[data-search]").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderProducts();
  });
  $("[data-sort]").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  // Enter/Espace sur les cartes (accessibilité)
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-quick][role='button']")){
      e.preventDefault();
      openQuickView(e.target.getAttribute("data-quick"));
    }
  });

  // Checkout : wilaya + type livraison
  $("[data-wilaya-select]").addEventListener("change", (e) => {
    state.wilaya = e.target.value;
    e.target.closest(".field").classList.remove("invalid");
    updateDeliveryPrices();
  });
  $$('[name="deliveryType"]').forEach(r => {
    r.addEventListener("change", () => {
      state.deliveryType = r.value;
      $$(".delivery-opts label").forEach(l => l.classList.toggle("sel", l.contains(r) && r.checked));
      $$('[name="deliveryType"]').forEach(rr => {
        rr.closest("label").classList.toggle("sel", rr.checked);
      });
      updateDeliveryPrices();
    });
  });

  // Nettoyage erreurs à la saisie
  $$("[data-checkout-form] input, [data-checkout-form] textarea, [data-checkout-form] select").forEach(inp => {
    inp.addEventListener("input", () => inp.closest(".field")?.classList.remove("invalid"));
  });

  // Newsletter
  $("[data-newsletter]").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = t();
    const input = e.target.querySelector("input");
    const msg = $("[data-nl-msg]");
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      msg.style.color = "var(--blood-bright)";
      msg.textContent = q["nl.err"];
      return;
    }
    // TODO : envoyer vers l'onglet "Newsletter VYRON" du Google Sheet
    //        (même endpoint, body { type: "newsletter", email }). Pour l'instant : log + stockage local.
    const subs = loadJSON("vyron_newsletter_v1", []);
    subs.push({ email, at: new Date().toISOString() });
    saveJSON("vyron_newsletter_v1", subs);
    if (SHEET_ENDPOINT && !SHEET_ENDPOINT.startsWith("PASTE_")){
      fetch(SHEET_ENDPOINT, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: JSON.stringify({ type:"newsletter", email, timestamp: new Date().toISOString() }) }).catch(()=>{});
    } else {
      console.log("[VYRON] Newsletter (TODO endpoint) :", email);
    }
    msg.style.color = "#4a8f6b";
    msg.textContent = q["nl.ok"];
    input.value = "";
  });

  // Featured : clic sur carte
  $("[data-featured]").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".feat")){
      e.preventDefault();
      openQuickView(e.target.getAttribute("data-quick"));
    }
  });
}

/* Info modal (FAQ / contact / livraison / retours / tailles) */
function openInfo(key){
  const data = t().info[key];
  if (!data) return;
  $("[data-info-body]").innerHTML = `<h3 style="font-size:14px;letter-spacing:.16em;margin-bottom:18px">${escapeHtml(data.title)}</h3><div style="font-size:13.5px;color:var(--off-white-dim);line-height:1.75">${data.html}</div>`;
  const m = $("[data-info-modal]");
  m.classList.add("show");
  m.setAttribute("aria-hidden", "false");
  $("[data-overlay]").classList.add("show");
  lockScroll(true);
}
function closeInfo(){
  $("[data-info-modal]").classList.remove("show");
  $("[data-info-modal]").setAttribute("aria-hidden", "true");
  maybeReleaseOverlay();
}

/* ---------- BOOT ---------- */
function init(){
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";

  populateWilayas();
  bindSocialLinks();
  setLang(state.lang);        // rend tout + applique i18n
  updateCartBadge();
  initEvents();
  initParallax();
  observeReveals();

  // Année dynamique (au cas où) — le footer affiche 2026 en dur, on garde.
  console.log("%cVYRON — Made From The Street", "color:#9b1b28;font-weight:bold");
}

document.addEventListener("DOMContentLoaded", init);
