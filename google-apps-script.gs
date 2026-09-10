/* =====================================================================
   VYRON — BACKEND COMMANDES (Google Apps Script)
   À coller dans Extensions → Apps Script du Google Sheet "Commandes VYRON".

   Ce script :
   - crée (si besoin) 2 onglets : "Commandes VYRON" et "Newsletter VYRON"
   - reçoit les POST envoyés par script.js (fonction sendToSheet + handler
     newsletter) et ajoute une ligne dans le bon onglet selon "type"
   - reste conforme au format décrit dans le README (section 4)

   Étapes : voir README.md section "4. Connecter le Google Sheet".
   Résumé : coller ce fichier → exécuter setup() une fois → Déployer en
   Application Web (exécuter en tant que Moi, accès Tout le monde) →
   coller l'URL /exec dans SHEET_ENDPOINT (script.js, section 1. CONFIG).
   ===================================================================== */

var ORDERS_SHEET_NAME = "Commandes VYRON";
var ORDERS_HEADERS = [
  "N° Commande", "Horodatage", "Nom", "Téléphone", "Wilaya", "Commune",
  "Adresse", "Type Livraison", "Produits (résumé)", "Sous-total",
  "Frais Livraison", "Total"
];

var NEWSLETTER_SHEET_NAME = "Newsletter VYRON";
var NEWSLETTER_HEADERS = ["Horodatage", "Email"];

function setup() {
  getOrCreateSheet_(ORDERS_SHEET_NAME, ORDERS_HEADERS);
  getOrCreateSheet_(NEWSLETTER_SHEET_NAME, NEWSLETTER_HEADERS);
}

function getOrCreateSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.type === "order") {
      appendOrder_(data);
    } else if (data.type === "newsletter") {
      appendNewsletter_(data);
    } else {
      return jsonOutput_({ status: "error", message: "type inconnu" });
    }

    return jsonOutput_({ status: "ok" });
  } catch (err) {
    return jsonOutput_({ status: "error", message: String(err) });
  }
}

function doGet(e) {
  return ContentService.createTextOutput("VYRON endpoint OK");
}

function appendOrder_(data) {
  var sheet = getOrCreateSheet_(ORDERS_SHEET_NAME, ORDERS_HEADERS);
  sheet.appendRow([
    data.orderNumber || "",
    data.timestamp || new Date().toISOString(),
    (data.customer && data.customer.name) || "",
    (data.customer && data.customer.phone) || "",
    data.wilaya || "",
    data.commune || "",
    data.address || "",
    data.deliveryType || "",
    itemsSummary_(data.items),
    data.subtotal || 0,
    data.deliveryFee || 0,
    data.total || 0
  ]);
}

function appendNewsletter_(data) {
  var sheet = getOrCreateSheet_(NEWSLETTER_SHEET_NAME, NEWSLETTER_HEADERS);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.email || ""
  ]);
}

function itemsSummary_(items) {
  if (!items || !items.length) return "";
  return items.map(function (it) {
    return (it.name || it.id || "?") + " (" + (it.size || "-") + ") x" + (it.qty || 1);
  }).join(", ");
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
