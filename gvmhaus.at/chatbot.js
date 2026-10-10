/**
 * GVM Haus website chatbot
 * Knowledge-base assistant (DE/HU) for gvmhaus.at
 */
(function () {
  'use strict';

  if (window.__GVM_CHATBOT_LOADED__) return;
  window.__GVM_CHATBOT_LOADED__ = true;

  var API_URL = window.GVM_CHAT_API_URL || '/api/chat';
  var USE_API = window.GVM_CHAT_USE_API === true;

  var I18N = {
    de: {
      title: 'GVM Haus Assistent',
      subtitle: 'Fragen zu Modellen, Preisen & Ablauf',
      placeholder: 'Ihre Frage…',
      send: 'Senden',
      welcome: 'Hallo! Ich bin der GVM Haus Assistent. Wobei kann ich helfen?',
      note: 'Unverbindliche Hinweise. Verbindliches Angebot nur schriftlich. Keine Rechtsberatung.',
      typing: 'schreibt…',
      chips: [
        { id: 'models', label: 'Modelle' },
        { id: 'prices', label: 'Preise' },
        { id: 'permit', label: 'Genehmigung' },
        { id: 'offer', label: 'Angebot anfordern' }
      ]
    },
    hu: {
      title: 'GVM Haus asszisztens',
      subtitle: 'Kérdések modellekről, árakról, folyamatról',
      placeholder: 'Az Ön kérdése…',
      send: 'Küldés',
      welcome: 'Szia! A GVM Haus asszisztense vagyok. Miben segíthetek?',
      note: 'Tájékoztató jellegű. Kötelező ajánlat csak írásban. Nem jogi tanács.',
      typing: 'ír…',
      chips: [
        { id: 'models', label: 'Modellek' },
        { id: 'prices', label: 'Árak' },
        { id: 'permit', label: 'Engedély' },
        { id: 'offer', label: 'Ajánlatkérés' }
      ]
    }
  };

  var DETAIL_PROMPT = {
    de: 'Technische Details (U-Werte, DoP, λ)? Schreiben Sie „Details“ oder stellen Sie eine konkrete Nachfrage.',
    hu: 'Kell a műszaki részlet (U-érték, DoP, λ)? Írja: „részletek”, vagy tegyen fel konkrét kérdést.'
  };

  var LINKS = {
    order: 'https://megrendeles.kcsn.hu/',
    contactDe: 'https://gvmhaus.at/#kontakt',
    contactHu: 'https://gvmhaus.at/hu/#kontakt',
    ablaufDe: 'https://gvmhaus.at/ablauf.html',
    ablaufHu: 'https://gvmhaus.at/hu/ablauf.html',
    modelsDe: 'https://gvmhaus.at/#modelle',
    modelsHu: 'https://gvmhaus.at/hu/#modelle',
    email: 'mailto:info@gvmhaus.at',
    phone: 'tel:+436769348474',
    blog: 'https://blog.gvmhaus.at/'
  };

  var SALES_CONTACT = {
    nameDe: 'Diána Kovács',
    nameHu: 'Kovács Diána',
    roleDe: 'Geschäftsführerin · Verkauf & Beratung',
    roleHu: 'ügyvezető · értékesítés és tanácsadás',
    email: 'info@gvmhaus.at',
    phone: '+43 676 934 8474'
  };

  function detectLang() {
    // URL path wins (same as site lang switcher), then <html lang>, then stored preference
    var path = location.pathname || '';
    if (path === '/hu' || path.indexOf('/hu/') === 0) return 'hu';
    var htmlLang = (document.documentElement.lang || '').toLowerCase();
    if (htmlLang.indexOf('hu') === 0) return 'hu';
    if (htmlLang.indexOf('de') === 0) return 'de';
    try {
      var stored = localStorage.getItem('gvm_lang');
      if (stored === 'hu' || stored === 'de') return stored;
    } catch (e) {}
    return 'de';
  }

  /** Reply language from the typed question; falls back to page language. */
  function detectReplyLang(message) {
    var raw = String(message || '');
    if (!raw.trim()) return detectLang();

    // Distinctive HU letters (before normalize strips accents)
    if (/[őűŐŰ]/.test(raw) || /[áéíóöúüÁÉÍÓÖÚÜ]/.test(raw)) {
      // Prefer HU if message has accents and no strong DE markers
      if (!/[äöüßÄÖÜ]/.test(raw)) return 'hu';
    }

    var q = normalize(raw);
    var huHints = [
      'mennyi', 'milyen', 'mikor', 'hogyan', 'miert', 'hol van', 'kell e', 'kell-e',
      'van e', 'van-e', 'benne van', 'mennyibe', 'ajanlat', 'engedely', 'szallitas',
      'falvastagsag', 'szigeteles', 'megrendeles', 'fizetes', 'futes', 'epitesi',
      'magyarorszag', 'kerdes', 'koszonom', 'koszi', 'szia', 'jo napot'
    ];
    var deHints = [
      'wie viel', 'wie lange', 'was kostet', 'brauche ich', 'genehmigung', 'lieferung',
      'heizung', 'wandstarke', 'wandstaerke', 'daemmung', 'angebot', 'bestellen',
      'oesterreich', 'osterreich', 'bitte', 'danke', 'hallo', 'guten tag'
    ];
    var hu = 0;
    var de = 0;
    for (var i = 0; i < huHints.length; i++) {
      if (q.indexOf(huHints[i]) !== -1) hu += 1;
    }
    for (var j = 0; j < deHints.length; j++) {
      if (q.indexOf(deHints[j]) !== -1) de += 1;
    }
    // Single common HU tokens
    if (/(?:^|\s)(fal|arak|ar|haz|engedely|szallitas|futes|modell|modellek)(?:\s|$)/.test(q)) {
      hu += 1;
    }
    if (/(?:^|\s)(wand|preis|preise|haus|heizung|modell|modelle)(?:\s|$)/.test(q)) {
      de += 1;
    }
    if (hu > de) return 'hu';
    if (de > hu) return 'de';
    return detectLang();
  }

  function t() {
    return I18N[detectLang()] || I18N.de;
  }

  function link(key, langOverride) {
    var lang = langOverride || detectLang();
    if (key === 'contact') return lang === 'hu' ? LINKS.contactHu : LINKS.contactDe;
    if (key === 'ablauf') return lang === 'hu' ? LINKS.ablaufHu : LINKS.ablaufDe;
    if (key === 'models') return lang === 'hu' ? LINKS.modelsHu : LINKS.modelsDe;
    if (key === 'phone') return LINKS.phone;
    return LINKS[key];
  }

  /* ---------- Knowledge base ---------- */

  var KB = [
    {
      id: 'models',
      weight: 10,
      keys: [
        'modell', 'modelle', 'modellek', 'haus', 'ház', 'größe', 'meret', 'méret', 'm2', 'nm2', 'négyzetméter',
        'gvmhaus', 'gvmhaus 15', 'gvmhaus 30', 'gvmhaus 44', 'u01', 'u02', 'u 01', 'u 02', 'welche modelle', 'milyen modellek',
        'vergleich', 'összehasonlít', 'összehasonlit'
      ],
      de: {
        text:
          'Wir bieten fünf Modelle (Richtpreise netto, unverbindlich):\n\n' +
          '• GVMHaus 15 – 15 m² – ab 13.000 € (Wochenende, Glamping, Zusatzgebäude)\n' +
          '• GVMHaus 30 – 30 m² – ab 23.000 € (komfortabel; ganzjährige Nutzung konstruktiv ausgelegt, Genehmigung prüfen)\n' +
          '• GVMHaus 44 – 44 m² – 33.000 € (Familien-Mobilhaus)\n' +
          '• GVMHausU 01 – 18 m² – 19.200 € (Gartenbüro, Gästehaus; Kurzzeitvermietung nur nach örtlichen Regeln)\n' +
          '• GVMHausU 02 – 25 m² – 26.400 € (dauerhafte Wohnnutzung – Genehmigung prüfen)\n\n' +
          'Preise und Fristen unverbindlich; verbindlich nur das schriftliche Angebot.',
        links: [
          { href: 'models', label: 'Alle Modelle ansehen' },
          { href: 'order', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Öt modellünk van (tájékoztató nettó árak):\n\n' +
          '• GVMHaus 15 – 15 m² – 13.000 €-tól (hétvége, glamping, kiegészítő épület)\n' +
          '• GVMHaus 30 – 30 m² – 23.000 €-tól (kényelmes; konstrukció egész éves használatra, engedélyt ellenőrizni)\n' +
          '• GVMHaus 44 – 44 m² – 33.000 € (családi mobilház)\n' +
          '• GVMHausU 01 – 18 m² – 19.200 € (kerti iroda, vendégház; rövid távú kiadás csak helyi szabályok szerint)\n' +
          '• GVMHausU 02 – 25 m² – 26.400 € (tartós lakhatás – engedélyt ellenőrizni)\n\n' +
          'Az árak és határidők tájékoztató jellegűek; kötelező csak az írásbeli ajánlat.',
        links: [
          { href: 'models', label: 'Modellek megtekintése' },
          { href: 'order', label: 'Ajánlatkérés' }
        ]
      }
    },
    {
      id: 'prices',
      weight: 12,
      keys: [
        'preis', 'preise', 'kosten', 'kostet', 'ár', 'arak', 'árak', 'mennyibe', 'price',
        'netto', 'teuer', 'günstig', 'olcsó', 'drága', 'kalkulation', 'angebot preis'
      ],
      de: {
        text:
          'Orientierungspreise (netto, unverbindlich):\n\n' +
          '• 15 m² ab 13.000 €\n' +
          '• 30 m² ab 23.000 €\n' +
          '• 44 m²: 33.000 €\n' +
          '• U 01: 19.200 € · U 02: 26.400 €\n\n' +
          'Lieferung, Aufstellung und Extras werden im individuellen Angebot kalkuliert. ' +
          'Online-Preise sind kein verbindliches Angebot.',
        links: [
          { href: 'contact', label: 'Angebot anfordern' },
          { href: 'order', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Tájékoztató nettó árak:\n\n' +
          '• 15 m²: 13.000 €-tól\n' +
          '• 30 m²: 23.000 €-tól\n' +
          '• 44 m²: 33.000 €\n' +
          '• U 01: 19.200 € · U 02: 26.400 €\n\n' +
          'A szállítás, felállítás és extrák az egyedi ajánlatban szerepelnek. ' +
          'A weboldali árak nem minősülnek kötelező ajánlatnak.',
        links: [
          { href: 'contact', label: 'Ajánlatot kérek' },
          { href: 'order', label: 'Ajánlatkérés' }
        ]
      }
    },
    {
      id: 'permit',
      weight: 14,
      keys: [
        'genehmigung', 'baugenehmigung', 'bauanzeige', 'behörde', 'gemeinde', 'widmung',
        'engedély', 'építési', 'epitesi', 'önkormányzat', 'onkormanyzat', 'hatóság',
        'hatosag', 'darf ich', 'aufstellen erlaubt', 'telepíthető', 'telepitheto', 'szabály',
        'österreich', 'ungarn', 'ausztria', 'magyarország', 'airbnb', 'ferien', 'wochenend',
        'hétvégi', 'hetvegi', 'dauerwohnen', 'tartós lak', 'bejelentés', 'bejelentes', 'hész', 'hesz',
        'lakóingatlan', 'lakoingatlan', 'szlovák', 'szlovak', 'slowakei', 'nem kaphat', 'engedélyt kap'
      ],
      de: {
        brief:
          'Kurz: Ob Genehmigung nötig ist, hängt vom Standort ab – Nutzung, Dauer und Gemeinde. „Mobil“ allein heißt nicht genehmigungsfrei.\n\n' +
          '• Österreich: oft Anzeige oder Bewilligung bei Dauerwohnen – vorher Gemeinde fragen.\n' +
          '• Ungarn: Modulhäuser gelten in der Praxis als Gebäude; bei Wohnnutzung meist vereinfachte Anzeige (bis ca. 300 m²) plus HÉSZ.\n\n' +
          'GVM garantiert nicht die Aufstellbarkeit – Prüfung durch den Käufer.',
        detail:
          'AT vs. HU im Detail:\n' +
          '• AT: Baurecht je nach Bundesland und Gemeinde. Bauvoranfrage empfohlen.\n' +
          '• HU: 281/2024. egyszerű bejelentés + helyi HÉSZ. „Keine Genehmigung in Ungarn“ ist zu pauschal.\n\n' +
          'Nutzung:\n' +
          '• Wochenend: Widmung/HÉSZ prüfen – oft trotzdem Anzeige.\n' +
          '• Dauerwohnen: AT meist volle Bewilligung; HU typisch vereinfachte Anzeige.\n' +
          '• Kurzzeitvermietung: zusätzlich Tourismusrecht (HU: NTAK; AT: Gemeinde, z. B. Wien 90-Tage-Regel).\n\n' +
          'U-Werte und Brandschutz: eigene Antworten zu Dämmung bzw. PIR/Brand. Keine Rechtsberatung.',
        text: '',
        links: [
          { href: 'ablauf', label: 'Ablauf & FAQ' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      },
      hu: {
        brief:
          'Röviden: az engedély a telektől és a használattól függ – nem attól, hogy „modulház”. A „mobil” önmagában nem jelent engedélymentességet.\n\n' +
          '• Ausztria: tartós lakhatásnál gyakran bejelentés vagy engedély – érdemes a községgel egyeztetni.\n' +
          '• Magyarország: a helyhez kötött modulház épületnek számít; lakó célra tipikusan egyszerű bejelentés (kb. 300 m²-ig) + HÉSZ.\n\n' +
          'A GVM nem garantálja a telepíthetőséget – az ellenőrzés a vevőé.',
        detail:
          'AT vs. HU részletesen:\n' +
          '• AT: tartományonként és községenként eltérő szabályok. Bauvoranfrage / községi egyeztetés javasolt.\n' +
          '• HU: 281/2024. egyszerű bejelentés + helyi HÉSZ. „Idehaza nem kaphat engedélyt” túl általános.\n\n' +
          'Használat:\n' +
          '• Hétvégi: HÉSZ / övezet ellenőrzése – gyakran így is bejelentés kell.\n' +
          '• Tartós lakás: AT-ban rendszerint teljes engedély; HU-n tipikusan egyszerű bejelentés.\n' +
          '• Rövid távú kiadás: külön szabályok (HU: NTAK + jegyző; AT: község/tartomány).\n\n' +
          'U-érték és tűzvédelem: külön válasz szigetelésnél / PIR-nél. Nem jogi tanács.',
        text: '',
        links: [
          { href: 'ablauf', label: 'Folyamat és GYIK' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      }
    },
    {
      id: 'delivery',
      weight: 12,
      keys: [
        'lieferzeit', 'lieferung', 'dauer', 'wann', 'tage', 'wochen', 'produktion', 'verfügbar',
        'verfuegbar', 'lager', 'sofort lieferbar', 'bereitstellung', 'termin',
        'szállítás', 'szallitas', 'szállítási', 'gyártás', 'gyartas',
        'mikor kapom', 'wie lange', 'sofort', 'azonnal', 'készlet', 'keszlet', 'elérhető',
        'elerheto', 'mikor kész', 'mikor kesz', 'várakozás', 'varakozas', 'slot', 'liefertermin',
        'hány nap', 'hany nap', 'mennyi ido', 'mennyi idő', 'kapom meg'
      ],
      de: {
        text:
          'Lieferzeit laut Lieferangebot: 90 Tage nach Bestellung und Eingang der Anzahlung (unverbindlich bis zum schriftlichen Termin).\n\n' +
          'Im Preis oft enthalten: Lieferung und Entladung an die angegebene Adresse (Arbeiten laut Grundriss).\n\n' +
          'Keine Lagerware und keine Sofortlieferung. Frühere Richtwerte 30–90 Tage je nach Modell bleiben möglich – verbindlich nur das Angebot.',
        links: [
          { href: 'ablauf', label: 'Ablauf & FAQ' },
          { href: 'contact', label: 'Verfügbarkeit anfragen' }
        ]
      },
      hu: {
        text:
          'Szállítási idő a szállítási ajánlat szerint: 90 nap a megrendelés és az előleg beérkezése után (tájékoztató a kötelező határidőig).\n\n' +
          'Árban gyakran benne: szállítás és lerakodás a megadott címen (munkák az alaprajz szerint).\n\n' +
          'Készletről azonnali szállítás nincs. Korábbi tájékoztató 30–90 nap modell szerint továbbra is lehetséges – kötelező csak az ajánlat.',
        links: [
          { href: 'ablauf', label: 'Folyamat és GYIK' },
          { href: 'contact', label: 'Határidő érdeklődés' }
        ]
      }
    },
    {
      id: 'process',
      weight: 9,
      keys: [
        'ablauf', 'prozess', 'schritte', 'wie funktioniert', 'bestellen', 'folyamat',
        'hogyan', 'lépés', 'lepes', 'megrendelés', 'megrendeles', 'így működik'
      ],
      de: {
        text:
          'Unser 4-Schritte-Prozess:\n\n' +
          '1. Beratung – kostenloser Erstkontakt\n' +
          '2. Planung – Konfiguration und schriftliches Angebot\n' +
          '3. Produktion – Fertigung mit Qualitätskontrolle\n' +
          '4. Übergabe – Lieferung und Aufstellung (wenn beauftragt), Schlüsselübergabe',
        links: [
          { href: 'ablauf', label: 'Ablauf im Detail' },
          { href: 'order', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Négy lépéses folyamatunk:\n\n' +
          '1. Tanácsadás – ingyenes első kapcsolat\n' +
          '2. Tervezés – konfiguráció és írásbeli ajánlat\n' +
          '3. Gyártás – minőségellenőrzéssel\n' +
          '4. Átadás – szállítás és felállítás (ha megrendelve), kulcsátadás',
        links: [
          { href: 'ablauf', label: 'Részletes folyamat' },
          { href: 'order', label: 'Ajánlatkérés' }
        ]
      }
    },
    {
      id: 'turnkey',
      weight: 8,
      keys: [
        'schlüsselfertig', 'schluesselfertig', 'ausstattung', 'küche', 'bad', 'inklusive',
        'kulcsrakész', 'kulcsra', 'felszereltség', 'felszereltseg', 'konyha', 'fürdő', 'furdo',
        'mi van benne', 'was ist enthalten', 'bewohnbar', 'beköltözhető', 'bekoltozheto'
      ],
      de: {
        text:
          '„Schlüsselfertig“ laut Lieferangebot: Stahlrahmen, Sandwichwände/-dach, Laminat/Vinyl, PVC-Fenster/Türen, Schiebetüren innen, Elektro (inkl. Klima-Inverter + Boiler), Bad/Küche-Anschlüsse laut Grundriss.\n\n' +
          'Im Preis oft inkl.: Lieferung und Entladung. Nicht inkl.: MwSt, Bodenplatte, LKW-Zufahrt, Baustrom – Käufersache.\n\n' +
          'Verbindlich nur das schriftliche Angebot.',
        links: [
          { href: 'models', label: 'Modelle ansehen' },
          { href: 'contact', label: 'Beratung anfragen' }
        ]
      },
      hu: {
        text:
          '„Kulcsrakész” a szállítási ajánlat szerint: acélkeret, szendvics fal/tető, laminát/vinyl, PVC nyílászárók, belső tolóajtók, villamos (inverteres klíma + bojler), fürdő/konyha csatlakozók az alaprajz szerint.\n\n' +
          'Árban gyakran benne: szállítás és lerakodás. Nincs benne: ÁFA, alaplemez, LKW-behajtás, helyszíni áram – vevő.\n\n' +
          'Kötelező csak az írásbeli ajánlat.',
        links: [
          { href: 'models', label: 'Modellek' },
          { href: 'contact', label: 'Tanácsadás' }
        ]
      }
    },
    {
      id: 'technical',
      weight: 11,
      keys: [
        'wand', 'wandstärke', 'wandstarke', 'wandstaerke', 'wanddicke', 'dicke wand',
        'dämmung', 'daemmung', 'pir', 'pur', 'sandwich', 'fenster', 'dach', 'u-wert', 'u wert',
        'schneelast', 'windlast', 'fal', 'falvastagság', 'falvastagsag', 'vastagság', 'vastagsag',
        'szigetelés', 'szigeteles', 'ablak', 'tető', 'teto', 'padló', 'padlo', 'boden', 'stahl', 'acél', 'acel',
        's355', 'ral', 'hóterhelés', 'hotterheles', 'szélterhelés', 'belmagasság', 'belmagassag',
        'technik', 'műszaki', 'muszaki', 'datenblatt', 'terméklap', 'termeklap', 'specifikáció', 'specifikacio',
        'hőtechnikai', 'hotechnikai', 'wärmeschutz', 'waermeschutz', '0,24', '0.24', '0,35', 'u-érték', 'uertek',
        'rockpur', '14509', 'lambda', 'λ', '0,022', '43 kg', '40 kg'
      ],
      de: {
        brief:
          'Die Häuser sind wärmegedämmt (Sandwichwände/-dach, PUR/PIR-Kern) – für ganzjährige Nutzung ausgelegt, nicht nur Sommer.\n\n' +
          'Heizung/Kühlung typisch per Klima-Inverter; 2-fach-Glas. Kein Passivhaus, aber komfortabel bewohnbar.',
        detail:
          'Hersteller-/Angebotsaufbau (ECOHOUSE, modellabhängig, unverbindlich):\n\n' +
          '• Stahlrahmen S355, 3 mm, Profile 120×40 / 60×40 / 50×50, geschweißt, Grundierung + 2K-Lack\n' +
          '• Außenwand: Sandwich 50 mm (ROCKPUR 50 B/B); Innenwand 30 mm (30 B/B); außen RAL 7016 / innen RAL 9010\n' +
          '• Kern: Spezifikation PUR/PIR 43 kg/m³; Paneel-DoP 40 (±10 %) kg/m³\n' +
          '• Dach: Sandwich 9 cm, leichte Neigung, Dachrinne · Boden: Stahl + Paneel + Filz + Laminat/Vinyl\n' +
          '• Fenster/Türen: PVC 5-Kammer, 2-fach-Glas\n\n' +
          'Paneel-DoP (Profil-Isolation, EN 14509:2013): λ 0,022 W/(m·K) – das ist das Paneel, nicht der eingebaute Haus-U. Brand: B–s2,d0.\n\n' +
          'Geschätzter Haus-U (kein Hersteller-Messwert): Wand 50 mm ca. 0,45; mit Stahl ca. 0,5. Wenn 9/2023 / OIB-RL 6 gilt: HU-Wand 0,24 / AT-Wand 0,35 – 50 mm erreicht das typischerweise nicht. Kein Verkaufsverbot.\n\n' +
          'Schnee-/Windlast: auf Anfrage. Verbindlich nur schriftliches Angebot. Keine Rechtsberatung.',
        text: '',
        links: [
          { href: 'ablauf', label: 'Materialien & Technik' },
          { href: 'models', label: 'Modelle & PDFs' }
        ]
      },
      hu: {
        brief:
          'A házaink hőszigetelt szendvicspanelekből készülnek (fal és tető, PUR/PIR mag) — egész éves használatra is alkalmasak, nem csak nyárra.\n\n' +
          'Fűtés/hűtés jellemzően inverteres klímával; kétrétegű üveg. Nem passzívház, de kényelmesen lakható.',
        detail:
          'Gyártói / ajánlati felépítés (ECOHOUSE, modellfüggő, tájékoztató):\n\n' +
          '• Acélkeret S355, 3 mm, profilok 120×40 / 60×40 / 50×50, hegesztett, alapozó + 2K festék\n' +
          '• Külső fal: szendvicspanel 50 mm (ROCKPUR 50 B/B); válaszfal 30 mm (30 B/B); kívül RAL 7016 / belül RAL 9010\n' +
          '• Mag: gyártói leírás PUR/PIR 43 kg/m³; panel DoP 40 (±10%) kg/m³\n' +
          '• Tető: szendvicspanel 9 cm, enyhe hajlás, eresz · padló: acél + panel + filc + laminát/vinyl\n' +
          '• Nyílászáró: PVC ötkamrás, kétrétegű üveg\n\n' +
          'Panel DoP (Profil-Isolation, EN 14509:2013): λ 0,022 W/(m·K) – ez a panel, nem a beépített ház U-ja. Tűz: B–s2,d0.\n\n' +
          'Becsült ház-U (nem gyártói mérés): fal 50 mm kb. 0,45; acéllal kb. 0,5. Ha 9/2023 / OIB-RL 6 alkalmazandó: HU fal 0,24 / AT fal 0,35 – a 50 mm ezt jellemzően nem éri el. Ez nem értékesítési tilalom.\n\n' +
          'Hó-/szélterhelés: kérésre. Kötelező csak az írásbeli ajánlat. Nem jogi tanács.',
        text: '',
        links: [
          { href: 'ablauf', label: 'Anyagok és műszaki' },
          { href: 'models', label: 'Modellek és PDF' }
        ]
      }
    },
    {
      id: 'fire_pir',
      weight: 13,
      keys: [
        'brand', 'brandschutz', 'feuer', 'brandklasse', 'euroclass', 'en 13501', 'otsz',
        'tűz', 'tuz', 'tűzvédelmi', 'tuzvedelmi', 'égés', 'eges', 'éghető', 'egheto',
        'pir tilos', 'dop', 'teljesítménynyilatkozat', 'leistungserklärung', 'leistungserklaerung',
        'oib-rl 2', 'oib rl 2', 'brennbar', 'nem éghető', 'b-s1', 'b-s2', '0497', 'csi'
      ],
      de: {
        brief:
          'PIR ist in AT und HU nicht pauschal verboten. Entscheidend ist die Brandklasse (EN 13501-1) und die örtliche Planung – nicht das Wort „PIR“.\n\n' +
          'Unsere Panele haben laut DoP die Klasse B–s2,d0. Das gilt für das Paneel; die Gesamtplanung macht der örtliche Planer/Behörde.',
        detail:
          'PIR ist in Ungarn und Österreich nicht pauschal für Wohngebäude verboten. Maßgeblich ist die Klasse nach EN 13501-1 plus Gebäude-/Risikoklasse – OTSZ (HU) bzw. OIB-RL 2 (AT), nicht das Wort „PIR“.\n\n' +
          'Paneel-DoP liegt vor (Profil-Isolation ROCKPUR 30 B/B und 50 B/B, EN 14509:2013): Reaktion auf Feuer B–s2,d0. Das gilt für das Paneel, nicht für das fertige Haus (OTSZ/OIB).\n\n' +
          'Daraus folgt weder „genehmigungsfähig“ noch „verboten“. Das entscheidet der örtliche Planer/Behörde. PIR ≠ Verkaufsverbot. Keine Rechtsberatung.',
        text: '',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'ablauf', label: 'Ablauf & FAQ' }
        ]
      },
      hu: {
        brief:
          'A PIR nincs kategórikusan kitiltva lakóépületből Magyarországon vagy Ausztriában. A tűzvédelmi osztály (EN 13501-1) és a helyi tervezés számít — nem maga a „PIR” szó.\n\n' +
          'A paneleink DoP szerint B–s2,d0 osztályúak. Ez a panelre vonatkozik; a teljes ház megfelelését a helyi tervező / hatóság dönti el.',
        detail:
          'A PIR Magyarországon és Ausztriában nincs kategórikusan kitiltva lakóépületből. Az OTSZ (54/2014. BM r.) és AT-ban az OIB-RL 2 a tűzvédelmi osztályt nézi (EN 13501-1) és az épület kockázatát – nem a „PIR” szót.\n\n' +
          'A panel DoP megvan (Profil-Isolation ROCKPUR 30 B/B és 50 B/B, EN 14509:2013): tűzzel szembeni viselkedés B–s2,d0. Ez a panel, nem a kész ház OTSZ/OIB-megfelelése.\n\n' +
          'Ebből se „engedélyezhető”, se „tilos” nem következik. Azt a helyi tervező / hatóság dönti el. PIR ≠ értékesítési tilalom. Nem jogi tanács.',
        text: '',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'ablauf', label: 'Folyamat és GYIK' }
        ]
      }
    },
    {
      id: 'power_heat',
      weight: 11,
      keys: [
        'heizung', 'elektroheizung', 'strom', 'anschluss', 'kw', 'phase', 'phasen', 'ampere',
        'fűtés', 'futes', 'áram', 'aram', 'fázis', 'fazis', 'villany', 'elektromos', 'klima',
        '220', '220v', '50hz', 'nyy', 'fi', 'inverter', 'bojler', 'boiler'
      ],
      de: {
        text:
          'Heizung/Kühlung laut Lieferangebot: typisch Klima-Inverter (Heizen + Kühlen) und Elektro-Boiler.\n\n' +
          'Zusätzliche Elektroheizung oder Infrarot-Paneele: Aufpreis.\n\n' +
          'Elektro typisch: 220 V / 50 Hz, Verteiler, 7 Steckdosen, Schalter, 3× LED. Stromanschluss auf der Baustelle ist Käufersache.\n\n' +
          'Abweichungen nur im individuellen schriftlichen Angebot.',
        links: [
          { href: 'contact', label: 'Technische Klärung' },
          { href: 'ablauf', label: 'Standortvorbereitung' }
        ]
      },
      hu: {
        text:
          'Fűtés/hűtés a szállítási ajánlat szerint: jellemzően inverteres klíma (fűtés + hűtés) és elektromos bojler.\n\n' +
          'Extra elektromos fűtés vagy infrapanel: felár.\n\n' +
          'Villamos tipikusan: 220 V / 50 Hz, elosztó, 7 konnektor, kapcsolók, 3× LED. A helyszíni áramcsatlakozás a vevő feladata.\n\n' +
          'Eltérés csak az egyedi írásbeli ajánlatban.',
        links: [
          { href: 'contact', label: 'Műszaki egyeztetés' },
          { href: 'ablauf', label: 'Helyszín előkészítés' }
        ]
      }
    },
    {
      id: 'installation',
      weight: 12,
      keys: [
        'aufstellung', 'montage', 'wer macht', 'kran', 'übergabe', 'felállítás', 'felallitas',
        'felépítés', 'felepites', 'daru', 'ki csinál', 'ki csinal', 'helyszíni', 'helyszini',
        'was macht gvm', 'mit csinál a gvm'
      ],
      de: {
        text:
          'Wenn Lieferung und Aufstellung beauftragt sind:\n' +
          '• Unser Team (GVM Haus): Schwertransport, Kran auf fertiges Fundament, Feinjustierung – oft innerhalb eines Werktages, Übergabe.\n' +
          '• Käufer: behördliche Genehmigungen, Fundament, Strom/Wasser/Abwasser typisch innerhalb von ca. 5 m, Zufahrt (mind. ca. 4 m) und Kranfläche.\n\n' +
          'Im Angebot getrennt ausgewiesen: Haus + Lieferung + Aufstellung.',
        links: [
          { href: 'ablauf', label: 'Ablauf im Detail' },
          { href: 'contact', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Ha a szállítás és a felállítás megrendelve:\n' +
          '• Csapatunk (GVM Haus): nehézszállítás, daru kész alapra, finomhangolás – gyakran 1 munkanapon belül, átadás.\n' +
          '• Vevő: hatósági engedélyek, alapozás, áram/víz/csatorna tipikusan kb. 5 m-en belül, behajtás (min. kb. 4 m) és daruterület.\n\n' +
          'Az ajánlatban külön szerepel: ház + szállítás + felállítás.',
        links: [
          { href: 'ablauf', label: 'Részletes folyamat' },
          { href: 'contact', label: 'Ajánlatot kérek' }
        ]
      }
    },
    {
      id: 'aftersales',
      weight: 12,
      keys: [
        'kundenservice', 'service', 'reklamation', 'mängel', 'mangel', 'defekt', 'garantie melden',
        'hibabejelentés', 'hibabejelentes', 'szerviz', 'utószolgáltatás', 'utoszolgaltatas',
        'hiba', 'hibat', 'jelez', 'jelenteni', 'jelenthetek', 'panasz', 'reklamacio',
        'mangel melden', 'fehler melden', 'support'
      ],
      de: {
        text:
          'Nach der Übergabe: info@gvmhaus.at oder +43 676 934 8474.\n\n' +
          'Sichtbare Mängel bitte schriftlich binnen 14 Tagen nach Übergabe anzeigen (Beschreibung, Fotos, Angebotsnummer) – gemäß AGB.\n\n' +
          'Gesetzliche Gewährleistung (AT): typisch 3 / 2 Jahre. Zusätzlich ECOHOUSE-Herstellergarantien (z. B. Stahl 10 J., Paneele 5 J.) – Frage „Garantie“ für die Übersicht.',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'ablauf', label: 'Garantie & FAQ' }
        ]
      },
      hu: {
        text:
          'Átadás után: info@gvmhaus.at vagy +43 676 934 8474.\n\n' +
          'Látható hibát az átadástól számított 14 napon belül írásban jelezze (leírás, fotó, ajánlatszám) – az ÁSZF szerint.\n\n' +
          'Törvényes szavatosság (AT): jellemzően 3 / 2 év. Emellett ECOHOUSE gyártói garanciák (pl. acélszerkezet 10 év, panelek 5 év) – kérdezzen „garancia” részletekre.',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'ablauf', label: 'Garancia és GYIK' }
        ]
      }
    },
    {
      id: 'showroom',
      weight: 10,
      keys: [
        'showroom', 'musterhaus', 'besichtigung', 'besuchen', 'ansehen vor ort', 'mintaház',
        'mintahaz', 'megtekint', 'galéria', 'galerie', 'referencia', 'fotó', 'foto', 'kann ich sehen'
      ],
      de: {
        text:
          'Einen festen Showroom listen wir online nicht. Referenzen: Galerie und Modellfotos auf gvmhaus.at, Produktblätter als PDF.\n\n' +
          'Termin / Besichtigung auf Anfrage bei ' + SALES_CONTACT.nameDe + ': ' +
          SALES_CONTACT.email + ' · ' + SALES_CONTACT.phone + '.',
        links: [
          { href: 'models', label: 'Modelle & Fotos' },
          { href: 'email', label: 'Termin anfragen' }
        ]
      },
      hu: {
        text:
          'Állandó showroom / mintaház nincs feltüntetve online. Referencia: galéria és modellfotók a gvmhaus.at-on, terméklap PDF.\n\n' +
          'Időpont / megtekintés: ' + SALES_CONTACT.nameHu + ' – ' +
          SALES_CONTACT.email + ' · ' + SALES_CONTACT.phone + '.',
        links: [
          { href: 'models', label: 'Modellek és fotók' },
          { href: 'email', label: 'Időpontot kérek' }
        ]
      }
    },
    {
      id: 'yearround',
      weight: 8,
      keys: [
        'ganzjährig', 'ganzjaehrig', 'winter', 'heizung', 'dämmung', 'daemmung',
        'egész év', 'egesz ev', 'tél', 'tel', 'fűtés', 'futes', 'szigetelés', 'szigeteles', 'pir'
      ],
      de: {
        brief:
          'Ja – für ganzjährige Nutzung ausgelegt: gedämmte Wände/Dach, typisch Klima-Inverter zum Heizen und Kühlen.\n\n' +
          'Kein Passivhaus, aber komfortabel bewohnbar. Genehmigung und U-Nachweis hängen vom Standort ab.',
        detail:
          'PUR/PIR laut DoP 40 ±10 % kg/m³, Spezifikation 43 kg/m³; 2-fach-Glas. Heizung/Kühlung typisch Klima-Inverter; extra Elektro/Infrarot Aufpreis.\n\n' +
          'Kein Passivhaus: 50-mm-Wand typisch Haus-U ca. 0,45–0,5, nicht 0,24 (HU 9/2023). Paneel-λ 0,022 ist nicht der Haus-U. Genehmigung und U-Nachweis am Standort prüfen.',
        text: '',
        links: [{ href: 'ablauf', label: 'Mehr zu Materialien & FAQ' }]
      },
      hu: {
        brief:
          'Igen — egész éves használatra terveztük: szigetelt falak és tető, jellemzően inverteres klímával fűthető és hűthető.\n\n' +
          'Nem passzívház, de kényelmesen lakható. Az engedély és az U-érték a telektől függ.',
        detail:
          'PUR/PIR a DoP szerint 40 ±10% kg/m³, a leírásban 43 kg/m³; kétrétegű üveg. Fűtés/hűtés jellemzően inverteres klíma; extra elektromos/infra felár.\n\n' +
          'Nem passzívház: a 50 mm fal tipikusan ház-U kb. 0,45–0,5, nem 0,24 (HU 9/2023). A panel λ 0,022 nem a ház U-ja. Az engedélyt és az U-t a helyszínen kell ellenőrizni.',
        text: '',
        links: [{ href: 'ablauf', label: 'Anyagok és GYIK' }]
      }
    },
    {
      id: 'moveable',
      weight: 8,
      keys: [
        'versetz', 'umsetzen', 'mobil', 'mobilhaus', 'áthelyez', 'athelyez', 'mozgatható',
        'mozgathato', 'mobilház', 'modulhaus', 'versetzbar'
      ],
      de: {
        text:
          'Ja, die Konstruktion ist auf Versetzbarkeit ausgelegt: mit Tieflader und Kran an einen neuen Standort, ' +
          'sofern Zufahrt und das Lösen der Anschlüsse möglich sind. Am neuen Standort gelten erneut örtliche Genehmigungsregeln.',
        links: [{ href: 'ablauf', label: 'FAQ: Versetzbarkeit' }]
      },
      hu: {
        text:
          'Igen, a szerkezet áthelyezésre tervezett: tiefladerrel és daruval új helyszínre vihető, ' +
          'ha a behajtás megoldott és a közművek leválaszthatók. Az új helyszínen ismét a helyi engedélyszabályok az irányadók.',
        links: [{ href: 'ablauf', label: 'GYIK: áthelyezés' }]
      }
    },
    {
      id: 'modules',
      weight: 7,
      keys: [
        'kombin', 'erweiter', 'mehrere module', 'nebeneinander', 'bővíthető', 'bovitheto',
        'több modul', 'tobb modul', 'összekapcsol', 'osszekapcsol'
      ],
      de: {
        text:
          'Ja. Module können nebeneinander gestellt und verbunden werden – z. B. zwei GVMHaus 30 für ca. 60 m². ' +
          'Erweiterungen sind auch später möglich.',
        links: [
          { href: 'models', label: 'Modelle' },
          { href: 'contact', label: 'Individuelle Planung' }
        ]
      },
      hu: {
        text:
          'Igen. A modulok egymás mellé állíthatók és összeköthetők – pl. két GVMHaus 30 kb. 60 m²-re. ' +
          'Bővítés később is lehetséges.',
        links: [
          { href: 'models', label: 'Modellek' },
          { href: 'contact', label: 'Egyedi tervezés' }
        ]
      }
    },
    {
      id: 'shipping_cost',
      weight: 10,
      keys: [
        'lieferkosten', 'transportkosten', 'fracht', 'szállítási költség', 'szallitasi koltseg',
        'fuvar', 'transportpreis', 'mennyibe szállít', 'lieferzone', 'szállítási zóna', 'deutschland',
        'slowakei', 'szlovák', 'németország', 'km preis', '€/km', 'eur/km'
      ],
      de: {
        text:
          'Wir liefern primär nach Österreich und Ungarn; andere Länder (z. B. DE, SK) nach Absprache.\n\n' +
          'Die Lieferkosten richten sich nach Entfernung vom Werk und Zufahrt ' +
          '(Sondergenehmigungen, Begleitfahrzeuge). Einen pauschalen €/km-Preis veröffentlichen wir nicht – ' +
          'den genauen Betrag erhalten Sie nach Angabe des Standorts im Angebot.',
        links: [
          { href: 'contact', label: 'Standort & Angebot' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      },
      hu: {
        text:
          'Elsődlegesen Ausztriába és Magyarországra szállítunk; más ország (pl. DE, SK) egyeztetés szerint.\n\n' +
          'A szállítási díj az üzemtől mért távolságtól és a behajtástól függ ' +
          '(külön engedélyek, kísérőautó). Nyilvános €/km lista nincs – ' +
          'a pontos összeget a helyszín megadása után az ajánlatban kapja meg.',
        links: [
          { href: 'contact', label: 'Helyszín és ajánlat' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      }
    },
    {
      id: 'vat',
      weight: 12,
      keys: [
        'ust', 'mwst', 'mehrwertsteuer', 'brutto', 'bruttopreis', 'áfa', 'afa', 'bruttó', 'brutto ar',
        'bruttó ár', 'steuer', 'tax', '20%', '27%', 'netto oder brutto'
      ],
      de: {
        text:
          'Die Online-Preise sind netto in Euro.\n\n' +
          '• Österreich: in der Regel +20 % USt\n' +
          '• Ungarn: in der Regel +27 % ÁFA\n\n' +
          'Maßgeblich sind Steuersatz und Bruttopreis nur im schriftlichen Angebot (Einzelfall, z. B. B2B, kann abweichen). Online-Preise sind unverbindlich.',
        links: [
          { href: 'contact', label: 'Angebot mit Brutto anfordern' },
          { href: 'ablauf', label: 'Preisbildung' }
        ]
      },
      hu: {
        text:
          'A weboldali árak nettó euróban értendők.\n\n' +
          '• Ausztria: általában +20 % ÁFA (USt)\n' +
          '• Magyarország: általában +27 % ÁFA\n\n' +
          'A pontos kulcs és a bruttó összeg csak az írásbeli ajánlatban kötelező (egyedi eset, pl. B2B, eltérhet). A webárak tájékoztató jellegűek.',
        links: [
          { href: 'contact', label: 'Bruttó ajánlatot kérek' },
          { href: 'ablauf', label: 'Árképzés' }
        ]
      }
    },
    {
      id: 'included',
      weight: 11,
      keys: [
        'was ist enthalten', 'was ist drin', 'inklusive', 'aufpreis', 'extra', 'terrasse', 'möbel',
        'mi van benne', 'mi nincs', 'felár', 'bútor', 'butor', 'terasz',
        'lieferumfang', 'lieferungsumfang', 'szállítási kör', 'szallitasi kor', 'montage'
      ],
      de: {
        text:
          'Laut Lieferangebot typischerweise enthalten: Konstruktion, Wände, Dach, Böden, PVC-Fenster/Türen, Innentüren, Elektro (Klima-Inverter, Boiler, LED), Wasser/Kanal (WC, Dusche, Waschbecken, Küche) laut Grundriss – plus Lieferung und Entladung.\n\n' +
          'Nicht enthalten / Käufersache: MwSt, ebene Bodenplatte, LKW-Zufahrt (Sattelzug), Stromanschluss Baustelle, Möbel, Behördendienste.\n\n' +
          'Verbindlich nur das schriftliche Angebot.',
        links: [
          { href: 'ablauf', label: 'Preisbildung & Checkliste' },
          { href: 'contact', label: 'Individuelles Angebot' }
        ]
      },
      hu: {
        text:
          'A szállítási ajánlat szerint tipikusan benne: szerkezet, falak, tető, padló, PVC nyílászárók, belső ajtók, villamos (inverteres klíma, bojler, LED), víz/csatorna (WC, zuhany, mosdó, konyha) az alaprajz szerint – plusz szállítás és lerakodás.\n\n' +
          'Nincs benne / vevő: ÁFA, sík alaplemez, LKW-behajtás (nyerges), helyszíni áram, bútor, hatósági ügyek.\n\n' +
          'Kötelező csak az írásbeli ajánlat.',
        links: [
          { href: 'ablauf', label: 'Árképzés és ellenőrzőlista' },
          { href: 'contact', label: 'Egyedi ajánlat' }
        ]
      }
    },
    {
      id: 'financing',
      weight: 12,
      keys: [
        'finanzierung', 'leasing', 'kredit', 'ratenkauf', 'bank', 'finanzieren', 'kreditkarte',
        'finanszíroz', 'finansziroz', 'lízing', 'lizing', 'hitel', 'részletfizetés', 'reszletfizetes',
        'kann ich finanzieren', 'barkredit', 'hypothek', 'thfm', 'cso', 'lakáshitel', 'lakashitel'
      ],
      de: {
        text:
          'Eigenes Leasing- oder Kreditprodukt bieten wir nicht an.\n\n' +
          'Zahlung bei uns: laut Lieferangebot 50 % / 45 % / 5 % per Überweisung (verbindlich das schriftliche Angebot).\n\n' +
          'Ob Ihre Bank oder ein Leasingpartner finanziert, klären wir individuell – bitte an info@gvmhaus.at (Modell, Standort, ungefährer Bruttobedarf).',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'contact', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Saját lízing- vagy hiteltermékünk nincs.\n\n' +
          'Nálunk a fizetés a szerződés szerint: 50 % / 45 % / 5 % átutalással (kötelező az írásbeli ajánlat).\n\n' +
          'Banki vagy lízingfinanszírozás lehetőségét egyedileg egyeztetjük – kérjük írjon: info@gvmhaus.at (modell, helyszín, hozzávetőleges bruttó igény).',
        links: [
          { href: 'email', label: 'info@gvmhaus.at' },
          { href: 'contact', label: 'Ajánlatot kérek' }
        ]
      }
    },
    {
      id: 'payment',
      weight: 11,
      keys: [
        'zahlung', 'anzahlung', 'raten', 'zahlungsplan', 'überweisung', 'ueberweisung', 'bar',
        'fizetés', 'fizetes', 'előleg', 'eloleg', 'részlet', 'reszlet', 'átutalás', 'atutalas',
        '30%', '60%', '10%', '50%', '45%', '5%', 'anzahlung', 'kaution', 'paypal', 'karte'
      ],
      de: {
        text:
          'Zahlungsplan laut Lieferangebot (3 Raten, sofern nicht anders schriftlich):\n\n' +
          '• 50 % bei Bestellung / Vertragsunterzeichnung → Produktionsbeginn\n' +
          '• 45 % vor Beladung auf den LKW\n' +
          '• 5 % bei Entladung / Übernahme\n\n' +
          'Zahlung per Überweisung laut Angebot/Rechnung. Abweichende Pläne nur schriftlich im Angebot. Finanzierung/Leasing: separat anfragen.',
        links: [
          { href: 'ablauf', label: 'Ablauf & Konditionen' },
          { href: 'contact', label: 'Angebot anfordern' }
        ]
      },
      hu: {
        text:
          'Fizetési ütem a gyártói / szállítási ajánlat szerint (3 részlet, ha írásban másként nem):\n\n' +
          '• 50 % megrendeléskor / szerződéskötéskor → gyártáskezdés\n' +
          '• 45 % a LKW-ra rakodás előtt\n' +
          '• 5 % lerakodáskor / átvételkor\n\n' +
          'Fizetés átutalással, az ajánlat/számla szerint. Eltérő ütem csak írásbeli ajánlatban. Finanszírozás/lízing: külön érdeklődés.',
        links: [
          { href: 'ablauf', label: 'Folyamat és feltételek' },
          { href: 'contact', label: 'Ajánlatot kérek' }
        ]
      }
    },
    {
      id: 'warranty',
      weight: 14,
      keys: [
        'garantie', 'garantien', 'gewährleistung', 'gewaehrleistung', 'garancia', 'szavatosság', 'szavatossag',
        'herstellergarantie', 'gyártói garancia', 'gyartoi garancia', 'garantni', 'warranty',
        'acélszerkezet', 'acelszerkezet', 'stahlkonstruktion', '10 jahr', '10 év', '10 ev',
        'sendvič', 'sandwich garantie', 'szendvicspanel garancia'
      ],
      de: {
        text:
          'Laut Lieferangebot (plus gesetzliche Gewährleistung AT):\n\n' +
          '• 2 Jahre auf Installationen und klassische Bauarbeiten (Strom, Wasser, Böden, …)\n' +
          '• Herstellergarantie Paneele: 10 Jahre\n' +
          '• Garantie Konstruktion: 10 Jahre\n\n' +
          'Gesetzlich (AT): typisch 3 Jahre unbeweglich / 2 Jahre beweglich. Sichtbare Mängel binnen 14 Tagen nach Übergabe schriftlich. ' +
          'Details und Ausnahmen im Vertrag / auf Anfrage (z. B. Klima lt. Gerätehersteller).',
        links: [
          { href: 'ablauf', label: 'Ablauf & FAQ' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      },
      hu: {
        text:
          'A szállítási ajánlat szerint (plusz AT törvényes szavatosság):\n\n' +
          '• 2 év a szerelésekre és klasszikus kivitelezésre (áram, víz, padló, …)\n' +
          '• Panelek gyártói garancia: 10 év\n' +
          '• Szerkezet garancia: 10 év\n\n' +
          'Törvényes (AT): jellemzően 3 év ingatlan jellegű / 2 év ingó. Látható hibát az átadástól 14 napon belül írásban. ' +
          'Részletek és kivételek a szerződésben / kérésre (pl. klíma a készülék gyártója szerint).',
        links: [
          { href: 'ablauf', label: 'Folyamat és GYIK' },
          { href: 'email', label: 'info@gvmhaus.at' }
        ]
      }
    },
    {
      id: 'foundation',
      weight: 15,
      keys: [
        'fundament', 'fundamente', 'bodenplatte', 'betonplatte', 'stahlbeton', 'platte',
        'alap', 'alapozás', 'alapozas', 'alaplemez', 'lemez kell', 'mekkora az alap',
        'betonlemez', 'beton lemez', 'vasbeton', 'lemezvastagság', 'lemezvastagsag',
        '12 cm', '12cm', 'sík alap', 'sik alap', 'temelj', 'pontalap', 'sávalap', 'savalap',
        'schraubfundament', 'csavaros', 'streifenfundament', 'punktfundament',
        'plattenstärke', 'plattenstaerke', 'dicke platte', 'min. 12', 'minimum 12'
      ],
      de: {
        text:
          'ECOHOUSE-Vorgabe (unverbindlich): armierte schwimmende Betonplatte – Streifen-/Punktfundament nicht nötig.\n\n' +
          '• GVMHaus 15 / Mini Lux: mind. 2,43 × 6,00 m. GVMHaus 44: Platte ≥ Außenmaß 6,00 × 7,30 m. Nie kleiner als das Haus; größer erlaubt.\n' +
          '• Bad-/WC-Seite: Plattenkante bündig mit Außenkante (Anschlüsse).\n' +
          '• Dicke mind. 12 cm, 100 % eben/horizontal. Unterbau verdichtet; Schotter empfohlen.\n\n' +
          'Platte vor Anlieferung fertig, ausgehärtet, sauber. Verantwortung: Käufer / Ausführender. Fehlerhafte Platte: keine Herstellerhaftung für Montageprobleme.',
        links: [
          { href: 'ablauf', label: 'Standort-Checkliste' },
          { href: 'contact', label: 'Technische Klärung' }
        ]
      },
      hu: {
        text:
          'ECOHOUSE előírás (tájékoztató): vasalt lebegő betonlemez – sáv-/pontalap nem kötelező.\n\n' +
          '• GVMHaus 15 / Mini Lux: min. 2,43 × 6,00 m. GVMHaus 44: lemez ≥ a ház külső mérete 6,00 × 7,30 m. Nem lehet kisebb a háznál; nagyobb megengedett.\n' +
          '• Fürdő/WC oldalon: a lemez éle egy síkban az épület külső élével (csatlakozások).\n' +
          '• Vastagság min. 12 cm, 100% sík/vízszintes. Aljzat tömörítve; kavicságy ajánlott.\n\n' +
          'A lemez a ház érkezése előtt kész, megszilárdult és tiszta. Felelős: beruházó / kivitelező. Hibás lemeznél a gyártó nem vállal felelősséget a szerelési problémákért.',
        links: [
          { href: 'ablauf', label: 'Helyszín ellenőrzőlista' },
          { href: 'contact', label: 'Műszaki egyeztetés' }
        ]
      }
    },
    {
      id: 'site_prep',
      weight: 10,
      keys: [
        'grundstück', 'grundstueck', 'zufahrt', 'kran', 'anschluss', 'standort',
        'telek', 'behajtás', 'behajtas', 'daru', 'közmű', 'kozmu', 'vorbereitung', 'előkészítés', 'elokeszites'
      ],
      de: {
        text:
          'Die Standortvorbereitung ist Käuferpflicht: befahrbare Zufahrt (mind. ca. 4 m), fertige ebene Fundamentplatte, Strom/Wasser/Abwasser typisch innerhalb von ca. 5 m, behördliche Genehmigungen, freier Kranplatz.\n\n' +
          'Fundament laut Hersteller: armierte Betonplatte mind. 12 cm (Details: Frage „Fundament“ / „alapozás“).\n\n' +
          'Lieferung/Kran setzen auf fertige Platte. Bodengutachten empfohlen.',
        links: [
          { href: 'ablauf', label: 'Standort-Checkliste' },
          { href: 'blog', label: 'Blog: Grundstück vorbereiten' }
        ]
      },
      hu: {
        text:
          'A helyszín előkészítése a vevő feladata: kb. min. 4 m behajtás, kész sík alaplemez, áram/víz/csatorna kb. 5 m-en belül, engedélyek, szabad daruterület.\n\n' +
          'Alap a gyártó szerint: vasalt betonlemez min. 12 cm (részletek: kérdezzen „alapozás”).\n\n' +
          'A szállítás/daru kész lemezre állít. Talajvizsgálat ajánlott.',
        links: [
          { href: 'ablauf', label: 'Helyszín ellenőrzőlista' },
          { href: 'blog', label: 'Blog: telek előkészítés' }
        ]
      }
    },
    {
      id: 'offer',
      weight: 13,
      keys: [
        'angebot', 'anfragen', 'kontakt', 'bestellen', 'kaufen', 'beratung',
        'ajánlat', 'ajanlat', 'kapcsolat', 'megrendel', 'vásárol', 'vasarol', 'tanácsadás', 'tanacsadas',
        'interessiert', 'szeretnék', 'szeretnek',
        'verkauf', 'verkäufer', 'verkaufer', 'vertrieb', 'sales',
        'értékesítő', 'ertekesito', 'értékesítés', 'ertekesites', 'kereskedő', 'kereskedo',
        'diána', 'diana', 'kovács diána', 'kovacs diana', 'persönliche beratung', 'személyes tanácsadás'
      ],
      de: {
        text:
          'Gerne – Ihre Ansprechpartnerin für Verkauf und Beratung:\n\n' +
          '• ' + SALES_CONTACT.nameDe + ' (' + SALES_CONTACT.roleDe + ')\n' +
          '• E-Mail: ' + SALES_CONTACT.email + '\n' +
          '• Telefon: ' + SALES_CONTACT.phone + '\n\n' +
          'Antwort in der Regel innerhalb von 24 Stunden (DE/HU). Unverbindliches Angebot jederzeit möglich.',
        links: [
          { href: 'email', label: 'E-Mail an Diána / Team' },
          { href: 'phone', label: 'Anrufen: +43 676 934 8474' },
          { href: 'order', label: 'Jetzt online bestellen' },
          { href: 'contact', label: 'Kontaktformular' }
        ]
      },
      hu: {
        text:
          'Szívesen – értékesítési és tanácsadói kapcsolattartó:\n\n' +
          '• ' + SALES_CONTACT.nameHu + ' (' + SALES_CONTACT.roleHu + ')\n' +
          '• E-mail: ' + SALES_CONTACT.email + '\n' +
          '• Telefon: ' + SALES_CONTACT.phone + '\n\n' +
          'Általában 24 órán belül válaszolunk (HU/DE). Online megrendelés vagy kötelezettségmentes ajánlat bármikor kérhető.',
        links: [
          { href: 'email', label: 'E-mail Diánának / a csapatnak' },
          { href: 'phone', label: 'Hívás: +43 676 934 8474' },
          { href: 'order', label: 'Ajánlatkérés' },
          { href: 'contact', label: 'Kapcsolati űrlap' }
        ]
      }
    },
    {
      id: 'contact_only',
      weight: 10,
      keys: [
        'email', 'e-mail', 'telefon', 'erreichen', 'erreichen sie', 'info@', 'írjanak', 'irjanak',
        'anrufen', 'hívás', 'hivas', 'telefonszám', 'telefonszam', 'whatsapp'
      ],
      de: {
        text:
          'Verkauf & Beratung – ' + SALES_CONTACT.nameDe + ':\n' +
          '• ' + SALES_CONTACT.email + '\n' +
          '• ' + SALES_CONTACT.phone + '\n\n' +
          'Antwort in der Regel innerhalb von 24 Stunden.',
        links: [
          { href: 'email', label: 'E-Mail schreiben' },
          { href: 'phone', label: 'Anrufen' },
          { href: 'contact', label: 'Kontaktformular' }
        ]
      },
      hu: {
        text:
          'Értékesítés és tanácsadás – ' + SALES_CONTACT.nameHu + ':\n' +
          '• ' + SALES_CONTACT.email + '\n' +
          '• ' + SALES_CONTACT.phone + '\n\n' +
          'Általában 24 órán belül válaszolunk.',
        links: [
          { href: 'email', label: 'E-mail küldése' },
          { href: 'phone', label: 'Telefonálás' },
          { href: 'contact', label: 'Kapcsolati űrlap' }
        ]
      }
    },
    {
      id: 'bot_identity',
      weight: 6,
      keys: [
        'wer bist du', 'bist du ein bot', 'ki vagy', 'robot vagy', 'mesterséges', 'ai', 'chatgpt', 'assistent'
      ],
      de: {
        text:
          'Ich bin der digitale Assistent von GVM Haus. Ich beantworte häufige Fragen zu Modellen, Preisen und Ablauf.\n\n' +
          'Für persönliche Beratung wenden Sie sich bitte an ' + SALES_CONTACT.nameDe +
          ' (' + SALES_CONTACT.roleDe + '): ' + SALES_CONTACT.email + ' · ' + SALES_CONTACT.phone + '.',
        links: [
          { href: 'email', label: 'Diána / Team schreiben' },
          { href: 'phone', label: 'Anrufen' },
          { href: 'contact', label: 'Kontaktformular' }
        ]
      },
      hu: {
        text:
          'A GVM Haus digitális asszisztense vagyok. Gyakori kérdésekre válaszolok modellekről, árakról és folyamatról.\n\n' +
          'Személyes tanácsadás: ' + SALES_CONTACT.nameHu +
          ' (' + SALES_CONTACT.roleHu + ') – ' + SALES_CONTACT.email + ' · ' + SALES_CONTACT.phone + '.',
        links: [
          { href: 'email', label: 'Írás Diánának / a csapatnak' },
          { href: 'phone', label: 'Telefonálás' },
          { href: 'contact', label: 'Kapcsolati űrlap' }
        ]
      }
    }
  ];

  var FALLBACK = {
    de: {
      text:
        'Dazu habe ich keine sichere Standardantwort. Bitte schreiben Sie an info@gvmhaus.at – ' +
        'wir melden uns in der Regel innerhalb von 24 Stunden. Alternativ können Sie ein unverbindliches Angebot anfordern.',
      links: [
        { href: 'contact', label: 'Angebot anfordern' },
        { href: 'email', label: 'info@gvmhaus.at' },
        { href: 'ablauf', label: 'FAQ öffnen' }
      ]
    },
    hu: {
      text:
        'Erre nincs megbízható standard válaszom. Kérjük, írjon az info@gvmhaus.at címre – ' +
        'általában 24 órán belül jelentkezünk. Alternatívaként kérhet kötelezettségmentes ajánlatot.',
      links: [
        { href: 'contact', label: 'Ajánlatot kérek' },
        { href: 'email', label: 'info@gvmhaus.at' },
        { href: 'ablauf', label: 'GYIK megnyitása' }
      ]
    }
  };

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9@.\s€]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function wantsDetail(message) {
    var q = normalize(message);
    if (!q) return false;
    var hints = [
      'reszletesen', 'reszlet', 'muszaki', 'technisch', 'technikai', 'technik', 'details', 'detail',
      'genauer', 'genau', 'u-ertek', 'u wert', 'u érték', 'lambda', 'dop', '14509', 'otsz', 'oib',
      '9/2023', 'rockpur', '0,24', '0.24', '0,45', '0.45', '0,022', 'en 14509', 'teljes', 'vollständig',
      'mindent', 'alles', 'mélyebb', 'melyebb', 'számok', 'szamok', 'zahlen'
    ];
    for (var i = 0; i < hints.length; i++) {
      if (q.indexOf(hints[i]) !== -1) return true;
    }
    return false;
  }

  function scoreIntent(intent, q) {
    var score = 0;
    var keys = intent.keys || [];
    var seen = {};
    for (var i = 0; i < keys.length; i++) {
      var k = normalize(keys[i]);
      if (!k || seen[k]) continue;
      seen[k] = true;
      var hit = false;
      // Short/prefix-prone tokens must match as whole words
      if (k.length <= 6 && k.indexOf(' ') === -1) {
        var re = new RegExp('(?:^|\\s)' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|$)');
        hit = re.test(q);
      } else {
        hit = q.indexOf(k) !== -1;
      }
      if (hit) {
        score += (k.length >= 6 ? 3 : 2) * (intent.weight || 1);
      }
    }
    return score;
  }

  function answerLocal(message, chipId) {
    // Chips follow page UI language; free text follows question language
    var lang = chipId ? detectLang() : detectReplyLang(message);
    if (chipId) {
      for (var i = 0; i < KB.length; i++) {
        if (KB[i].id === chipId) {
          return resolveAnswer(KB[i], lang, '');
        }
      }
    }
    var q = normalize(message);
    if (!q) return resolveAnswer(null, lang, message);

    var best = null;
    var bestScore = 0;
    for (var j = 0; j < KB.length; j++) {
      var s = scoreIntent(KB[j], q);
      if (s > bestScore) {
        bestScore = s;
        best = KB[j];
      }
    }
    if (!best || bestScore < 6) return resolveAnswer(null, lang, message);
    return resolveAnswer(best, lang, message);
  }

  function resolveAnswer(intent, lang, message) {
    var raw = intent ? intent[lang] || intent.de : FALLBACK[lang] || FALLBACK.de;
    var text = raw.text;
    if (raw.brief) {
      if (wantsDetail(message) && raw.detail) {
        text = raw.brief + '\n\n' + raw.detail;
      } else {
        text = raw.brief + '\n\n' + (DETAIL_PROMPT[lang] || DETAIL_PROMPT.de);
      }
    }
    var links = (raw.links || []).map(function (L) {
      return {
        href: link(L.href, lang) || L.href,
        label: L.label
      };
    });
    return { text: text, links: links };
  }

  function answerViaApi(message) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message: message,
        lang: detectReplyLang(message),
        page: location.pathname
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('api');
      return res.json();
    }).then(function (data) {
      if (!data || !data.text) throw new Error('empty');
      return {
        text: data.text,
        links: Array.isArray(data.links) ? data.links : []
      };
    });
  }

  /* ---------- UI ---------- */

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatText(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function ensureCss() {
    if (document.getElementById('gvm-chatbot-css')) return;
    var linkTag = document.createElement('link');
    linkTag.id = 'gvm-chatbot-css';
    linkTag.rel = 'stylesheet';
    linkTag.href = '/chatbot.css?v=20260901';
    document.head.appendChild(linkTag);
  }

  function build() {
    ensureCss();
    var ui = t();

    var root = el('div');
    root.id = 'gvm-chat-root';
    // Ne data-lang legyen: a marketing CSS [data-lang="hu"]{display:none} elrejtené a widgetet.
    root.setAttribute('data-gvm-lang', detectLang());

    var panel = el('div', 'gvm-chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', ui.title);
    panel.hidden = true;

    var header = el('div', 'gvm-chat-header');
    header.innerHTML =
      '<div class="gvm-chat-header-mark">GVM</div>' +
      '<div><p class="gvm-chat-title">' +
      escapeHtml(ui.title) +
      '</p><p>' +
      escapeHtml(ui.subtitle) +
      '</p></div>';

    var messages = el('div', 'gvm-chat-messages');
    messages.setAttribute('aria-live', 'polite');

    var quick = el('div', 'gvm-chat-quick');
    ui.chips.forEach(function (c) {
      var chip = el('button', 'gvm-chat-chip');
      chip.type = 'button';
      chip.textContent = c.label;
      chip.dataset.chipId = c.id;
      quick.appendChild(chip);
    });

    var inputRow = el('div', 'gvm-chat-input-row');
    var input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = ui.placeholder;
    input.setAttribute('aria-label', ui.placeholder);
    var sendBtn = el('button', 'gvm-chat-send');
    sendBtn.type = 'button';
    sendBtn.textContent = ui.send;
    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    var note = el('div', 'gvm-chat-note', escapeHtml(ui.note));

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(quick);
    panel.appendChild(inputRow);
    panel.appendChild(note);

    var fab = el('button', 'gvm-chat-fab');
    fab.type = 'button';
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', ui.title);
    fab.innerHTML =
      '<svg class="gvm-icon-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5v2h12V9H6zm0 4v2h8v-2H6z"/></svg>' +
      '<svg class="gvm-icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>';

    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);

    var openedOnce = false;
    var busy = false;

    function addBubble(role, payload) {
      var b = el('div', 'gvm-chat-bubble gvm-chat-bubble--' + role);
      if (typeof payload === 'string') {
        b.innerHTML = formatText(payload);
      } else {
        b.innerHTML = formatText(payload.text || '');
        if (payload.links && payload.links.length) {
          var box = el('div', 'gvm-chat-links');
          payload.links.forEach(function (L) {
            var a = document.createElement('a');
            a.href = L.href;
            a.textContent = L.label;
            if (L.href.indexOf('http') === 0) {
              a.target = '_blank';
              a.rel = 'noopener';
            }
            box.appendChild(a);
          });
          b.appendChild(box);
        }
      }
      messages.appendChild(b);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping(show) {
      var existing = messages.querySelector('.gvm-chat-typing');
      if (existing) existing.remove();
      if (!show) return;
      var tip = el('div', 'gvm-chat-typing');
      tip.innerHTML = '<span></span><span></span><span></span>';
      tip.setAttribute('aria-label', ui.typing);
      messages.appendChild(tip);
      messages.scrollTop = messages.scrollHeight;
    }

    function openPanel() {
      panel.hidden = false;
      requestAnimationFrame(function () {
        panel.classList.add('is-open');
      });
      fab.setAttribute('aria-expanded', 'true');
      if (!openedOnce) {
        openedOnce = true;
        addBubble('bot', ui.welcome);
      }
      setTimeout(function () {
        input.focus();
      }, 220);
    }

    function closePanel() {
      panel.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      setTimeout(function () {
        if (!panel.classList.contains('is-open')) panel.hidden = true;
      }, 220);
    }

    function toggle() {
      if (panel.classList.contains('is-open')) closePanel();
      else openPanel();
    }

    function handleAnswer(ans) {
      showTyping(false);
      addBubble('bot', ans);
      busy = false;
      sendBtn.disabled = false;
    }

    function ask(text, chipId) {
      var msg = String(text || '').trim();
      if ((!msg && !chipId) || busy) return;
      busy = true;
      sendBtn.disabled = true;
      if (msg) addBubble('user', msg);
      else if (chipId) {
        var chipLabel = ui.chips.filter(function (c) {
          return c.id === chipId;
        })[0];
        addBubble('user', chipLabel ? chipLabel.label : chipId);
      }
      input.value = '';
      showTyping(true);

      var local = answerLocal(msg, chipId);
      var finish = function (ans) {
        setTimeout(function () {
          handleAnswer(ans);
        }, 280 + Math.min(400, (ans.text || '').length * 4));
      };

      if (USE_API && msg && !chipId) {
        answerViaApi(msg)
          .then(finish)
          .catch(function () {
            finish(local);
          });
      } else {
        finish(local);
      }
    }

    fab.addEventListener('click', toggle);
    sendBtn.addEventListener('click', function () {
      ask(input.value);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        ask(input.value);
      }
    });
    quick.addEventListener('click', function (e) {
      var btn = e.target.closest('.gvm-chat-chip');
      if (!btn) return;
      ask('', btn.dataset.chipId);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
